import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PermissionEntry {
  role: string;
  permission: string;
  allowed: boolean;
}

interface PermissionsData {
  matrix: PermissionEntry[];
  permissions: string[];
  roles: string[];
  permissionLabels: Record<string, { label: string; category: string }>;
  roleLabels: Record<string, string>;
}

const READONLY_ROLES = new Set(["comet_viewer", "speditions_viewer"]);
const SUPERADMIN_ROLE = "comet_admin";

const CATEGORY_COLORS: Record<string, string> = {
  Palettenbuchungen: "bg-blue-50 text-blue-800 border-blue-200",
  Verladungen:       "bg-green-50 text-green-800 border-green-200",
  Austragen:         "bg-orange-50 text-orange-800 border-orange-200",
  Abstimmungen:      "bg-purple-50 text-purple-800 border-purple-200",
};

const ROLE_GROUP: Record<string, string> = {
  comet_leitstand:       "COMET intern",
  comet_lager:           "COMET intern",
  comet_viewer:          "COMET intern",
  speditions_admin:      "Speditionen",
  speditions_bearbeiter: "Speditionen",
  speditions_viewer:     "Speditionen",
};

export default function BerechtigungenPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const qKey = ["admin-permissions"];

  const { data, isLoading } = useQuery<PermissionsData>({
    queryKey: qKey,
    queryFn: () => customFetch("/api/admin/permissions"),
  });

  const mutation = useMutation({
    mutationFn: (payload: { role: string; permission: string; allowed: boolean }) =>
      customFetch("/api/admin/permissions", {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: (_, vars) => {
      queryClient.setQueryData<PermissionsData>(qKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          matrix: old.matrix.map((m) =>
            m.role === vars.role && m.permission === vars.permission
              ? { ...m, allowed: vars.allowed }
              : m
          ),
        };
      });
    },
    onError: () => toast({ title: "Fehler beim Speichern", variant: "destructive" }),
  });

  if (user?.role !== "comet_admin") {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Lock className="w-12 h-12" />
        <p className="text-sm">Nur COMET Admin hat Zugriff auf diese Seite.</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const lookup = new Map<string, boolean>();
  for (const e of data.matrix) lookup.set(`${e.role}::${e.permission}`, e.allowed);

  const isAllowed = (role: string, perm: string) => {
    if (role === SUPERADMIN_ROLE) return true;
    return lookup.get(`${role}::${perm}`) ?? false;
  };

  const isLocked = (role: string) => READONLY_ROLES.has(role);

  const categories = Array.from(
    new Set(data.permissions.map((p) => data.permissionLabels[p]?.category ?? "Sonstiges"))
  );

  const permsByCategory = (cat: string) =>
    data.permissions.filter((p) => data.permissionLabels[p]?.category === cat);

  const displayRoles = [SUPERADMIN_ROLE, ...data.roles];
  const roleGroups = ["COMET Admin", "COMET intern", "Speditionen"];

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-slate-900">Rollenberechtigungen</h1>
          <p className="text-sm text-slate-500">
            Legen Sie fest, welche Aktionen jede Rolle durchführen darf.
            COMET Admin hat immer alle Rechte. Viewer-Rollen sind immer schreibgeschützt.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-3 px-4 font-semibold text-slate-600 w-48">Aktion</th>
              {displayRoles.map((role) => (
                <th key={role} className="py-3 px-3 text-center font-medium text-slate-700 min-w-[110px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold">{data.roleLabels[role] ?? role}</span>
                    <span className="text-[10px] font-normal text-slate-400">
                      {ROLE_GROUP[role] ?? "COMET Admin"}
                    </span>
                    {role === SUPERADMIN_ROLE && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 bg-yellow-50 text-yellow-700 border-yellow-200">Admin</Badge>
                    )}
                    {isLocked(role) && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 bg-slate-100 text-slate-500 border-slate-200">
                        <Lock className="w-2.5 h-2.5 mr-0.5" />Nur Lesen
                      </Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, ci) => (
              <>
                <tr key={`cat-${cat}`} className="bg-slate-50/60">
                  <td
                    colSpan={displayRoles.length + 1}
                    className="py-2 px-4"
                  >
                    <Badge variant="outline" className={cn("text-xs font-semibold", CATEGORY_COLORS[cat] ?? "bg-slate-100 text-slate-600 border-slate-200")}>
                      {cat}
                    </Badge>
                  </td>
                </tr>
                {permsByCategory(cat).map((perm, pi) => {
                  const label = data.permissionLabels[perm]?.label ?? perm;
                  const isLast = pi === permsByCategory(cat).length - 1 && ci === categories.length - 1;
                  return (
                    <tr
                      key={perm}
                      className={cn(
                        "hover:bg-slate-50/50 transition-colors",
                        !isLast && "border-b border-slate-100"
                      )}
                    >
                      <td className="py-3 px-4 text-slate-700 font-medium">{label}</td>
                      {displayRoles.map((role) => {
                        const allowed = isAllowed(role, perm);
                        const locked = role === SUPERADMIN_ROLE || isLocked(role);
                        return (
                          <td key={role} className="py-3 px-3 text-center">
                            <div className="flex justify-center">
                              {locked ? (
                                <Switch
                                  checked={allowed}
                                  disabled
                                  className="opacity-40 cursor-not-allowed"
                                />
                              ) : (
                                <Switch
                                  checked={allowed}
                                  onCheckedChange={(val) =>
                                    mutation.mutate({ role, permission: perm, allowed: val })
                                  }
                                  disabled={mutation.isPending}
                                />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Änderungen werden sofort wirksam — aktive Sessions werden beim nächsten Request neu geprüft.
      </p>
    </div>
  );
}
