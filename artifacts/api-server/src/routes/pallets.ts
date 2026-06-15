import { Router } from "express";
import { db } from "@workspace/db";
import {
  palletMovementsTable,
  palletReconciliationsTable,
  reconciliationCommentsTable,
  speditionenTable,
  usersTable,
  shipmentsTable,
} from "@workspace/db";
import { eq, and, gte, lte } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router = Router();

function getIO(req: any) {
  return req.app.get("io") || null;
}

function emit(req: any, event: string, data: any) {
  const io = getIO(req);
  if (io) io.emit(event, data);
}

// ---- Pallet Movements ----

router.get("/pallet-movements", requireAuth, async (req, res) => {
  try {
    const { speditionId, dateFrom, dateTo, shipmentId } = req.query as Record<string, string>;
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;

    let rows = await db.select().from(palletMovementsTable);

    // Spedition users only see their own
    if (["speditions_admin", "speditions_bearbeiter", "speditions_viewer"].includes(role)) {
      if (!sessionSpeditionId) return res.json([]);
      rows = rows.filter((m) => m.speditionId === sessionSpeditionId);
    } else if (speditionId) {
      rows = rows.filter((m) => m.speditionId === Number(speditionId));
    }

    if (dateFrom) rows = rows.filter((m) => m.movementDate >= dateFrom);
    if (dateTo) rows = rows.filter((m) => m.movementDate <= dateTo);
    if (shipmentId) rows = rows.filter((m) => m.shipmentId === Number(shipmentId));

    const speds = await db.select().from(speditionenTable);
    const users = await db.select().from(usersTable);
    const shipments = await db.select().from(shipmentsTable);
    const spedMap: Record<number, string> = {};
    const userMap: Record<number, string> = {};
    const shipMap: Record<number, string> = {};
    for (const s of speds) spedMap[s.id] = s.name;
    for (const u of users) userMap[u.id] = u.username;
    for (const s of shipments) shipMap[s.id] = s.bezeichnung ?? `#${s.id}`;

    return res.json(
      rows.map((m) => ({
        ...m,
        speditionName: spedMap[m.speditionId] ?? null,
        shipmentBezeichnung: m.shipmentId ? shipMap[m.shipmentId] ?? null : null,
        createdByName: m.createdBy ? userMap[m.createdBy] ?? null : null,
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/pallet-movements", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (["comet_viewer", "speditions_viewer"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { speditionId, shipmentId, movementType, movementDate, amount, bemerkungen } = req.body;
    const [movement] = await db
      .insert(palletMovementsTable)
      .values({
        speditionId,
        shipmentId: shipmentId || null,
        movementType,
        movementDate,
        amount,
        bemerkungen,
        createdBy: req.session.userId,
      })
      .returning();

    await logAudit(req.session.userId!, "pallet_movement", movement.id, "created", null, `${movementType}:${amount}`);
    emit(req, "pallet_movement.created", { id: movement.id, speditionId });
    emit(req, "pallet_balance.updated", { speditionId });

    return res.status(201).json({ ...movement, speditionName: null, shipmentBezeichnung: null, createdByName: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/pallet-movements/:id", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (!["comet_admin", "comet_leitstand"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const id = Number(req.params.id);
    const { movementType, movementDate, amount, bemerkungen } = req.body;
    const updates: any = {};
    if (movementType !== undefined) updates.movementType = movementType;
    if (movementDate !== undefined) updates.movementDate = movementDate;
    if (amount !== undefined) updates.amount = amount;
    if (bemerkungen !== undefined) updates.bemerkungen = bemerkungen;

    const [movement] = await db.update(palletMovementsTable).set(updates).where(eq(palletMovementsTable.id, id)).returning();
    if (!movement) return res.status(404).json({ error: "Not found" });
    emit(req, "pallet_balance.updated", { speditionId: movement.speditionId });
    return res.json({ ...movement, speditionName: null, shipmentBezeichnung: null, createdByName: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/pallet-movements/:id", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (!["comet_admin", "comet_leitstand"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const id = Number(req.params.id);
    const [m] = await db.select().from(palletMovementsTable).where(eq(palletMovementsTable.id, id)).limit(1);
    await db.delete(palletMovementsTable).where(eq(palletMovementsTable.id, id));
    if (m) emit(req, "pallet_balance.updated", { speditionId: m.speditionId });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Pallet Balances ----

router.get("/pallet-balances", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;

    const speds = await db.select().from(speditionenTable).where(eq(speditionenTable.status, "aktiv"));
    const movements = await db.select().from(palletMovementsTable);

    const balances = speds
      .filter((s) => {
        if (["speditions_admin", "speditions_bearbeiter", "speditions_viewer"].includes(role)) {
          return s.id === sessionSpeditionId;
        }
        return true;
      })
      .map((s) => {
        const spedMovements = movements.filter((m) => m.speditionId === s.id);
        const balance = spedMovements.reduce((sum, m) => {
          if (m.movementType === "eingang") return sum + m.amount;
          if (m.movementType === "ausgang") return sum - m.amount;
          if (m.movementType === "korrektur") return sum + m.amount;
          return sum;
        }, 0);
        const lastMovement = spedMovements.sort((a, b) => b.movementDate.localeCompare(a.movementDate))[0];
        return {
          speditionId: s.id,
          speditionName: s.name,
          kuerzel: s.kuerzel,
          balance,
          lastMovementDate: lastMovement?.movementDate ?? null,
        };
      });

    return res.json(balances);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---- CSV Export ----

router.get("/pallet-export", requireAuth, async (req, res) => {
  try {
    const { speditionId, dateFrom, dateTo } = req.query as Record<string, string>;
    let rows = await db.select().from(palletMovementsTable);
    const sessionSpeditionId = req.session.speditionId;
    const role = req.session.role!;

    if (["speditions_admin", "speditions_bearbeiter", "speditions_viewer"].includes(role)) {
      rows = rows.filter((m) => m.speditionId === sessionSpeditionId);
    } else if (speditionId) {
      rows = rows.filter((m) => m.speditionId === Number(speditionId));
    }
    if (dateFrom) rows = rows.filter((m) => m.movementDate >= dateFrom);
    if (dateTo) rows = rows.filter((m) => m.movementDate <= dateTo);

    const speds = await db.select().from(speditionenTable);
    const spedMap: Record<number, string> = {};
    for (const s of speds) spedMap[s.id] = s.name;

    const lines = [
      "ID,Datum,Spedition,Art,Menge,Bemerkungen",
      ...rows.map(
        (m) =>
          `${m.id},${m.movementDate},${spedMap[m.speditionId] ?? m.speditionId},${m.movementType},${m.amount},"${m.bemerkungen ?? ""}"`
      ),
    ];

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="paletten-export.csv"`);
    return res.send(lines.join("\n"));
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
