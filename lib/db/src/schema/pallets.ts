import { pgTable, serial, text, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const palletMovementsTable = pgTable("pallet_movements", {
  id: serial("id").primaryKey(),
  speditionId: integer("spedition_id").notNull(),
  shipmentId: integer("shipment_id"),
  movementType: text("movement_type").notNull(),
  movementDate: date("movement_date").notNull(),
  amount: integer("amount").notNull(),
  bemerkungen: text("bemerkungen"),
  palettenscheinnummer: text("palettenscheinnummer"),
  vonCometEuropaletten: integer("von_comet_europaletten").default(0),
  vonCometLadungssicherung: integer("von_comet_ladungssicherung").default(0),
  vonDefektePaletten: integer("von_defekte_paletten").default(0),
  anCometEuropaletten: integer("an_comet_europaletten").default(0),
  anCometLadungssicherung: integer("an_comet_ladungssicherung").default(0),
  anDefektePaletten: integer("an_defekte_paletten").default(0),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const palletReconciliationsTable = pgTable("pallet_reconciliations", {
  id: serial("id").primaryKey(),
  speditionId: integer("spedition_id").notNull(),
  dateFrom: date("date_from").notNull(),
  dateTo: date("date_to").notNull(),
  status: text("status").notNull().default("offen"),
  cometBalance: integer("comet_balance"),
  speditionBalance: integer("spedition_balance"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reconciliationCommentsTable = pgTable("reconciliation_comments", {
  id: serial("id").primaryKey(),
  reconciliationId: integer("reconciliation_id").notNull(),
  userId: integer("user_id").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const palletPlantCountsTable = pgTable("pallet_plant_counts", {
  id: serial("id").primaryKey(),
  recordedAt: date("recorded_at").notNull(),
  amount: integer("amount").notNull(),
  note: text("note"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertPalletMovementSchema = createInsertSchema(palletMovementsTable).omit({ id: true, createdAt: true });
export type InsertPalletMovement = z.infer<typeof insertPalletMovementSchema>;
export type PalletMovement = typeof palletMovementsTable.$inferSelect;
