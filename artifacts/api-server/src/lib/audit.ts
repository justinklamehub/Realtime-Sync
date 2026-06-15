import { db } from "@workspace/db";
import { auditLogTable } from "@workspace/db";

export async function logAudit(
  userId: number | null,
  module: string,
  recordId: number,
  field: string | null,
  oldValue: string | null,
  newValue: string | null
) {
  try {
    await db.insert(auditLogTable).values({
      userId,
      module,
      recordId,
      field,
      oldValue: oldValue ? String(oldValue) : null,
      newValue: newValue ? String(newValue) : null,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
