import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const auditLogTable = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  module: text("module").notNull(),
  recordId: integer("record_id").notNull(),
  field: text("field"),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  changedAt: timestamp("changed_at", { withTimezone: true }).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogTable.$inferSelect;
