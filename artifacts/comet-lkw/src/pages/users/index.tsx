import { useState } from "react";
import { useListUsers } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, UserCog } from "lucide-react";
import { UserDialog } from "./components/user-dialog";
import { useAuth } from "@/contexts/auth-context";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useListUsers();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);

  const canManage = currentUser?.role === "comet_admin" || currentUser?.role === "speditions_admin";

  const getRoleBadge = (role: string) => {
    if (role.startsWith("comet_")) {
      return <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20 text-xs">{role.replace("comet_", "")}</Badge>;
    }
    return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none text-xs">{role.replace("speditions_", "")}</Badge>;
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Benutzer</h1>
          <p className="text-sm text-slate-500">Verwalten Sie Systemzugänge und Rollen.</p>
        </div>
        {canManage && (
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Neuer Benutzer
          </Button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Benutzername</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Spedition</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Status</TableHead>
              {canManage && <TableHead className="text-right">Aktionen</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={canManage ? 6 : 5} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : !users || users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 6 : 5} className="text-center py-8 text-slate-500">
                  Keine Benutzer gefunden.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className={!user.isActive ? "opacity-50" : ""}>
                  <TableCell className="font-medium text-slate-900">{user.username}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{user.email || "—"}</TableCell>
                  <TableCell className="text-slate-700 font-medium text-sm">{user.speditionName || "COMET Intern"}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Aktiv</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Inaktiv</Badge>
                    )}
                  </TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditUser(user)}
                        title="Bearbeiten"
                      >
                        <UserCog className="w-4 h-4 text-slate-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <UserDialog
        open={!!editUser}
        onOpenChange={(v) => { if (!v) setEditUser(null); }}
        editUser={editUser}
      />
    </div>
  );
}
