import { Router } from "express";
import { db } from "@workspace/db";
import {
  palletReconciliationsTable,
  reconciliationCommentsTable,
  speditionenTable,
  usersTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router = Router();

router.get("/reconciliations", requireAuth, async (req, res) => {
  try {
    const { speditionId, status } = req.query as Record<string, string>;
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;

    let rows = await db.select().from(palletReconciliationsTable);

    if (["speditions_admin", "speditions_bearbeiter", "speditions_viewer"].includes(role)) {
      if (!sessionSpeditionId) return res.json([]);
      rows = rows.filter((r) => r.speditionId === sessionSpeditionId);
    } else if (speditionId) {
      rows = rows.filter((r) => r.speditionId === Number(speditionId));
    }
    if (status) rows = rows.filter((r) => r.status === status);

    const speds = await db.select().from(speditionenTable);
    const users = await db.select().from(usersTable);
    const spedMap: Record<number, string> = {};
    const userMap: Record<number, string> = {};
    for (const s of speds) spedMap[s.id] = s.name;
    for (const u of users) userMap[u.id] = u.username;

    return res.json(
      rows.map((r) => ({
        ...r,
        speditionName: spedMap[r.speditionId] ?? null,
        createdByName: r.createdBy ? userMap[r.createdBy] ?? null : null,
      }))
    );
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reconciliations", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (!["comet_admin", "comet_leitstand"].includes(role)) {
      return res.status(403).json({ error: "Only COMET can start reconciliations" });
    }

    const { speditionId, dateFrom, dateTo, cometBalance } = req.body;
    const [rec] = await db
      .insert(palletReconciliationsTable)
      .values({
        speditionId,
        dateFrom,
        dateTo,
        cometBalance: cometBalance ?? null,
        status: "offen",
        createdBy: req.session.userId,
      })
      .returning();

    await logAudit(req.session.userId!, "reconciliation", rec.id, "created", null, `${dateFrom} - ${dateTo}`);

    const [sped] = await db.select().from(speditionenTable).where(eq(speditionenTable.id, speditionId)).limit(1);
    const [creator] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);

    return res.status(201).json({
      ...rec,
      speditionName: sped?.name ?? null,
      createdByName: creator?.username ?? null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/reconciliations/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rec] = await db
      .select()
      .from(palletReconciliationsTable)
      .where(eq(palletReconciliationsTable.id, id))
      .limit(1);
    if (!rec) return res.status(404).json({ error: "Not found" });

    const [sped] = await db.select().from(speditionenTable).where(eq(speditionenTable.id, rec.speditionId)).limit(1);
    const creator = rec.createdBy
      ? (await db.select().from(usersTable).where(eq(usersTable.id, rec.createdBy)).limit(1))[0]
      : null;

    return res.json({
      ...rec,
      speditionName: sped?.name ?? null,
      createdByName: creator?.username ?? null,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/reconciliations/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const role = req.session.role!;
    const { status, speditionBalance, cometBalance } = req.body;

    const [existing] = await db
      .select()
      .from(palletReconciliationsTable)
      .where(eq(palletReconciliationsTable.id, id))
      .limit(1);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const updates: any = { updatedAt: new Date() };
    if (status !== undefined) updates.status = status;
    if (speditionBalance !== undefined && ["speditions_admin"].includes(role)) {
      updates.speditionBalance = speditionBalance;
    }
    if (cometBalance !== undefined && ["comet_admin", "comet_leitstand"].includes(role)) {
      updates.cometBalance = cometBalance;
    }

    const [rec] = await db
      .update(palletReconciliationsTable)
      .set(updates)
      .where(eq(palletReconciliationsTable.id, id))
      .returning();

    await logAudit(req.session.userId!, "reconciliation", id, "updated", existing.status, status ?? existing.status);

    return res.json({ ...rec, speditionName: null, createdByName: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/reconciliations/:id/comments", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const comments = await db
      .select()
      .from(reconciliationCommentsTable)
      .where(eq(reconciliationCommentsTable.reconciliationId, id));

    const users = await db.select().from(usersTable);
    const userMap: Record<number, { username: string; role: string }> = {};
    for (const u of users) userMap[u.id] = { username: u.username, role: u.role };

    return res.json(
      comments.map((c) => ({
        id: c.id,
        reconciliationId: c.reconciliationId,
        userId: c.userId,
        username: userMap[c.userId]?.username ?? "Unknown",
        role: userMap[c.userId]?.role ?? "unknown",
        comment: c.comment,
        createdAt: c.createdAt,
      }))
    );
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reconciliations/:id/comments", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ error: "Comment required" });

    const [c] = await db
      .insert(reconciliationCommentsTable)
      .values({ reconciliationId: id, userId: req.session.userId!, comment })
      .returning();

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);

    return res.status(201).json({
      id: c.id,
      reconciliationId: c.reconciliationId,
      userId: c.userId,
      username: user?.username ?? "Unknown",
      role: user?.role ?? "unknown",
      comment: c.comment,
      createdAt: c.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
