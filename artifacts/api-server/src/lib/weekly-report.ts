import { db, pool, settingsTable } from "@workspace/db";
import { createEmailTransport } from "./email";
import { logger } from "./logger";

interface StatusRow { status: string; anzahl: string }
interface LkwRow { lkw_art: string | null; anzahl: string }
interface SpedRow { name: string | null; anzahl: string }
interface DayRow { day_label: string; dow: number; anzahl: string }

interface AuftragSped {
  spediteurNr: string;
  csvName: string;
  speditionDbName: string | null;
  auftraege: number;
  paletten: number;
}

interface ReportData {
  appName: string;
  companyName: string;
  dateFrom: string;
  dateTo: string;
  total: number;
  statusRows: StatusRow[];
  lkwRows: LkwRow[];
  spedRows: SpedRow[];
  dayRows: DayRow[];
  offeneVerladungen: number;
  offeneTickets: number;
  auftragUploadedAt: string | null;
  auftragFilename: string | null;
  auftragTotalAuftraege: number;
  auftragTotalPaletten: number;
  auftragTopSpeds: AuftragSped[];
}

const DOW_LABELS: Record<number, string> = {
  1: "Mo", 2: "Di", 3: "Mi", 4: "Do", 5: "Fr", 6: "Sa", 7: "So",
};

function tableRows(rows: { label: string; anzahl: number }[], unit = ""): string {
  if (rows.length === 0)
    return "<tr><td colspan='2' style='padding:8px 12px;color:#888'>Keine Daten</td></tr>";
  return rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${r.label || "—"}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600">${r.anzahl}${unit ? `&thinsp;${unit}` : ""}</td></tr>`,
    )
    .join("");
}

function buildHtml(d: ReportData): string {
  const statusColor: Record<string, string> = {
    Angemeldet: "#3b82f6", Geplant: "#8b5cf6",
    Verladen: "#f59e0b", Abgefertigt: "#10b981", Storniert: "#ef4444",
  };

  const statusBadges = d.statusRows
    .map((r) => {
      const color = statusColor[r.status] ?? "#6b7280";
      return `<span style="display:inline-block;margin:3px 4px 3px 0;padding:3px 10px;border-radius:12px;background:${color}20;color:${color};font-size:12px;font-weight:600">${r.status}&nbsp;<strong>${r.anzahl}</strong></span>`;
    })
    .join("");

  const lkwFiltered = d.lkwRows.filter((r) => r.lkw_art);
  const spedFiltered = d.spedRows.filter((r) => r.name);

  // Daily bar chart
  const maxDay = Math.max(...d.dayRows.map((r) => parseInt(r.anzahl, 10)), 1);
  const dayBars = d.dayRows.length > 0
    ? `<div style="margin-bottom:24px">
      <h3 style="margin:0 0 12px;font-size:13px;color:#5a7fa0;text-transform:uppercase;letter-spacing:0.5px">Tagesübersicht</h3>
      <table width="100%" style="border-collapse:collapse">
        ${d.dayRows.map((r) => {
          const n = parseInt(r.anzahl, 10);
          const pct = Math.round((n / maxDay) * 100);
          const dow = r.dow;
          const isWeekend = dow >= 6;
          return `<tr>
            <td style="padding:4px 10px 4px 0;width:28px;font-size:12px;font-weight:600;color:${isWeekend ? "#9ca3af" : "#374151"};white-space:nowrap">${DOW_LABELS[dow] ?? r.day_label}</td>
            <td style="padding:4px 0">
              <div style="background:#e5e7eb;border-radius:4px;height:18px;position:relative">
                <div style="background:${isWeekend ? "#d1d5db" : "#3b82f6"};border-radius:4px;height:18px;width:${pct}%;min-width:${n > 0 ? "18px" : "0"}"></div>
              </div>
            </td>
            <td style="padding:4px 0 4px 10px;width:30px;text-align:right;font-size:12px;font-weight:700;color:#374151">${n}</td>
          </tr>`;
        }).join("")}
      </table>
    </div>`
    : "";

  // Mini KPI row
  const kpiRow = `<div style="display:flex;gap:12px;margin-bottom:24px">
    <div style="flex:1;background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;text-align:center">
      <div style="font-size:11px;color:#92400e;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px">Offene Verladungen</div>
      <div style="font-size:28px;font-weight:800;color:#92400e;line-height:1">${d.offeneVerladungen}</div>
    </div>
    <div style="flex:1;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;text-align:center">
      <div style="font-size:11px;color:#166534;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px">Offene Tickets</div>
      <div style="font-size:28px;font-weight:800;color:#166534;line-height:1">${d.offeneTickets}</div>
    </div>
  </div>`;

  // Auftragsauswertung section
  const auftragSection = d.auftragTotalPaletten > 0
    ? `<div style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      <div style="background:#f8fafc;border-bottom:1px solid #e5e7eb;padding:10px 16px;display:flex;align-items:baseline;gap:10px">
        <h3 style="margin:0;font-size:13px;color:#5a7fa0;text-transform:uppercase;letter-spacing:0.5px">SAP-Auswertung</h3>
        ${d.auftragUploadedAt ? `<span style="font-size:11px;color:#9ca3af">${d.auftragUploadedAt}${d.auftragFilename ? ` · ${d.auftragFilename}` : ""}</span>` : ""}
      </div>
      <div style="display:flex;border-bottom:1px solid #f0f0f0">
        <div style="flex:1;padding:12px 16px;text-align:center;border-right:1px solid #f0f0f0">
          <div style="font-size:11px;color:#6b7280;margin-bottom:2px">Aufträge gesamt</div>
          <div style="font-size:22px;font-weight:800;color:#1e3a5f">${d.auftragTotalAuftraege.toLocaleString("de-DE")}</div>
        </div>
        <div style="flex:1;padding:12px 16px;text-align:center">
          <div style="font-size:11px;color:#6b7280;margin-bottom:2px">Paletten gesamt</div>
          <div style="font-size:22px;font-weight:800;color:#1e3a5f">${d.auftragTotalPaletten.toLocaleString("de-DE")}</div>
        </div>
      </div>
      ${d.auftragTopSpeds.length > 0 ? `
      <table width="100%" style="border-collapse:collapse">
        <thead><tr style="background:#f8fafc">
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;font-weight:600">Spedition</th>
          <th style="padding:8px 12px;text-align:right;font-size:11px;color:#6b7280;font-weight:600">Aufträge</th>
          <th style="padding:8px 12px;text-align:right;font-size:11px;color:#6b7280;font-weight:600">Paletten</th>
        </tr></thead>
        <tbody>
          ${d.auftragTopSpeds.map((s, i) =>
            `<tr style="${i % 2 === 1 ? "background:#f9fafb" : ""}">
              <td style="padding:8px 12px;border-top:1px solid #f0f0f0;font-size:13px">${s.speditionDbName ?? s.csvName}</td>
              <td style="padding:8px 12px;border-top:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:600">${s.auftraege}</td>
              <td style="padding:8px 12px;border-top:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:600">${s.paletten.toLocaleString("de-DE")}</td>
            </tr>`
          ).join("")}
        </tbody>
      </table>` : ""}
    </div>`
    : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
<div style="max-width:620px;margin:24px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

  <div style="background:#1e3a5f;padding:24px 28px 20px">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">${d.appName}</h1>
    <p style="margin:6px 0 0;color:#a8c0d9;font-size:13px">Wöchentlicher Bericht · ${d.dateFrom} – ${d.dateTo}</p>
  </div>

  <div style="padding:24px 28px">

    <div style="background:#f0f7ff;border:1px solid #d0e8ff;border-radius:8px;padding:16px 20px;margin-bottom:20px;text-align:center">
      <div style="font-size:13px;color:#5a7fa0;margin-bottom:4px">Verladungen in diesem Zeitraum</div>
      <div style="font-size:42px;font-weight:800;color:#1e3a5f;line-height:1">${d.total}</div>
    </div>

    ${kpiRow}

    ${d.statusRows.length > 0 ? `<div style="margin-bottom:24px">
      <h3 style="margin:0 0 10px;font-size:13px;color:#5a7fa0;text-transform:uppercase;letter-spacing:0.5px">Status</h3>
      <div>${statusBadges}</div>
    </div>` : ""}

    ${dayBars}

    ${lkwFiltered.length > 0 ? `<div style="margin-bottom:24px">
      <h3 style="margin:0 0 10px;font-size:13px;color:#5a7fa0;text-transform:uppercase;letter-spacing:0.5px">LKW-Art</h3>
      <table width="100%" style="border-collapse:collapse;background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee">
        <thead><tr style="background:#f0f0f0">
          <th style="padding:8px 12px;text-align:left;font-size:12px;color:#666">Art</th>
          <th style="padding:8px 12px;text-align:right;font-size:12px;color:#666">Anzahl</th>
        </tr></thead>
        <tbody>${tableRows(lkwFiltered.map((r) => ({ label: r.lkw_art!, anzahl: parseInt(r.anzahl, 10) })))}</tbody>
      </table>
    </div>` : ""}

    ${spedFiltered.length > 0 ? `<div style="margin-bottom:24px">
      <h3 style="margin:0 0 10px;font-size:13px;color:#5a7fa0;text-transform:uppercase;letter-spacing:0.5px">Top-Speditionen (Verladungen)</h3>
      <table width="100%" style="border-collapse:collapse;background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee">
        <thead><tr style="background:#f0f0f0">
          <th style="padding:8px 12px;text-align:left;font-size:12px;color:#666">Spedition</th>
          <th style="padding:8px 12px;text-align:right;font-size:12px;color:#666">Verladungen</th>
        </tr></thead>
        <tbody>${tableRows(spedFiltered.map((r) => ({ label: r.name!, anzahl: parseInt(r.anzahl, 10) })))}</tbody>
      </table>
    </div>` : ""}

    ${auftragSection}

  </div>

  <div style="padding:16px 28px;background:#f9f9f9;border-top:1px solid #eee">
    <p style="margin:0;font-size:11px;color:#aaa;text-align:center">
      Automatisch generiert von <strong>${d.appName}</strong> · ${d.companyName}
    </p>
  </div>

</div>
</body></html>`;
}

function buildText(d: ReportData): string {
  const lines = [
    `${d.appName} – Wöchentlicher Bericht`,
    `Zeitraum: ${d.dateFrom} – ${d.dateTo}`,
    ``,
    `Gesamt: ${d.total} Verladung${d.total !== 1 ? "en" : ""}`,
    `Offene Verladungen: ${d.offeneVerladungen}`,
    `Offene Tickets: ${d.offeneTickets}`,
    ``,
    `Nach Status:`,
    ...d.statusRows.map((r) => `  ${r.status}: ${r.anzahl}`),
  ];
  if (d.dayRows.length > 0) {
    lines.push(``, `Tagesübersicht:`);
    d.dayRows.forEach((r) => lines.push(`  ${DOW_LABELS[r.dow] ?? r.day_label}: ${r.anzahl}`));
  }
  if (d.auftragTotalPaletten > 0) {
    lines.push(``, `SAP-Auswertung:`);
    if (d.auftragUploadedAt) lines.push(`  Stand: ${d.auftragUploadedAt}`);
    lines.push(`  Aufträge gesamt: ${d.auftragTotalAuftraege}`);
    lines.push(`  Paletten gesamt: ${d.auftragTotalPaletten}`);
    d.auftragTopSpeds.forEach((s) =>
      lines.push(`  ${s.speditionDbName ?? s.csvName}: ${s.auftraege} Auft. / ${s.paletten} Pal.`),
    );
  }
  return lines.join("\n");
}

export async function sendWeeklyReport(): Promise<void> {
  const rows = await db.select().from(settingsTable);
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));

  const recipients = (s.report_weekly_email ?? "").trim();
  if (!recipients) {
    logger.warn("Weekly report: keine Empfänger konfiguriert");
    return;
  }

  const appName = s.app_name || "Easy-Verladung";
  const companyName = s.company_name || appName;
  const from = s.email_from || process.env.SMTP_FROM || "noreply@comet-seasonal.de";

  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);
  const until = new Date(now);
  until.setHours(23, 59, 59, 999);

  const [totalRes, statusRes, lkwRes, spedRes, dayRes, offeneRes, ticketRes, auftragRes] =
    await Promise.all([
      pool.query<{ total: string }>(
        "SELECT COUNT(*) AS total FROM shipments WHERE created_at >= $1 AND created_at <= $2",
        [since.toISOString(), until.toISOString()],
      ),
      pool.query<StatusRow>(
        `SELECT status, COUNT(*)::text AS anzahl FROM shipments
         WHERE created_at >= $1 AND created_at <= $2
         GROUP BY status ORDER BY anzahl DESC`,
        [since.toISOString(), until.toISOString()],
      ),
      pool.query<LkwRow>(
        `SELECT lkw_art, COUNT(*)::text AS anzahl FROM shipments
         WHERE created_at >= $1 AND created_at <= $2
         GROUP BY lkw_art ORDER BY anzahl DESC`,
        [since.toISOString(), until.toISOString()],
      ),
      pool.query<SpedRow>(
        `SELECT s.name, COUNT(*)::text AS anzahl
         FROM shipments sh LEFT JOIN speditionen s ON sh.spedition_id = s.id
         WHERE sh.created_at >= $1 AND sh.created_at <= $2
         GROUP BY s.name ORDER BY anzahl DESC LIMIT 10`,
        [since.toISOString(), until.toISOString()],
      ),
      pool.query<DayRow>(
        `SELECT
           TO_CHAR(created_at AT TIME ZONE 'Europe/Berlin', 'DD.MM.') AS day_label,
           EXTRACT(ISODOW FROM created_at AT TIME ZONE 'Europe/Berlin')::int AS dow,
           COUNT(*)::text AS anzahl
         FROM shipments
         WHERE created_at >= $1 AND created_at <= $2
         GROUP BY day_label, dow
         ORDER BY MIN(created_at)`,
        [since.toISOString(), until.toISOString()],
      ),
      pool.query<{ anzahl: string }>(
        `SELECT COUNT(*)::text AS anzahl FROM shipments WHERE status IN ('Angemeldet','Geplant')`,
      ),
      pool.query<{ anzahl: string }>(
        `SELECT COUNT(*)::text AS anzahl FROM tickets
         WHERE status NOT IN ('Geschlossen','Gelöst') AND status != 'Storniert'`,
      ).catch(() => ({ rows: [{ anzahl: "0" }] })),
      pool.query<{
        uploaded_at: string; filename: string | null;
        total_auftraege: number; total_paletten: number; results: AuftragSped[];
      }>(
        `SELECT uploaded_at, filename, total_auftraege, total_paletten, results
         FROM auftrag_analyse_ergebnisse ORDER BY uploaded_at DESC LIMIT 1`,
      ).catch(() => ({ rows: [] })),
    ]);

  const total = parseInt(totalRes.rows[0]?.total ?? "0", 10);
  const offeneVerladungen = parseInt(offeneRes.rows[0]?.anzahl ?? "0", 10);
  const offeneTickets = parseInt(ticketRes.rows[0]?.anzahl ?? "0", 10);

  const auftragRow = auftragRes.rows[0] ?? null;
  const auftragUploadedAt = auftragRow
    ? new Date(auftragRow.uploaded_at).toLocaleDateString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;
  const auftragTopSpeds: AuftragSped[] = auftragRow
    ? (auftragRow.results as AuftragSped[])
        .slice()
        .sort((a, b) => b.paletten - a.paletten)
        .slice(0, 8)
    : [];

  const dateFrom = since.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const dateTo = now.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

  const data: ReportData = {
    appName, companyName, dateFrom, dateTo, total,
    statusRows: statusRes.rows,
    lkwRows: lkwRes.rows,
    spedRows: spedRes.rows,
    dayRows: dayRes.rows,
    offeneVerladungen,
    offeneTickets,
    auftragUploadedAt,
    auftragFilename: auftragRow?.filename ?? null,
    auftragTotalAuftraege: auftragRow?.total_auftraege ?? 0,
    auftragTotalPaletten: auftragRow?.total_paletten ?? 0,
    auftragTopSpeds,
  };

  const transport = createEmailTransport(s);
  await transport.sendMail({
    from,
    to: recipients,
    subject: `Wöchentlicher Bericht – ${appName} (${dateFrom} – ${dateTo})`,
    text: buildText(data),
    html: buildHtml(data),
  });

  logger.info({ recipients, total }, "Wöchentlicher Bericht versendet");
}
