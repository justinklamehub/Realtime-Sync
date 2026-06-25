import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ticketsTable = pgTable("tickets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("System"),
  priority: text("priority").notNull().default("Mittel"),
  status: text("status").notNull().default("Offen"),
  createdBy: integer("created_by").notNull(),
  assignedTo: integer("assigned_to"),
  shipmentId: integer("shipment_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ticketCommentsTable = pgTable("ticket_comments", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull(),
  userId: integer("user_id").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertTicketSchema = createInsertSchema(ticketsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTicketCommentSchema = createInsertSchema(ticketCommentsTable).omit({ id: true, createdAt: true });
export type Ticket = typeof ticketsTable.$inferSelect;
export type TicketComment = typeof ticketCommentsTable.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type InsertTicketComment = z.infer<typeof insertTicketCommentSchema>;
