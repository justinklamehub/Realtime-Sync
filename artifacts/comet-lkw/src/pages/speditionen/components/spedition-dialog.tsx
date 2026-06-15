import { useState } from "react";
import { useCreateSpedition, getListSpeditionenQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function SpeditionDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [kuerzel, setKuerzel] = useState("");
  const [ansprechpartner, setAnsprechpartner] = useState("");
  const [email, setEmail] = useState("");

  const createMutation = useCreateSpedition({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSpeditionenQueryKey() });
        toast({ title: "Spedition erstellt" });
        onOpenChange(false);
      }
    }
  });

  const handleSave = () => {
    createMutation.mutate({
      data: {
        name,
        kuerzel,
        ansprechpartner,
        email,
        status: "aktiv"
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Spedition</DialogTitle>
          <DialogDescription>Fügen Sie einen neuen Logistikpartner hinzu.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Kürzel</Label>
            <Input value={kuerzel} onChange={(e) => setKuerzel(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Ansprechpartner</Label>
            <Input value={ansprechpartner} onChange={(e) => setAnsprechpartner(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>E-Mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
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
