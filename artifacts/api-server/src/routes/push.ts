import { Router } from "express";
import webpush from "web-push";
import { pool } from "@workspace/db";

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) return res.status(401).json({ error: "Nicht angemeldet" });
  next();
}

const router = Router();

function getVapidPublicKey(): string {
  return process.env.VAPID_PUBLIC_KEY ?? "";
}

export function initWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL ?? "mailto:admin@comet-lkw.local";
  if (publicKey && privateKey) {
    webpush.setVapidDetails(email, publicKey, privateKey);
  }
}

router.get("/push/vapid-public-key", requireAuth, (_req, res) => {
  const key = getVapidPublicKey();
  if (!key) return res.status(503).json({ error: "Push nicht konfiguriert" });
  return res.json({ publicKey: key });
});

router.post("/push/subscribe", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId as number;
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: "Ungültiges Abonnement" });
    }
    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, endpoint) DO UPDATE
         SET p256dh = EXCLUDED.p256dh,
             auth = EXCLUDED.auth,
             updated_at = NOW()`,
      [userId, endpoint, keys.p256dh, keys.auth]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error("push subscribe error", err);
    return res.status(500).json({ error: "Fehler beim Speichern des Abonnements" });
  }
});

router.delete("/push/subscribe", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId as number;
    const { endpoint } = req.body;
    if (endpoint) {
      await pool.query(
        "DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2",
        [userId, endpoint]
      );
    } else {
      await pool.query("DELETE FROM push_subscriptions WHERE user_id = $1", [userId]);
    }
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Fehler beim Entfernen" });
  }
});

export async function sendPushToUsers(
  userIds: number[],
  payload: { title: string; message?: string; linkTo?: string; tag?: string }
): Promise<void> {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;
  if (userIds.length === 0) return;

  const placeholders = userIds.map((_, i) => `$${i + 1}`).join(",");
  const { rows } = await pool.query(
    `SELECT user_id, endpoint, p256dh, auth FROM push_subscriptions WHERE user_id IN (${placeholders})`,
    userIds
  );

  const results = await Promise.allSettled(
    rows.map((row: any) =>
      webpush.sendNotification(
        { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
        JSON.stringify(payload)
      ).catch(async (err: any) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await pool.query(
            "DELETE FROM push_subscriptions WHERE endpoint = $1",
            [row.endpoint]
          );
        }
        throw err;
      })
    )
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed > 0) console.warn(`sendPushToUsers: ${failed}/${rows.length} push(es) fehlgeschlagen`);
}

export default router;
