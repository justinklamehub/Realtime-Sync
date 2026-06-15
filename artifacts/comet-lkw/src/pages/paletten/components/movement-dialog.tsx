import { useState } from "react";
import { useCreatePalletMovement, useListSpeditionen, getListPalletMovementsQueryKey, getListPalletBalancesQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const emptyForm = () => ({
  palettenscheinnummer: "",
  vonCometEuropaletten: 0,
  vonCometLadungssicherung: 0,
  vonDefektePaletten: 0,
  anCometEuropaletten: 0,
  anCometLadungssicherung: 0,
  anDefektePaletten: 0,
});

export function MovementDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: speditionen } = useListSpeditionen();

  const isCometUser = user?.role && ["comet_admin", "comet_leitstand", "comet_lager"].includes(user.role);

  const [speditionId, setSpeditionId] = useState(
    !isCometUser && user?.speditionId ? String(user.speditionId) : ""
  );
  const [movementType, setMovementType] = useState("eingang");
  const [amount, setAmount] = useState("");
  const [movementDate, setMovementDate] = useState(new Date().toISOString().slice(0, 10));
  const [bemerkungen, setBemerkungen] = useState("");
  const [palletForm, setPalletForm] = useState(emptyForm());

  const requiresSchein = movementType !== "abstimmung";

  const createMutation = useCreatePalletMovement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPalletMovementsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListPalletBalancesQueryKey() });
        toast({ title: "Buchung erfasst" });
        onOpenChange(false);
        setAmount("");
        setBemerkungen("");
        setMovementType("eingang");
        setPalletForm(emptyForm());
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error ?? "Fehler beim Speichern";
        toast({ title: msg, variant: "destructive" });
      }
    }
  });

  const handleSave = () => {
    const parsedAmount = parseInt(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast({ title: "Bitte eine positive Anzahl eingeben", variant: "destructive" });
      return;
    }
    if (requiresSchein && !palletForm.palettenscheinnummer.trim()) {
      toast({ title: "Palettenscheinnummer ist erforderlich", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      data: {
        speditionId: parseInt(speditionId),
        movementType: movementType as any,
        movementDate,
        amount: parsedAmount,
        bemerkungen: bemerkungen || undefined,
        palettenscheinnummer: palletForm.palettenscheinnummer || undefined,
        vonCometEuropaletten: palletForm.vonCometEuropaletten,
        vonCometLadungssicherung: palletForm.vonCometLadungssicherung,
        vonDefektePaletten: palletForm.vonDefektePaletten,
        anCometEuropaletten: palletForm.anCometEuropaletten,
        anCometLadungssicherung: palletForm.anCometLadungssicherung,
        anDefektePaletten: palletForm.anDefektePaletten,
      }
    });
  };

  const setPallet = (key: keyof ReturnType<typeof emptyForm>, value: number | string) =>
    setPalletForm(f => ({ ...f, [key]: value }));

  const availableSpeditionen = isCometUser
    ? speditionen
    : speditionen?.filter(s => s.id === user?.speditionId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Neue Buchung erfassen</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4 py-2">
            {isCometUser && (
              <div className="space-y-2">
                <Label>Spedition</Label>
                <Select value={speditionId} onValueChange={setSpeditionId}>
                  <SelectTrigger><SelectValue placeholder="Spedition wählen" /></SelectTrigger>
                  <SelectContent>
                    {availableSpeditionen?.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Art</Label>
                <Select value={movementType} onValueChange={setMovementType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eingang">Eingang (+)</SelectItem>
                    <SelectItem value="ausgang">Ausgang (−)</SelectItem>
                    <SelectItem value="korrektur">Korrektur</SelectItem>
                    <SelectItem value="abstimmung">Abstimmung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Datum</Label>
                <Input type="date" value={movementDate} onChange={(e) => setMovementDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Anzahl Paletten</Label>
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="z.B. 10"
              />
              <p className="text-xs text-slate-500">
                {movementType === "ausgang"
                  ? "Positive Zahl — Ausgang wird vom Saldo abgezogen."
                  : movementType === "eingang"
                  ? "Positive Zahl — wird zum Saldo addiert."
                  : "Anzahl als positive Zahl eingeben."}
              </p>
            </div>

            {/* Palettenscheinnummer — required for all except Abstimmung */}
            <div className="space-y-2">
              <Label>
                Palettenscheinnummer
                {requiresSchein && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                value={palletForm.palettenscheinnummer}
                onChange={(e) => setPallet("palettenscheinnummer", e.target.value)}
                placeholder={requiresSchein ? "Pflichtfeld" : "Nicht erforderlich bei Abstimmung"}
                disabled={!requiresSchein}
              />
            </div>

            {/* Von COMET */}
            <div className="rounded-md border border-slate-200 p-3 bg-slate-50 space-y-2">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Von COMET</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Europaletten</Label>
                  <Input
                    type="number" min={0} className="h-8 text-sm"
                    value={palletForm.vonCometEuropaletten}
                    onChange={e => setPallet("vonCometEuropaletten", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Ladungssich.</Label>
                  <Input
                    type="number" min={0} className="h-8 text-sm"
                    value={palletForm.vonCometLadungssicherung}
                    onChange={e => setPallet("vonCometLadungssicherung", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-amber-600">davon defekt</Label>
                  <Input
                    type="number" min={0} className="h-8 text-sm"
                    value={palletForm.vonDefektePaletten}
                    onChange={e => setPallet("vonDefektePaletten", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* An COMET */}
            <div className="rounded-md border border-slate-200 p-3 bg-slate-50 space-y-2">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">An COMET</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Europaletten</Label>
                  <Input
                    type="number" min={0} className="h-8 text-sm"
                    value={palletForm.anCometEuropaletten}
                    onChange={e => setPallet("anCometEuropaletten", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Ladungssich.</Label>
                  <Input
                    type="number" min={0} className="h-8 text-sm"
                    value={palletForm.anCometLadungssicherung}
                    onChange={e => setPallet("anCometLadungssicherung", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-amber-600">davon defekt</Label>
                  <Input
                    type="number" min={0} className="h-8 text-sm"
                    value={palletForm.anDefektePaletten}
                    onChange={e => setPallet("anDefektePaletten", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bemerkung</Label>
              <Input value={bemerkungen} onChange={(e) => setBemerkungen(e.target.value)} placeholder="Optional" />
            </div>
          </div>
        </ScrollArea>
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
