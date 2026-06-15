import { Router } from "express";
import { db } from "@workspace/db";
import { speditionenTable, speditionPermissionsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router = Router();

router.get("/speditionen", requireAuth, async (req, res) => {
  try {
    const rows = await db.select().from(speditionenTable).orderBy(speditionenTable.name);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/speditionen", requireAuth, async (req, res) => {
  try {
    if (req.session.role !== "comet_admin") {
      return res.status(403).json({ error: "Only COMET Admin can create Speditionen" });
    }
    const { name, kuerzel, ansprechpartner, email, telefon, status, bemerkungen } = req.body;
    const [sped] = await db
      .insert(speditionenTable)
      .values({ name, kuerzel, ansprechpartner, email, telefon, status: status || "aktiv", bemerkungen })
      .returning();
    await logAudit(req.session.userId!, "spedition", sped.id, "created", null, name);
    return res.status(201).json(sped);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/speditionen/:id", requireAuth, async (req, res) => {
  try {
    const [sped] = await db
      .select()
      .from(speditionenTable)
      .where(eq(speditionenTable.id, Number(req.params.id)))
      .limit(1);
    if (!sped) return res.status(404).json({ error: "Not found" });
    return res.json(sped);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/speditionen/:id", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    const id = Number(req.params.id);
    const sessionSpeditionId = req.session.speditionId;

    if (role === "speditions_admin" && sessionSpeditionId !== id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (!["comet_admin", "comet_leitstand", "speditions_admin"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { name, kuerzel, ansprechpartner, email, telefon, status, bemerkungen } = req.body;
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (kuerzel !== undefined) updates.kuerzel = kuerzel;
    if (ansprechpartner !== undefined) updates.ansprechpartner = ansprechpartner;
    if (email !== undefined) updates.email = email;
    if (telefon !== undefined) updates.telefon = telefon;
    if (status !== undefined) updates.status = status;
    if (bemerkungen !== undefined) updates.bemerkungen = bemerkungen;
    updates.updatedAt = new Date();

    const [sped] = await db.update(speditionenTable).set(updates).where(eq(speditionenTable.id, id)).returning();
    if (!sped) return res.status(404).json({ error: "Not found" });
    await logAudit(req.session.userId!, "spedition", id, "updated", null, JSON.stringify(updates));
    return res.json(sped);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/speditionen/:id/permissions", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const perms = await db
      .select()
      .from(speditionPermissionsTable)
      .where(eq(speditionPermissionsTable.grantingSpeditionId, id));

    const speds = await db.select().from(speditionenTable);
    const spedMap: Record<number, string> = {};
    for (const s of speds) spedMap[s.id] = s.name;

    return res.json(
      perms.map((p) => ({
        grantingSpeditionId: p.grantingSpeditionId,
        receivingSpeditionId: p.receivingSpeditionId,
        receivingSpeditionName: spedMap[p.receivingSpeditionId] ?? null,
        permissionLevel: p.permissionLevel,
      }))
    );
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/speditionen/:id/permissions", requireAuth, async (req, res) => {
  try {
    const grantingId = Number(req.params.id);
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;

    if (role === "speditions_admin" && sessionSpeditionId !== grantingId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (!["comet_admin", "speditions_admin"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { receivingSpeditionId, permissionLevel } = req.body;

    // Upsert
    const existing = await db
      .select()
      .from(speditionPermissionsTable)
      .where(
        and(
          eq(speditionPermissionsTable.grantingSpeditionId, grantingId),
          eq(speditionPermissionsTable.receivingSpeditionId, receivingSpeditionId)
        )
      )
      .limit(1);

    let perm;
    if (existing.length > 0) {
      [perm] = await db
        .update(speditionPermissionsTable)
        .set({ permissionLevel })
        .where(
          and(
            eq(speditionPermissionsTable.grantingSpeditionId, grantingId),
            eq(speditionPermissionsTable.receivingSpeditionId, receivingSpeditionId)
          )
        )
        .returning();
    } else {
      [perm] = await db
        .insert(speditionPermissionsTable)
        .values({ grantingSpeditionId: grantingId, receivingSpeditionId, permissionLevel })
        .returning();
    }

    const [receivingSped] = await db
      .select({ name: speditionenTable.name })
      .from(speditionenTable)
      .where(eq(speditionenTable.id, receivingSpeditionId))
      .limit(1);

    return res.json({
      grantingSpeditionId: perm.grantingSpeditionId,
      receivingSpeditionId: perm.receivingSpeditionId,
      receivingSpeditionName: receivingSped?.name ?? null,
      permissionLevel: perm.permissionLevel,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/speditionen/:id/permissions/:receivingId", requireAuth, async (req, res) => {
  try {
    const grantingId = Number(req.params.id);
    const receivingId = Number(req.params.receivingId);
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;

    if (role === "speditions_admin" && sessionSpeditionId !== grantingId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (!["comet_admin", "speditions_admin"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await db
      .delete(speditionPermissionsTable)
      .where(
        and(
          eq(speditionPermissionsTable.grantingSpeditionId, grantingId),
          eq(speditionPermissionsTable.receivingSpeditionId, receivingId)
        )
      );
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
