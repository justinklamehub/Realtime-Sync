import { Router } from "express";
import { db } from "@workspace/db";
import { emailLogTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import nodemailer from "nodemailer";

const router = Router();

router.get("/email-log", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (role !== "comet_admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const limit = Math.min(Number(req.query["limit"] ?? 100), 200);
    const offset = Number(req.query["offset"] ?? 0);

    const items = await db
      .select()
      .from(emailLogTable)
      .orderBy(desc(emailLogTable.sentAt))
      .limit(limit)
      .offset(offset);

    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/email-log/:id/resend", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (role !== "comet_admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const id = Number(req.params["id"]);
    if (isNaN(id)) return res.status(400).json({ error: "Ungültige ID" });

    const to = (req.body?.to ?? "").toString().trim();
    if (!to) return res.status(400).json({ error: "Empfänger-E-Mail fehlt" });

    const [entry] = await db.select().from(emailLogTable).where(eq(emailLogTable.id, id)).limit(1);
    if (!entry) return res.status(404).json({ error: "Eintrag nicht gefunden" });

    const from = process.env.SMTP_FROM ?? "noreply@comet-seasonal.de";

    let transport: nodemailer.Transporter;
    if (process.env.SMTP_HOST) {
      transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_PORT === "465",
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      });
    } else {
      transport = nodemailer.createTransport({ sendmail: true, newline: "unix" });
    }

    await transport.sendMail({
      from,
      to,
      subject: `[Weiterleitung] ${entry.subject}`,
      text: entry.bodyText ?? undefined,
      html: entry.bodyHtml ?? undefined,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("[email-log/resend]", err);
    return res.status(500).json({ error: "Fehler beim Senden" });
  }
});

export default router;
