import nodemailer from "nodemailer";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";

export type EmailEvent = "shipment" | "bulk" | "user";

async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settingsTable);
  return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

function createTransport() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_PORT === "465",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return nodemailer.createTransport({ sendmail: true, newline: "unix" });
}

export async function sendEventEmail(
  event: EmailEvent,
  vars: Record<string, string>,
  extraTo?: string,
): Promise<void> {
  try {
    const settings = await getSettings();

    if (settings[`email_tpl_${event}_enabled`] !== "1") return;

    const from =
      settings.email_from ||
      process.env.SMTP_FROM ||
      "noreply@comet-seasonal.de";

    const configuredTo = (settings[`email_tpl_${event}_to`] ?? "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (extraTo) configuredTo.push(extraTo);
    if (configuredTo.length === 0) return;

    const subject = interpolate(
      settings[`email_tpl_${event}_subject`] ?? "",
      vars,
    );
    const text = interpolate(
      settings[`email_tpl_${event}_body`] ?? "",
      vars,
    );

    if (!subject && !text) return;

    const transport = createTransport();
    await transport.sendMail({
      from,
      to: configuredTo.join(", "),
      subject,
      text,
    });
  } catch (err) {
    console.error(`[email] Fehler beim Senden (${event}):`, err);
  }
}
