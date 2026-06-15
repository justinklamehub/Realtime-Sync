import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useGetShipment, useCreateShipment, useUpdateShipment, getGetShipmentQueryKey, getListShipmentsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ShipmentDrawerProps {
  shipmentId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDrawer({ shipmentId, open, onOpenChange }: ShipmentDrawerProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: shipment, isLoading } = useGetShipment(shipmentId || 0, {
    query: {
      enabled: !!shipmentId && open,
      queryKey: getGetShipmentQueryKey(shipmentId || 0)
    }
  });

  const isEditing = !!shipmentId;
  const [kennzeichen, setKennzeichen] = useState("");
  const [tor, setTor] = useState("");
  
  useEffect(() => {
    if (shipment) {
      setKennzeichen(shipment.kennzeichen || "");
      setTor(shipment.tor || "");
    } else {
      setKennzeichen("");
      setTor("");
    }
  }, [shipment, open]);

  const updateMutation = useUpdateShipment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey() });
        if (shipmentId) {
          queryClient.invalidateQueries({ queryKey: getGetShipmentQueryKey(shipmentId) });
        }
        toast({ title: "Erfolgreich gespeichert" });
        onOpenChange(false);
      }
    }
  });

  const createMutation = useCreateShipment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey() });
        toast({ title: "Erfolgreich erstellt" });
        onOpenChange(false);
      }
    }
  });

  const handleSave = () => {
    if (isEditing && shipmentId) {
      updateMutation.mutate({ id: shipmentId, data: { kennzeichen, tor } });
    } else {
      createMutation.mutate({ data: { kennzeichen, tor, status: "Angemeldet" } });
    }
  };

  const isSaving = updateMutation.isPending || createMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{isEditing ? `Verladung ${kennzeichen}` : "Neue Verladung"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Bearbeiten Sie die Details der Verladung." : "Erfassen Sie eine neue Verladung."}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kennzeichen">Kennzeichen</Label>
              <Input 
                id="kennzeichen" 
                value={kennzeichen} 
                onChange={(e) => setKennzeichen(e.target.value)} 
                placeholder="z.B. B-A 1234"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tor">Tor</Label>
              <Input 
                id="tor" 
                value={tor} 
                onChange={(e) => setTor(e.target.value)} 
                placeholder="z.B. Tor 1"
              />
            </div>
            
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Speichern
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
