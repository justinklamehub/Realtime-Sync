import { Router } from "express";
import { db } from "@workspace/db";
import {
  shipmentsTable,
  speditionenTable,
  usersTable,
  speditionPermissionsTable,
  auditLogTable,
} from "@workspace/db";
import { eq, and, or, gte, lte, ilike, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { logAudit } from "../lib/audit";
import type { Server as IOServer } from "socket.io";

const router = Router();

function getIO(req: any): IOServer | null {
  return req.app.get("io") || null;
}

function emit(req: any, event: string, data: any) {
  const io = getIO(req);
  if (io) io.emit(event, data);
}

const COMET_OPERATIVE_FIELDS = ["status", "tor", "ataDate", "ataTime", "gesperrtFuerSpedition", "cometBearbeitet"];

async function buildShipmentResponse(shipment: any) {
  let speditionName: string | null = null;
  let subSpeditionName: string | null = null;
  let createdByName: string | null = null;
  let updatedByName: string | null = null;

  if (shipment.speditionId) {
    const [s] = await db.select().from(speditionenTable).where(eq(speditionenTable.id, shipment.speditionId)).limit(1);
    speditionName = s?.name ?? null;
  }
  if (shipment.subSpeditionId) {
    const [s] = await db.select().from(speditionenTable).where(eq(speditionenTable.id, shipment.subSpeditionId)).limit(1);
    subSpeditionName = s?.name ?? null;
  }
  if (shipment.createdBy) {
    const [u] = await db.select().from(usersTable).where(eq(usersTable.id, shipment.createdBy)).limit(1);
    createdByName = u?.username ?? null;
  }
  if (shipment.updatedBy) {
    const [u] = await db.select().from(usersTable).where(eq(usersTable.id, shipment.updatedBy)).limit(1);
    updatedByName = u?.username ?? null;
  }

  return { ...shipment, speditionName, subSpeditionName, createdByName, updatedByName };
}

router.get("/shipments", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;
    const {
      dateFrom,
      dateTo,
      speditionId,
      status,
      lkwArt,
      relation,
      kennzeichen,
      tor,
      search,
    } = req.query as Record<string, string>;

    // Build conditions
    let rows = await db.select().from(shipmentsTable);

    // Permission filtering for spedition users
    if (["speditions_admin", "speditions_bearbeiter", "speditions_viewer"].includes(role)) {
      if (!sessionSpeditionId) return res.json([]);

      // Get speditions this user's spedition has view/edit permission for
      const permissions = await db
        .select()
        .from(speditionPermissionsTable)
        .where(eq(speditionPermissionsTable.receivingSpeditionId, sessionSpeditionId));

      const allowedSpeditionIds = [
        sessionSpeditionId,
        ...permissions.map((p) => p.grantingSpeditionId),
      ];

      rows = rows.filter(
        (s) => s.speditionId !== null && allowedSpeditionIds.includes(s.speditionId)
      );
    }

    // Apply filters
    if (dateFrom) {
      rows = rows.filter(
        (s) => (s.etaDate && s.etaDate >= dateFrom) || (s.ataDate && s.ataDate >= dateFrom)
      );
    }
    if (dateTo) {
      rows = rows.filter(
        (s) => (s.etaDate && s.etaDate <= dateTo) || (s.ataDate && s.ataDate <= dateTo)
      );
    }
    if (speditionId) rows = rows.filter((s) => s.speditionId === Number(speditionId));
    if (status) rows = rows.filter((s) => s.status === status);
    if (lkwArt) rows = rows.filter((s) => s.lkwArt === lkwArt);
    if (relation) rows = rows.filter((s) => s.relation?.toLowerCase().includes(relation.toLowerCase()));
    if (kennzeichen) rows = rows.filter((s) => s.kennzeichen?.toLowerCase().includes(kennzeichen.toLowerCase()));
    if (tor) rows = rows.filter((s) => s.tor === tor);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (s) =>
          s.bezeichnung?.toLowerCase().includes(q) ||
          s.kennzeichen?.toLowerCase().includes(q) ||
          s.relation?.toLowerCase().includes(q)
      );
    }

    // Sort: ataTime first, then etaTime
    rows.sort((a, b) => {
      const aTime = a.ataTime || a.etaTime || "99:99";
      const bTime = b.ataTime || b.etaTime || "99:99";
      return aTime.localeCompare(bTime);
    });

    // Build responses with names
    const speds = await db.select().from(speditionenTable);
    const users = await db.select().from(usersTable);
    const spedMap: Record<number, string> = {};
    const userMap: Record<number, string> = {};
    for (const s of speds) spedMap[s.id] = s.name;
    for (const u of users) userMap[u.id] = u.username;

    return res.json(
      rows.map((s) => ({
        ...s,
        speditionName: s.speditionId ? spedMap[s.speditionId] ?? null : null,
        subSpeditionName: s.subSpeditionId ? spedMap[s.subSpeditionId] ?? null : null,
        createdByName: s.createdBy ? userMap[s.createdBy] ?? null : null,
        updatedByName: s.updatedBy ? userMap[s.updatedBy] ?? null : null,
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/shipments", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;

    if (
      ["comet_viewer", "speditions_viewer"].includes(role)
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const body = req.body;
    const [shipment] = await db
      .insert(shipmentsTable)
      .values({
        ...body,
        speditionId: body.speditionId || sessionSpeditionId || null,
        createdBy: req.session.userId,
        updatedBy: req.session.userId,
        status: body.status || "Angemeldet",
      })
      .returning();

    await logAudit(req.session.userId!, "shipment", shipment.id, "created", null, shipment.bezeichnung);
    emit(req, "shipment.created", { id: shipment.id });

    return res.status(201).json(await buildShipmentResponse(shipment));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/shipments/bulk", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (["comet_viewer", "speditions_viewer"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { shipments } = req.body;
    if (!Array.isArray(shipments) || shipments.length === 0) {
      return res.status(400).json({ error: "No shipments provided" });
    }

    const sessionSpeditionId = req.session.speditionId;
    const inserted = await db
      .insert(shipmentsTable)
      .values(
        shipments.map((s: any) => ({
          ...s,
          speditionId: s.speditionId || sessionSpeditionId || null,
          createdBy: req.session.userId,
          updatedBy: req.session.userId,
          status: s.status || "Angemeldet",
        }))
      )
      .returning();

    for (const s of inserted) {
      await logAudit(req.session.userId!, "shipment", s.id, "bulk_created", null, s.bezeichnung);
      emit(req, "shipment.created", { id: s.id });
    }

    return res.status(201).json(inserted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shipments/:id", requireAuth, async (req, res) => {
  try {
    const [shipment] = await db
      .select()
      .from(shipmentsTable)
      .where(eq(shipmentsTable.id, Number(req.params.id)))
      .limit(1);
    if (!shipment) return res.status(404).json({ error: "Not found" });
    return res.json(await buildShipmentResponse(shipment));
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/shipments/:id", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;
    const id = Number(req.params.id);

    if (["comet_viewer", "speditions_viewer"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const [existing] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.id, id)).limit(1);
    if (!existing) return res.status(404).json({ error: "Not found" });

    // Spedition lock check
    if (["speditions_admin", "speditions_bearbeiter"].includes(role) && existing.gesperrtFuerSpedition) {
      return res.status(403).json({ error: "Shipment is locked for editing by Spedition" });
    }

    const updates = { ...req.body };
    const isCometUser = ["comet_admin", "comet_leitstand", "comet_lager"].includes(role);

    // Locking logic: if COMET user edits operative fields, lock for Spedition
    if (isCometUser) {
      const editingOperative = COMET_OPERATIVE_FIELDS.some((f) => updates[f] !== undefined);
      if (editingOperative) {
        updates.cometBearbeitet = true;
        updates.gesperrtFuerSpedition = true;
      }
    }

    updates.updatedBy = req.session.userId;
    updates.updatedAt = new Date();

    const [shipment] = await db
      .update(shipmentsTable)
      .set(updates)
      .where(eq(shipmentsTable.id, id))
      .returning();

    // Log field-level changes
    for (const [field, newVal] of Object.entries(updates)) {
      if (field === "updatedAt" || field === "updatedBy") continue;
      const oldVal = (existing as any)[field];
      if (String(oldVal) !== String(newVal)) {
        await logAudit(req.session.userId!, "shipment", id, field, String(oldVal ?? ""), String(newVal ?? ""));
      }
    }

    const isStatusChange = updates.status && updates.status !== existing.status;
    emit(req, isStatusChange ? "shipment.status_changed" : "shipment.updated", { id });

    return res.json(await buildShipmentResponse(shipment));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/shipments/:id", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (!["comet_admin", "comet_leitstand"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const id = Number(req.params.id);
    await db.delete(shipmentsTable).where(eq(shipmentsTable.id, id));
    await logAudit(req.session.userId!, "shipment", id, "deleted", null, null);
    emit(req, "shipment.updated", { id });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/shipments/:id/lock", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (!["comet_admin", "comet_leitstand"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const id = Number(req.params.id);
    const [shipment] = await db
      .update(shipmentsTable)
      .set({ gesperrtFuerSpedition: true, cometBearbeitet: true, updatedAt: new Date() })
      .where(eq(shipmentsTable.id, id))
      .returning();
    if (!shipment) return res.status(404).json({ error: "Not found" });
    await logAudit(req.session.userId!, "shipment", id, "locked", "false", "true");
    emit(req, "shipment.locked", { id });
    return res.json(await buildShipmentResponse(shipment));
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/shipments/:id/unlock", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (!["comet_admin", "comet_leitstand"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const id = Number(req.params.id);
    const [shipment] = await db
      .update(shipmentsTable)
      .set({ gesperrtFuerSpedition: false, updatedAt: new Date() })
      .where(eq(shipmentsTable.id, id))
      .returning();
    if (!shipment) return res.status(404).json({ error: "Not found" });
    await logAudit(req.session.userId!, "shipment", id, "unlocked", "true", "false");
    emit(req, "shipment.unlocked", { id });
    return res.json(await buildShipmentResponse(shipment));
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shipments/:id/history", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const entries = await db
      .select()
      .from(auditLogTable)
      .where(and(eq(auditLogTable.module, "shipment"), eq(auditLogTable.recordId, id)));

    const users = await db.select().from(usersTable);
    const userMap: Record<number, string> = {};
    for (const u of users) userMap[u.id] = u.username;

    return res.json(
      entries.map((e) => ({
        id: e.id,
        userId: e.userId,
        username: e.userId ? userMap[e.userId] ?? null : null,
        module: e.module,
        recordId: e.recordId,
        field: e.field,
        oldValue: e.oldValue,
        newValue: e.newValue,
        changedAt: e.changedAt,
      }))
    );
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
