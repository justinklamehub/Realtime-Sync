import { Router } from "express";
import { requireAuth, requireRoles } from "../lib/auth";
import { sendWeeklyReport } from "../lib/weekly-report";

const router = Router();

router.post("/report/weekly/send", requireAuth, requireRoles("comet_admin"), async (_req, res) => {
  try {
    await sendWeeklyReport();
    return res.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: `Fehler beim Senden: ${msg}` });
  }
});

export default router;
