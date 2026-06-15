import { Router } from "express";
import { db } from "@workspace/db";
import {
  shipmentsTable,
  speditionenTable,
  palletMovementsTable,
  palletReconciliationsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query as Record<string, string>;
    const role = req.session.role!;
    const sessionSpeditionId = req.session.speditionId;

    const today = new Date().toISOString().split("T")[0];
    const from = dateFrom || today;
    const to = dateTo || today;

    let shipments = await db.select().from(shipmentsTable);

    // Filter by date range
    shipments = shipments.filter(
      (s) =>
        (s.etaDate && s.etaDate >= from && s.etaDate <= to) ||
        (s.ataDate && s.ataDate >= from && s.ataDate <= to)
    );

    // Spedition users see only their own
    if (["speditions_admin", "speditions_bearbeiter", "speditions_viewer"].includes(role)) {
      shipments = shipments.filter((s) => s.speditionId === sessionSpeditionId);
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const totalShipments = shipments.length;
    const expectedShipments = shipments.filter((s) => s.status === "Erwartet" || s.status === "Angemeldet").length;
    const arrivedShipments = shipments.filter((s) => s.ataDate !== null).length;
    const openShipments = shipments.filter((s) => !["Abgefertigt", "Storniert"].includes(s.status)).length;

    // Late: etaDate is today or earlier, etaTime is past, not yet arrived
    const lateShipments = shipments.filter((s) => {
      if (s.ataDate) return false;
      if (!s.etaDate || !s.etaTime) return false;
      return s.etaDate < today || (s.etaDate === today && s.etaTime < currentTime);
    }).length;

    // By status
    const statusCounts: Record<string, number> = {};
    for (const s of shipments) {
      statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
    }
    const byStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    // By spedition
    const spedCounts: Record<number, number> = {};
    for (const s of shipments) {
      if (s.speditionId) spedCounts[s.speditionId] = (spedCounts[s.speditionId] || 0) + 1;
    }

    const speds = await db.select().from(speditionenTable);
    const spedMap: Record<number, string> = {};
    for (const s of speds) spedMap[s.id] = s.name;

    const bySpedition = Object.entries(spedCounts).map(([speditionId, count]) => ({
      speditionId: Number(speditionId),
      speditionName: spedMap[Number(speditionId)] ?? "Unknown",
      count,
    }));

    // Pallet balances
    const movements = await db.select().from(palletMovementsTable);
    let filteredSpeds = speds.filter((s) => s.status === "aktiv");
    if (["speditions_admin", "speditions_bearbeiter", "speditions_viewer"].includes(role)) {
      filteredSpeds = filteredSpeds.filter((s) => s.id === sessionSpeditionId);
    }
    const palletBalances = filteredSpeds.map((s) => {
      const spedMvts = movements.filter((m) => m.speditionId === s.id);
      const balance = spedMvts.reduce((sum, m) => {
        if (m.movementType === "eingang") return sum + m.amount;
        if (m.movementType === "ausgang") return sum - m.amount;
        if (m.movementType === "korrektur") return sum + m.amount;
        return sum;
      }, 0);
      return {
        speditionId: s.id,
        speditionName: s.name,
        kuerzel: s.kuerzel,
        balance,
        lastMovementDate: null,
      };
    });

    // Open reconciliations count
    const recs = await db.select().from(palletReconciliationsTable);
    let filteredRecs = recs.filter((r) => r.status === "offen" || r.status === "in_pruefung");
    if (["speditions_admin", "speditions_bearbeiter", "speditions_viewer"].includes(role)) {
      filteredRecs = filteredRecs.filter((r) => r.speditionId === sessionSpeditionId);
    }

    return res.json({
      totalShipments,
      expectedShipments,
      arrivedShipments,
      openShipments,
      lateShipments,
      byStatus,
      bySpedition,
      palletBalances,
      openReconciliations: filteredRecs.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
