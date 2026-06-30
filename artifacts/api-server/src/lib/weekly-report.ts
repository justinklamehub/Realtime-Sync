import { db, pool, settingsTable } from "@workspace/db";
import { createEmailTransport } from "./email";
import { logger } from "./logger";

interface StatusRow { status: string; anzahl: string }
interface LkwRow { lkw_art: string | null; anzahl: string }
interface SpedRow { name: string | null; anzahl: string }

interface ReportData {
  appName: string;
  companyName: string;
  dateFrom: string;
  dateTo: string;
  total: number;
  statusRows: StatusRow[];
  lkwRows: LkwRow[];
  spedRows: SpedRow[];
}

function tableRows(rows: { label: string; anzahl: number }[]): string {
  if (rows.length === 0) return "<tr><td colspan='2' style='padding:8px 12px;color:#888'>Keine Daten</td></tr>";
  return rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${r.label || "—"}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600">${r.anzahl}</td></tr>`,
    )
    .join("");
}

function buildHtml(d: ReportData): string {
  const statusColor: Record<string, string> = {
    Angemeldet: "#3b82f6",
    Geplant: "#8b5cf6",
    Verladen: "#f59e0b",
    Abgefertigt: "#10b981",
    Storniert: "#ef4444",
  };

  const statusBadges = d.statusRows
    .map((r) => {
      const color = statusColor[r.status] ?? "#6b7280";
      return `<span style="display:inline-block;margin:3px 4px 3px 0;padding:3px 10px;border-radius:12px;background:${color}20;color:${color};font-size:12px;font-weight:600">${r.status}&nbsp;<strong>${r.anzahl}</strong></span>`;
    })
    .join("");

  const lkwFiltered = d.lkwRows.filter((r) => r.lkw_art);
  const spedFiltered = d.spedRows.filter((r) => r.name);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
<div style="max-width:620px;margin:24px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

  <div style="background:#1e3a5f;padding:24px 28px 20px">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">${d.appName}</h1>
    <p style="margin:6px 0 0;color:#a8c0d9;font-size:13px">Wöchentlicher Bericht · ${d.dateFrom} – ${d.dateTo}</p>
  </div>

  <div style="padding:24px 28px">

    <div style="background:#f0f7ff;border:1px solid #d0e8ff;border-radius:8px;padding:16px 20px;margin-bottom:24px;text-align:center">
      <div style="font-size:13px;color:#5a7fa0;margin-bottom:4px">Verladungen in diesem Zeitraum</div>
      <div style="font-size:42px;font-weight:800;color:#1e3a5f;line-height:1">${d.total}</div>
    </div>

    ${
      d.statusRows.length > 0
        ? `<div style="margin-bottom:24px">
      <h3 style="margin:0 0 10px;font-size:13px;color:#5a7fa0;text-transform:uppercase;letter-spacing:0.5px">Status</h3>
      <div>${statusBadges}</div>
    </div>`
        : ""
    }

    ${
      lkwFiltered.length > 0
        ? `<div style="margin-bottom:24px">
      <h3 style="margin:0 0 10px;font-size:13px;color:#5a7fa0;text-transform:uppercase;letter-spacing:0.5px">LKW-Art</h3>
      <table width="100%" style="border-collapse:collapse;background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee">
        <thead><tr style="background:#f0f0f0">
          <th style="padding:8px 12px;text-align:left;font-size:12px;color:#666">Art</th>
          <th style="padding:8px 12px;text-align:right;font-size:12px;color:#666">Anzahl</th>
        </tr></thead>
        <tbody>
          ${tableRows(lkwFiltered.map((r) => ({ label: r.lkw_art!, anzahl: parseInt(r.anzahl, 10) })))}
        </tbody>
      </table>
    </div>`
        : ""
    }

    ${
      spedFiltered.length > 0
        ? `<div style="margin-bottom:8px">
      <h3 style="margin:0 0 10px;font-size:13px;color:#5a7fa0;text-transform:uppercase;letter-spacing:0.5px">Top-Speditionen</h3>
      <table width="100%" style="border-collapse:collapse;background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee">
        <thead><tr style="background:#f0f0f0">
          <th style="padding:8px 12px;text-align:left;font-size:12px;color:#666">Spedition</th>
          <th style="padding:8px 12px;text-align:right;font-size:12px;color:#666">Verladungen</th>
        </tr></thead>
        <tbody>
          ${tableRows(spedFiltered.map((r) => ({ label: r.name!, anzahl: parseInt(r.anzahl, 10) })))}
        </tbody>
      </table>
    </div>`
        : ""
    }

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
    ``,
    `Nach Status:`,
    ...d.statusRows.map((r) => `  ${r.status}: ${r.anzahl}`),
  ];
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

  const [totalRes, statusRes, lkwRes, spedRes] = await Promise.all([
    pool.query<{ total: string }>(
      "SELECT COUNT(*) AS total FROM shipments WHERE created_at >= $1 AND created_at <= $2",
      [since.toISOString(), until.toISOString()],
    ),
    pool.query<StatusRow>(
      "SELECT status, COUNT(*)::text AS anzahl FROM shipments WHERE created_at >= $1 AND created_at <= $2 GROUP BY status ORDER BY anzahl DESC",
      [since.toISOString(), until.toISOString()],
    ),
    pool.query<LkwRow>(
      "SELECT lkw_art, COUNT(*)::text AS anzahl FROM shipments WHERE created_at >= $1 AND created_at <= $2 GROUP BY lkw_art ORDER BY anzahl DESC",
      [since.toISOString(), until.toISOString()],
    ),
    pool.query<SpedRow>(
      `SELECT s.name, COUNT(*)::text AS anzahl
       FROM shipments sh LEFT JOIN speditionen s ON sh.spedition_id = s.id
       WHERE sh.created_at >= $1 AND sh.created_at <= $2
       GROUP BY s.name ORDER BY anzahl DESC LIMIT 5`,
      [since.toISOString(), until.toISOString()],
    ),
  ]);

  const total = parseInt(totalRes.rows[0]?.total ?? "0", 10);
  const dateFrom = since.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const dateTo = now.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

  const data: ReportData = {
    appName,
    companyName,
    dateFrom,
    dateTo,
    total,
    statusRows: statusRes.rows,
    lkwRows: lkwRes.rows,
    spedRows: spedRes.rows,
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
