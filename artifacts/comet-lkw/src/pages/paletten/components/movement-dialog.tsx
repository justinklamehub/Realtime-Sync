import { useState } from "react";
import { useCreatePalletMovement, useListSpeditionen, getListPalletMovementsQueryKey, getListPalletBalancesQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function MovementDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: speditionen } = useListSpeditionen();

  const [speditionId, setSpeditionId] = useState("");
  const [movementType, setMovementType] = useState("eingang");
  const [amount, setAmount] = useState("");
  const [bemerkungen, setBemerkungen] = useState("");

  const createMutation = useCreatePalletMovement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPalletMovementsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListPalletBalancesQueryKey() });
        toast({ title: "Buchung erfasst" });
        onOpenChange(false);
      }
    }
  });

  const handleSave = () => {
    createMutation.mutate({
      data: {
        speditionId: parseInt(speditionId),
        movementType: movementType as any,
        movementDate: new Date().toISOString(),
        amount: movementType === "ausgang" ? -Math.abs(parseInt(amount)) : parseInt(amount),
        bemerkungen
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Buchung erfassen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Spedition</Label>
            <Select value={speditionId} onValueChange={setSpeditionId}>
              <SelectTrigger><SelectValue placeholder="Spedition wählen" /></SelectTrigger>
              <SelectContent>
                {speditionen?.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Art</Label>
            <Select value={movementType} onValueChange={setMovementType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="eingang">Eingang (+)</SelectItem>
                <SelectItem value="ausgang">Ausgang (-)</SelectItem>
                <SelectItem value="korrektur">Korrektur</SelectItem>
                <SelectItem value="abstimmung">Abstimmung</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Anzahl Paletten</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Bemerkung</Label>
            <Input value={bemerkungen} onChange={(e) => setBemerkungen(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={createMutation.isPending || !speditionId || !amount}>
            {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
