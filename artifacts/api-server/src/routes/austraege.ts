import { Router } from "express";
import { db } from "@workspace/db";
import { lkwAustraegeTable, speditionenTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { logAudit } from "../lib/audit";

const router = Router();

const COMET_WRITE_ROLES = ["comet_admin", "comet_leitstand", "comet_lager"];
const COMET_ALL_ROLES = ["comet_admin", "comet_leitstand", "comet_lager", "comet_viewer"];

router.get("/austraege", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (!COMET_ALL_ROLES.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { shipmentId } = req.query as Record<string, string>;

    let rows = await db.select().from(lkwAustraegeTable).orderBy(lkwAustraegeTable.createdAt);

    if (shipmentId) {
      rows = rows.filter((r) => r.shipmentId === Number(shipmentId));
    }

    const speds = await db.select().from(speditionenTable);
    const spedMap: Record<number, string> = {};
    for (const s of speds) spedMap[s.id] = s.name;

    return res.json(
      rows.map((r) => ({
        ...r,
        beauftragteSpeditionName: r.beauftragteSpeditionId ? (spedMap[r.beauftragteSpeditionId] ?? null) : null,
      })),
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/austraege", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (!COMET_WRITE_ROLES.includes(role)) {
      return res.status(403).json({ error: "Keine Berechtigung" });
    }

    const {
      shipmentId,
      ladelistennummer,
      palettenscheinnummer,
      datum,
      kennzeichen,
      beauftragteSpeditionId,
      subSpedition,
      vonCometEuropaletten,
      vonCometLadungssicherung,
      vonDefektePaletten,
      anCometEuropaletten,
      anCometLadungssicherung,
      anDefektePaletten,
    } = req.body;

    if (!datum) {
      return res.status(400).json({ error: "Datum ist erforderlich" });
    }

    const [row] = await db
      .insert(lkwAustraegeTable)
      .values({
        shipmentId: shipmentId ? Number(shipmentId) : null,
        ladelistennummer: ladelistennummer || null,
        palettenscheinnummer: palettenscheinnummer || null,
        datum,
        kennzeichen: kennzeichen || null,
        beauftragteSpeditionId: beauftragteSpeditionId ? Number(beauftragteSpeditionId) : null,
        subSpedition: subSpedition || null,
        vonCometEuropaletten: Number(vonCometEuropaletten ?? 0),
        vonCometLadungssicherung: Number(vonCometLadungssicherung ?? 0),
        vonDefektePaletten: Number(vonDefektePaletten ?? 0),
        anCometEuropaletten: Number(anCometEuropaletten ?? 0),
        anCometLadungssicherung: Number(anCometLadungssicherung ?? 0),
        anDefektePaletten: Number(anDefektePaletten ?? 0),
        createdBy: req.session.userId!,
      })
      .returning();

    await logAudit(req.session.userId!, "austrag", row.id, "create", null, JSON.stringify({ shipmentId, datum }));

    const speds = await db.select().from(speditionenTable);
    const spedMap: Record<number, string> = {};
    for (const s of speds) spedMap[s.id] = s.name;

    return res.status(201).json({
      ...row,
      beauftragteSpeditionName: row.beauftragteSpeditionId ? (spedMap[row.beauftragteSpeditionId] ?? null) : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/austraege/:id", requireAuth, async (req, res) => {
  try {
    const role = req.session.role!;
    if (!["comet_admin", "comet_leitstand"].includes(role)) {
      return res.status(403).json({ error: "Keine Berechtigung" });
    }

    const id = Number(req.params.id);
    await db.delete(lkwAustraegeTable).where(eq(lkwAustraegeTable.id, id));
    await logAudit(req.session.userId!, "austrag", id, "delete", null, null);

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
