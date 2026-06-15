import { useState, useEffect } from "react";
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useListSpeditionen,
  getListUsersQueryKey,
} from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserX } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface User {
  id: number;
  username: string;
  email?: string | null;
  role: string;
  speditionId?: number | null;
  isActive?: boolean;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editUser?: User | null;
}

const COMET_ROLES = [
  { value: "comet_admin", label: "COMET Admin" },
  { value: "comet_leitstand", label: "COMET Leitstand" },
  { value: "comet_lager", label: "COMET Lager" },
  { value: "comet_viewer", label: "COMET Viewer" },
];
const SPED_ROLES = [
  { value: "speditions_admin", label: "Speditions-Admin" },
  { value: "speditions_bearbeiter", label: "Speditions-Bearbeiter" },
  { value: "speditions_viewer", label: "Speditions-Viewer" },
];

export function UserDialog({ open, onOpenChange, editUser }: UserDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { data: speditionen } = useListSpeditionen();
  const isEditing = !!editUser;
  const isCometAdmin = currentUser?.role === "comet_admin";
  const isSpedAdmin = currentUser?.role === "speditions_admin";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("comet_viewer");
  const [speditionId, setSpeditionId] = useState<string>("__none__");

  useEffect(() => {
    if (open) {
      if (editUser) {
        setUsername(editUser.username);
        setEmail(editUser.email ?? "");
        setPassword("");
        setRole(editUser.role);
        setSpeditionId(editUser.speditionId ? String(editUser.speditionId) : "__none__");
      } else {
        setUsername(""); setEmail(""); setPassword("");
        setRole(isSpedAdmin ? "speditions_bearbeiter" : "comet_viewer");
        setSpeditionId("__none__");
      }
    }
  }, [open, editUser, isSpedAdmin]);

  const createMutation = useCreateUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        toast({ title: "Benutzer erstellt" });
        onOpenChange(false);
      },
      onError: (e: any) => toast({ title: e?.response?.data?.error ?? "Fehler", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        toast({ title: "Benutzer gespeichert" });
        onOpenChange(false);
      },
      onError: (e: any) => toast({ title: e?.response?.data?.error ?? "Fehler", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        toast({ title: "Benutzer deaktiviert" });
        onOpenChange(false);
      },
      onError: () => toast({ title: "Fehler beim Deaktivieren", variant: "destructive" }),
    },
  });

  const handleSave = () => {
    if (!username.trim()) {
      toast({ title: "Benutzername erforderlich", variant: "destructive" });
      return;
    }
    const resolvedSpeditionId = speditionId === "__none__" ? null : parseInt(speditionId);
    const data: any = { username, email: email || undefined, role: role as any };
    if (password) data.password = password;
    if (isCometAdmin) data.speditionId = resolvedSpeditionId;

    if (isEditing && editUser) {
      updateMutation.mutate({ id: editUser.id, data });
    } else {
      if (!password) {
        toast({ title: "Passwort erforderlich", variant: "destructive" });
        return;
      }
      createMutation.mutate({ data: { ...data, password, isActive: true } });
    }
  };

  const handleDeactivate = () => {
    if (editUser) {
      deleteMutation.mutate({ id: editUser.id });
    }
  };

  const availableRoles = isSpedAdmin ? SPED_ROLES : [...COMET_ROLES, ...SPED_ROLES];
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Benutzer bearbeiten" : "Neuer Benutzer"}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Zugangsdaten für ${editUser?.username}` : "Erstellen Sie einen neuen Systemzugang."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Benutzername</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="benutzername" />
          </div>
          <div className="space-y-1">
            <Label>E-Mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="optional" />
          </div>
          <div className="space-y-1">
            <Label>{isEditing ? "Neues Passwort (leer lassen = unverändert)" : "Passwort *"}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEditing ? "••••••••" : "Passwort eingeben"} />
          </div>
          <div className="space-y-1">
            <Label>Rolle</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {availableRoles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {role.startsWith("speditions_") && isCometAdmin && (
            <div className="space-y-1">
              <Label>Spedition</Label>
              <Select value={speditionId} onValueChange={setSpeditionId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Keine —</SelectItem>
                  {speditionen?.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isEditing && editUser?.isActive && (
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 sm:mr-auto"
              onClick={handleDeactivate}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4 mr-1" />}
              Deaktivieren
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
