import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

export type Permission =
  | "pallet.create"
  | "pallet.edit"
  | "pallet.delete"
  | "shipment.create"
  | "shipment.edit"
  | "shipment.delete"
  | "shipment.lock"
  | "shipment.reschedule"
  | "austrag.create"
  | "austrag.delete"
  | "reconciliation.create"
  | "reconciliation.sign";

export type ConfigurableRole =
  | "comet_leitstand"
  | "comet_lager"
  | "comet_viewer"
  | "speditions_admin"
  | "speditions_bearbeiter"
  | "speditions_viewer";

export const ALL_CONFIGURABLE_ROLES: ConfigurableRole[] = [
  "comet_leitstand",
  "comet_lager",
  "comet_viewer",
  "speditions_admin",
  "speditions_bearbeiter",
  "speditions_viewer",
];

export const ALL_PERMISSIONS: Permission[] = [
  "pallet.create",
  "pallet.edit",
  "pallet.delete",
  "shipment.create",
  "shipment.edit",
  "shipment.delete",
  "shipment.lock",
  "shipment.reschedule",
  "austrag.create",
  "austrag.delete",
  "reconciliation.create",
  "reconciliation.sign",
];

export const PERMISSION_LABELS: Record<Permission, { label: string; category: string }> = {
  "pallet.create":        { label: "Buchung erstellen",       category: "Palettenbuchungen" },
  "pallet.edit":          { label: "Buchung bearbeiten",      category: "Palettenbuchungen" },
  "pallet.delete":        { label: "Buchung löschen",         category: "Palettenbuchungen" },
  "shipment.create":      { label: "Sendung erstellen",       category: "Verladungen" },
  "shipment.edit":        { label: "Sendung bearbeiten",      category: "Verladungen" },
  "shipment.delete":      { label: "Sendung löschen",         category: "Verladungen" },
  "shipment.lock":        { label: "Sendung sperren",         category: "Verladungen" },
  "shipment.reschedule":  { label: "Datum verschieben (DnD)", category: "Verladungen" },
  "austrag.create":       { label: "Austrag durchführen",     category: "Austragen" },
  "austrag.delete":       { label: "Austrag löschen",         category: "Austragen" },
  "reconciliation.create":{ label: "Abstimmung erstellen",    category: "Abstimmungen" },
  "reconciliation.sign":  { label: "Abstimmung unterzeichnen",category: "Abstimmungen" },
};

export const ROLE_LABELS: Record<string, string> = {
  comet_admin:           "COMET Admin",
  comet_leitstand:       "COMET Leitstand",
  comet_lager:           "COMET Lager",
  comet_viewer:          "COMET Viewer",
  speditions_admin:      "Spedition Admin",
  speditions_bearbeiter: "Spedition Bearbeiter",
  speditions_viewer:     "Spedition Viewer",
};

// comet_admin = always all rights; not in DB
const SUPERADMIN_ROLE = "comet_admin";

// Cache: role -> permission -> allowed
let permCache: Map<string, Map<string, boolean>> | null = null;
let cacheLoading: Promise<void> | null = null;

async function loadCache(): Promise<void> {
  const rows = await db.execute(
    sql`SELECT role, permission, allowed FROM role_permissions`
  );
  const m = new Map<string, Map<string, boolean>>();
  for (const row of rows.rows as any[]) {
    if (!m.has(row.role)) m.set(row.role, new Map());
    m.get(row.role)!.set(row.permission, Boolean(row.allowed));
  }
  permCache = m;
}

export function invalidatePermissionsCache() {
  permCache = null;
  cacheLoading = null;
}

async function ensureCache(): Promise<Map<string, Map<string, boolean>>> {
  if (permCache) return permCache;
  if (!cacheLoading) cacheLoading = loadCache();
  await cacheLoading;
  return permCache!;
}

export async function can(role: string, permission: Permission): Promise<boolean> {
  if (role === SUPERADMIN_ROLE) return true;
  const cache = await ensureCache();
  const rolemap = cache.get(role);
  if (!rolemap) return false;
  return rolemap.get(permission) ?? false;
}

export async function getRolePermissionsMatrix(): Promise<
  { role: string; permission: string; allowed: boolean }[]
> {
  const rows = await db.execute(
    sql`SELECT role, permission, allowed FROM role_permissions ORDER BY role, permission`
  );
  return (rows.rows as any[]).map((r) => ({
    role: r.role,
    permission: r.permission,
    allowed: Boolean(r.allowed),
  }));
}
