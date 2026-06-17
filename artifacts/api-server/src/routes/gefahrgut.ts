import { Router } from "express";
import { db } from "@workspace/db";
import { gefahrgutChecklistenTable, shipmentsTable, speditionenTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { isCometRole } from "../lib/auth";

const router = Router();

router.get("/api/scanner/find-shipment", async (req, res) => {
  try {
    const { kennzeichen } = req.query as { kennzeichen?: string };
    if (!kennzeichen) {
      return res.status(400).json({ error: "kennzeichen erforderlich" });
    }
    const shipments = await db
      .select({
        id: shipmentsTable.id,
        kennzeichen: shipmentsTable.kennzeichen,
        bezeichnung: shipmentsTable.bezeichnung,
        speditionId: shipmentsTable.speditionId,
        status: shipmentsTable.status,
      })
      .from(shipmentsTable)
      .where(eq(shipmentsTable.kennzeichen, kennzeichen.toUpperCase().trim()))
      .limit(1);

    if (shipments.length === 0) {
      return res.json({ found: false, shipment: null, spedition: null });
    }

    const shipment = shipments[0];
    let speditionName: string | null = null;
    if (shipment.speditionId) {
      const speds = await db
        .select({ name: speditionenTable.name })
        .from(speditionenTable)
        .where(eq(speditionenTable.id, shipment.speditionId))
        .limit(1);
      if (speds.length > 0) speditionName = speds[0].name;
    }

    return res.json({ found: true, shipment, spedition: speditionName });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

router.post("/api/scanner/gefahrgut", async (req, res) => {
  try {
    const {
      shipmentId,
      kennzeichen,
      items,
      anhaenger,
      spedition,
      nameFahrer,
      unterschriftFahrer,
      nameVerlader,
      datum,
      unterschriftVerlader,
      palettenAngeliefert,
      davonDefekteAngeliefert,
      palettenVerladen,
      davonDefekteVerladen,
      ladungssicherung,
      bemerkungen,
    } = req.body;

    if (!kennzeichen) {
      return res.status(400).json({ error: "Kennzeichen erforderlich" });
    }

    const [inserted] = await db
      .insert(gefahrgutChecklistenTable)
      .values({
        shipmentId: shipmentId ?? null,
        kennzeichen: kennzeichen?.toUpperCase().trim(),
        items: items ?? {},
        anhaenger: anhaenger || null,
        spedition: spedition || null,
        nameFahrer: nameFahrer || null,
        unterschriftFahrer: unterschriftFahrer || null,
        nameVerlader: nameVerlader || null,
        datum: datum || null,
        unterschriftVerlader: unterschriftVerlader || null,
        palettenAngeliefert: palettenAngeliefert != null ? Number(palettenAngeliefert) : null,
        davonDefekteAngeliefert: davonDefekteAngeliefert != null ? Number(davonDefekteAngeliefert) : null,
        palettenVerladen: palettenVerladen != null ? Number(palettenVerladen) : null,
        davonDefekteVerladen: davonDefekteVerladen != null ? Number(davonDefekteVerladen) : null,
        ladungssicherung: ladungssicherung || null,
        bemerkungen: bemerkungen || null,
      })
      .returning();

    return res.status(201).json({ success: true, id: inserted.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Serverfehler beim Speichern" });
  }
});

router.get("/api/gefahrgut-checklisten", requireAuth, async (req, res) => {
  try {
    if (!isCometRole(req.session.role!)) {
      return res.status(403).json({ error: "Kein Zugriff" });
    }
    const rows = await db
      .select()
      .from(gefahrgutChecklistenTable)
      .orderBy(desc(gefahrgutChecklistenTable.eingereichtAt))
      .limit(200);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

router.get("/api/gefahrgut-checklisten/:id", requireAuth, async (req, res) => {
  try {
    if (!isCometRole(req.session.role!)) {
      return res.status(403).json({ error: "Kein Zugriff" });
    }
    const id = Number(req.params.id);
    const rows = await db
      .select()
      .from(gefahrgutChecklistenTable)
      .where(eq(gefahrgutChecklistenTable.id, id))
      .limit(1);
    if (rows.length === 0) return res.status(404).json({ error: "Nicht gefunden" });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

export default router;
