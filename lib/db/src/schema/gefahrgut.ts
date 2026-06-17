import { pgTable, serial, integer, text, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { shipmentsTable } from "./shipments";

export const gefahrgutChecklistenTable = pgTable("gefahrgut_checklisten", {
  id:              serial("id").primaryKey(),
  shipmentId:      integer("shipment_id").references(() => shipmentsTable.id),
  kennzeichen:     text("kennzeichen"),
  items:           jsonb("items").notNull().default({}),
  anhaenger:       text("anhaenger"),
  spedition:       text("spedition"),
  nameFahrer:      text("name_fahrer"),
  unterschriftFahrer:   text("unterschrift_fahrer"),
  nameVerlader:    text("name_verlader"),
  datum:           date("datum"),
  unterschriftVerlader: text("unterschrift_verlader"),
  palettenAngeliefert:       integer("paletten_angeliefert"),
  davonDefekteAngeliefert:   integer("davon_defekte_angeliefert"),
  palettenVerladen:          integer("paletten_verladen"),
  davonDefekteVerladen:      integer("davon_defekte_verladen"),
  ladungssicherung:  text("ladungssicherung"),
  bemerkungen:       text("bemerkungen"),
  eingereichtAt: timestamp("eingereicht_at", { withTimezone: true }).defaultNow().notNull(),
});

export type GefahrgutCheckliste = typeof gefahrgutChecklistenTable.$inferSelect;
