import { db, pool, notifications, shipmentsTable, settingsTable } from "@workspace/db";
import { and, gte, eq, lt, notInArray, isNotNull, count } from "drizzle-orm";
import { sendWeeklyReport } from "./weekly-report";
import type { Server as SocketIOServer } from "socket.io";
import { notify } from "./notify";
import { logger } from "./logger";

const CHECK_INTERVAL_MS = 60 * 60 * 1000;
const ABGESCHLOSSEN = ["Abgefertigt", "Storniert"];

// ── Monatliche Abstimmungs-Erinnerung ────────────────────────────────────────

async function hasMonthlyAbstimmungBeenSent(): Promise<boolean> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const existing = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(and(eq(notifications.type, "abstimmung_monthly"), gte(notifications.createdAt, startOfMonth)))
    .limit(1);
  return existing.length > 0;
}

async function runMonthlyCheck(io: SocketIOServer) {
  const now = new Date();
  if (now.getDate() !== 1) return;
  if (await hasMonthlyAbstimmungBeenSent()) return;

  const monthName = now.toLocaleString("de-DE", { month: "long", year: "numeric" });
  logger.info("Sending monthly Abstimmung reminder");

  await notify(io, {
    targetRoles: ["comet_admin", "comet_leitstand"],
    title: "Monatliche Abstimmung fällig",
    message: `Die Paletten-Abstimmung für ${monthName} muss durchgeführt werden.`,
    type: "warning",
    linkTo: "/abstimmungen",
  });
}

// ── Offene Verladungen (ETA in Vergangenheit, nicht abgeschlossen) ────────────

async function hasOffeneVerladungenBeenSentToday(): Promise<boolean> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const existing = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(and(eq(notifications.type, "offene_verladungen"), gte(notifications.createdAt, startOfDay)))
    .limit(1);
  return existing.length > 0;
}

async function runOffeneVerladungenCheck(io: SocketIOServer) {
  if (await hasOffeneVerladungenBeenSentToday()) return;

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [result] = await db
    .select({ anzahl: count() })
    .from(shipmentsTable)
    .where(
      and(
        isNotNull(shipmentsTable.etaDate),
        lt(shipmentsTable.etaDate, today),
        notInArray(shipmentsTable.status, ABGESCHLOSSEN)
      )
    );

  const anzahl = result?.anzahl ?? 0;
  if (anzahl === 0) return;

  logger.info({ anzahl }, "Offene Verladungen aus der Vergangenheit gefunden");

  await notify(io, {
    targetRoles: ["comet_admin", "comet_leitstand"],
    title: `${anzahl} offene Verladung${anzahl !== 1 ? "en" : ""} aus der Vergangenheit`,
    message: `${anzahl} Verladung${anzahl !== 1 ? "en haben" : " hat"} einen vergangenen Verladetag und ${anzahl !== 1 ? "sind" : "ist"} noch nicht abgefertigt.`,
    type: "warning",
    linkTo: "/shipments",
  });
}

// ── Wöchentlicher Bericht ─────────────────────────────────────────────────────

async function hasWeeklyReportBeenSentThisWeek(): Promise<boolean> {
  const now = new Date();
  const daysSinceMonday = (now.getDay() + 6) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysSinceMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const result = await pool.query<{ sent_at: Date }>(
    "SELECT sent_at FROM report_weekly_log WHERE sent_at >= $1 LIMIT 1",
    [startOfWeek.toISOString()],
  );
  return result.rows.length > 0;
}

async function ensureReportWeeklyLogTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS report_weekly_log (
      id SERIAL PRIMARY KEY,
      sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function runWeeklyReportCheck() {
  const rows = await db.select().from(settingsTable);
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));

  if (s.report_weekly_enabled !== "1") return;

  const configuredDay = parseInt(s.report_weekly_day || "1", 10);
  const configuredHour = parseInt((s.report_weekly_time || "07:00").split(":")[0], 10);

  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay();

  if (currentDay !== configuredDay) return;
  if (now.getHours() !== configuredHour) return;
  if (await hasWeeklyReportBeenSentThisWeek()) return;

  await sendWeeklyReport();
  await pool.query("INSERT INTO report_weekly_log (sent_at) VALUES (NOW())");
  logger.info("Wöchentlicher Bericht erfolgreich versendet und protokolliert");
}

// ── Scheduler starten ─────────────────────────────────────────────────────────

async function runAllChecks(io: SocketIOServer) {
  // Monatliche Abstimmungs-Erinnerung vorerst deaktiviert
  // await runMonthlyCheck(io).catch((e) =>
  //   logger.warn({ err: e }, "Monthly Abstimmung check failed — non-fatal")
  // );
  await runOffeneVerladungenCheck(io).catch((e) =>
    logger.warn({ err: e }, "Offene Verladungen check failed — non-fatal")
  );
  await runWeeklyReportCheck().catch((e) =>
    logger.warn({ err: e }, "Weekly report check failed — non-fatal")
  );
}

export { ensureReportWeeklyLogTable };

export function startScheduler(io: SocketIOServer) {
  runAllChecks(io);
  setInterval(() => runAllChecks(io), CHECK_INTERVAL_MS);
  logger.info("Scheduler started");
}
