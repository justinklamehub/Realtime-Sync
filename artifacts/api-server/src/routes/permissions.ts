import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import {
  can,
  invalidatePermissionsCache,
  getRolePermissionsMatrix,
  ALL_PERMISSIONS,
  ALL_CONFIGURABLE_ROLES,
  PERMISSION_LABELS,
  ROLE_LABELS,
} from "../lib/permissions";

const router = Router();

router.get("/admin/permissions", requireAuth, async (req, res) => {
  try {
    if (req.session.role !== "comet_admin") {
      return res.status(403).json({ error: "Nur COMET Admin kann Berechtigungen verwalten" });
    }
    const matrix = await getRolePermissionsMatrix();
    return res.json({
      matrix,
      permissions: ALL_PERMISSIONS,
      roles: ALL_CONFIGURABLE_ROLES,
      permissionLabels: PERMISSION_LABELS,
      roleLabels: ROLE_LABELS,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/permissions", requireAuth, async (req, res) => {
  try {
    if (req.session.role !== "comet_admin") {
      return res.status(403).json({ error: "Nur COMET Admin kann Berechtigungen verwalten" });
    }
    const { role, permission, allowed } = req.body;
    if (!role || !permission || typeof allowed !== "boolean") {
      return res.status(400).json({ error: "role, permission und allowed sind erforderlich" });
    }
    if (!ALL_CONFIGURABLE_ROLES.includes(role)) {
      return res.status(400).json({ error: "Ungültige Rolle" });
    }
    if (!ALL_PERMISSIONS.includes(permission)) {
      return res.status(400).json({ error: "Ungültige Berechtigung" });
    }

    await db.execute(
      sql`INSERT INTO role_permissions (role, permission, allowed, updated_at)
          VALUES (${role}, ${permission}, ${allowed}, NOW())
          ON CONFLICT (role, permission) DO UPDATE SET allowed = ${allowed}, updated_at = NOW()`
    );

    invalidatePermissionsCache();

    return res.json({ ok: true, role, permission, allowed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
