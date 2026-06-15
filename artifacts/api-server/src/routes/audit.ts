import { Router } from "express";
import { db } from "@workspace/db";
import { auditLogTable, usersTable } from "@workspace/db";
import { eq, and, gte, lte } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

router.get("/audit-log", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    // Only COMET roles can see the audit log
    if (!["comet_admin", "comet_leitstand", "comet_lager", "comet_viewer"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { module, recordId, userId, dateFrom, dateTo, page, limit: limitStr } = req.query as Record<string, string>;
    const pageNum = Number(page) || 1;
    const limit = Math.min(Number(limitStr) || 50, 200);
    const offset = (pageNum - 1) * limit;

    let rows = await db.select().from(auditLogTable);

    if (module) rows = rows.filter((e) => e.module === module);
    if (recordId) rows = rows.filter((e) => e.recordId === Number(recordId));
    if (userId) rows = rows.filter((e) => e.userId === Number(userId));
    if (dateFrom) rows = rows.filter((e) => e.changedAt >= new Date(dateFrom));
    if (dateTo) rows = rows.filter((e) => e.changedAt <= new Date(dateTo + "T23:59:59"));

    // Sort newest first
    rows.sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());

    const total = rows.length;
    const paged = rows.slice(offset, offset + limit);

    const users = await db.select().from(usersTable);
    const userMap: Record<number, string> = {};
    for (const u of users) userMap[u.id] = u.username;

    return res.json({
      entries: paged.map((e) => ({
        id: e.id,
        userId: e.userId,
        username: e.userId ? userMap[e.userId] ?? null : null,
        module: e.module,
        recordId: e.recordId,
        field: e.field,
        oldValue: e.oldValue,
        newValue: e.newValue,
        changedAt: e.changedAt,
      })),
      total,
      page: pageNum,
      limit,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
