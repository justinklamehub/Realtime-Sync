import { useState } from "react";
import { useCreateUser, useListSpeditionen, getListUsersQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDialog({ open, onOpenChange }: UserDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: speditionen } = useListSpeditionen();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("comet_viewer");
  const [speditionId, setSpeditionId] = useState<string>("none");

  const createMutation = useCreateUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        toast({ title: "Benutzer erstellt" });
        onOpenChange(false);
      }
    }
  });

  const handleSave = () => {
    createMutation.mutate({
      data: {
        username,
        email,
        password,
        role: role as any,
        speditionId: speditionId === "none" ? null : parseInt(speditionId),
        isActive: true
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neuer Benutzer</DialogTitle>
          <DialogDescription>Erstellen Sie einen neuen Zugang für das System.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Benutzername</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>E-Mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Passwort</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Rolle</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comet_admin">COMET Admin</SelectItem>
                <SelectItem value="comet_leitstand">COMET Leitstand</SelectItem>
                <SelectItem value="comet_lager">COMET Lager</SelectItem>
                <SelectItem value="comet_viewer">COMET Viewer</SelectItem>
                <SelectItem value="speditions_admin">Speditions-Admin</SelectItem>
                <SelectItem value="speditions_bearbeiter">Speditions-Bearbeiter</SelectItem>
                <SelectItem value="speditions_viewer">Speditions-Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role.startsWith("speditions_") && (
            <div className="space-y-2">
              <Label>Spedition</Label>
              <Select value={speditionId} onValueChange={setSpeditionId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Keine</SelectItem>
                  {speditionen?.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={createMutation.isPending}>
            {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
