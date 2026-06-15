import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, speditionenTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

router.post("/auth/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "identifier and password required" });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.email, identifier), eq(usersTable.username, identifier)))
      .limit(1);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user.id;
    req.session.role = user.role as any;
    req.session.speditionId = user.speditionId;
    req.session.username = user.username;

    let speditionName: string | null = null;
    if (user.speditionId) {
      const [sped] = await db
        .select({ name: speditionenTable.name })
        .from(speditionenTable)
        .where(eq(speditionenTable.id, user.speditionId))
        .limit(1);
      speditionName = sped?.name ?? null;
    }

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      speditionId: user.speditionId,
      speditionName,
      isActive: user.isActive,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.session.userId!))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    let speditionName: string | null = null;
    if (user.speditionId) {
      const [sped] = await db
        .select({ name: speditionenTable.name })
        .from(speditionenTable)
        .where(eq(speditionenTable.id, user.speditionId))
        .limit(1);
      speditionName = sped?.name ?? null;
    }

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      speditionId: user.speditionId,
      speditionName,
      isActive: user.isActive,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
