import { useState } from "react";
import { useListShipments } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Plus, Lock, ArrowRight } from "lucide-react";
import { ShipmentDrawer } from "./components/shipment-drawer";
import { Shipment } from "@workspace/api-client-react";

export default function ShipmentsPage() {
  const [search, setSearch] = useState("");
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { data: shipments, isLoading } = useListShipments({
    search: search.length > 2 ? search : undefined
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Angemeldet": return "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
      case "Erwartet": return "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200";
      case "Angekommen": return "bg-green-50 text-green-700 hover:bg-green-100 border-green-200";
      case "Verladen": return "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
      case "Abgefertigt": return "bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200";
      case "Storniert": return "bg-red-50 text-red-700 hover:bg-red-100 border-red-200";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-200";
    }
  };

  const handleRowClick = (shipment: Shipment) => {
    setSelectedShipmentId(shipment.id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verladungen</h1>
          <p className="text-sm text-slate-500">Verwalten und verfolgen Sie alle LKW-Bewegungen.</p>
        </div>
        <Button onClick={() => { setSelectedShipmentId(null); setIsDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Neue Verladung
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Suchen nach Kennzeichen, Tor..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Kennzeichen</TableHead>
              <TableHead>Spedition</TableHead>
              <TableHead>Art</TableHead>
              <TableHead>ETA / ATA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tor</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : !shipments || shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  Keine Verladungen gefunden.
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment.id} className="cursor-pointer hover:bg-slate-50" onClick={() => handleRowClick(shipment)}>
                  <TableCell className="font-medium">{shipment.kennzeichen || "-"}</TableCell>
                  <TableCell>{shipment.speditionName || "-"}</TableCell>
                  <TableCell>{shipment.lkwArt || "-"}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {shipment.etaDate && shipment.etaTime ? (
                        <div className="text-slate-600">
                          ETA: <span className="font-medium">{format(new Date(shipment.etaDate), "dd.MM.yy")} {shipment.etaTime}</span>
                        </div>
                      ) : null}
                      {shipment.ataDate && shipment.ataTime ? (
                        <div className="text-green-700">
                          ATA: <span className="font-medium">{format(new Date(shipment.ataDate), "dd.MM.yy")} {shipment.ataTime}</span>
                        </div>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(shipment.status)}>
                      {shipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{shipment.tor || "-"}</TableCell>
                  <TableCell>
                    {shipment.gesperrtFuerSpedition ? (
                      <Lock className="w-4 h-4 text-red-500" />
                    ) : <ArrowRight className="w-4 h-4 text-slate-300" />}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ShipmentDrawer 
        shipmentId={selectedShipmentId} 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
      />
    </div>
  );
}
