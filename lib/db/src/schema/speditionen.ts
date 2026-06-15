import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const speditionenTable = pgTable("speditionen", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  kuerzel: text("kuerzel").notNull().unique(),
  ansprechpartner: text("ansprechpartner"),
  email: text("email"),
  telefon: text("telefon"),
  status: text("status").notNull().default("aktiv"),
  bemerkungen: text("bemerkungen"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const speditionPermissionsTable = pgTable("spedition_permissions", {
  id: serial("id").primaryKey(),
  grantingSpeditionId: serial("granting_spedition_id").notNull(),
  receivingSpeditionId: serial("receiving_spedition_id").notNull(),
  permissionLevel: text("permission_level").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertSpeditionSchema = createInsertSchema(speditionenTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSpedition = z.infer<typeof insertSpeditionSchema>;
export type Spedition = typeof speditionenTable.$inferSelect;
