import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, speditionenTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router = Router();

router.get("/users", requireAuth, async (req, res) => {
  try {
    const { speditionId } = req.query;
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;

    let rows;
    if (role === "comet_admin" || role === "comet_leitstand") {
      rows = await db.select().from(usersTable);
    } else if (role === "speditions_admin" && sessionSpeditionId) {
      rows = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.speditionId, sessionSpeditionId));
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (speditionId) {
      rows = rows.filter((u) => u.speditionId === Number(speditionId));
    }

    const spedMap: Record<number, string> = {};
    const allSpeds = await db.select().from(speditionenTable);
    for (const s of allSpeds) spedMap[s.id] = s.name;

    return res.json(
      rows.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        speditionId: u.speditionId,
        speditionName: u.speditionId ? spedMap[u.speditionId] ?? null : null,
        isActive: u.isActive,
        createdAt: u.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;

    if (role !== "comet_admin" && role !== "speditions_admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { username, email, password, role: newRole, speditionId, isActive } = req.body;

    // Speditionsadmin can only create spedition users in their own spedition
    if (role === "speditions_admin") {
      if (!["speditions_admin", "speditions_bearbeiter", "speditions_viewer"].includes(newRole)) {
        return res.status(403).json({ error: "Cannot create COMET roles" });
      }
      if (speditionId && speditionId !== sessionSpeditionId) {
        return res.status(403).json({ error: "Can only create users in own spedition" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(usersTable)
      .values({
        username,
        email,
        passwordHash,
        role: newRole,
        speditionId: speditionId || null,
        isActive: isActive !== false,
      })
      .returning();

    await logAudit(req.session.userId!, "user", user.id, "created", null, username);

    return res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      speditionId: user.speditionId,
      speditionName: null,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users/:id", requireAuth, async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(req.params.id)))
      .limit(1);

    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json({ ...user, speditionName: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (role !== "comet_admin" && role !== "speditions_admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const id = Number(req.params.id);
    const { username, email, password, role: newRole, speditionId, isActive } = req.body;

    const updates: any = {};
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (newRole !== undefined) updates.role = newRole;
    if (speditionId !== undefined) updates.speditionId = speditionId;
    if (isActive !== undefined) updates.isActive = isActive;
    if (password) updates.passwordHash = await bcrypt.hash(password, 12);
    updates.updatedAt = new Date();

    const [user] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) return res.status(404).json({ error: "Not found" });

    await logAudit(req.session.userId!, "user", id, "updated", null, JSON.stringify(updates));

    return res.json({ ...user, speditionName: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/users/:id", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (role !== "comet_admin" && role !== "speditions_admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const id = Number(req.params.id);
    await db.update(usersTable).set({ isActive: false, updatedAt: new Date() }).where(eq(usersTable.id, id));
    await logAudit(req.session.userId!, "user", id, "deactivated", null, "true");
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
