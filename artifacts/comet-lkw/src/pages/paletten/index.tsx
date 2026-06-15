import { useState } from "react";
import { useListPalletBalances, useListPalletMovements, useListSpeditionen } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Loader2, Plus, Download } from "lucide-react";
import { MovementDialog } from "./components/movement-dialog";
import { MovementDetailSheet } from "./components/movement-detail-sheet";
import { ShipmentDrawer } from "@/pages/shipments/components/shipment-drawer";
import { useAuth } from "@/contexts/auth-context";

export default function PalettenPage() {
  const { user } = useAuth();
  const isCometUser = user?.role && ["comet_admin", "comet_leitstand", "comet_lager", "comet_viewer"].includes(user.role);
  const canWrite = user?.role && ["comet_admin", "comet_leitstand", "comet_lager"].includes(user.role);

  const [filterSpeditionId, setFilterSpeditionId] = useState<string>("__all__");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);
  const [isShipmentDrawerOpen, setIsShipmentDrawerOpen] = useState(false);

  const { data: speditionen } = useListSpeditionen();
  const { data: balances, isLoading: loadingBalances } = useListPalletBalances();
  const { data: movements, isLoading: loadingMovements } = useListPalletMovements({
    speditionId: (filterSpeditionId && filterSpeditionId !== "__all__") ? Number(filterSpeditionId) : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const handleExport = () => {
    const params = new URLSearchParams();
    if (filterSpeditionId && filterSpeditionId !== "__all__") params.set("speditionId", filterSpeditionId);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    window.open(`/api/pallet-export?${params.toString()}`, "_blank");
  };

  const handleRowClick = (movement: any) => {
    setSelectedMovement(movement);
    setIsDetailOpen(true);
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case "eingang": return "bg-green-100 text-green-800 hover:bg-green-100 border-transparent";
      case "ausgang": return "bg-red-100 text-red-800 hover:bg-red-100 border-transparent";
      case "korrektur": return "bg-orange-100 text-orange-800 hover:bg-orange-100 border-transparent";
      case "abstimmung": return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent";
      default: return "bg-slate-100 text-slate-800 border-transparent";
    }
  };

  const displayAmount = (m: any) => {
    const sign = m.movementType === "ausgang" ? "-" : m.movementType === "eingang" ? "+" : "";
    return `${sign}${m.amount}`;
  };

  const colSpan = isCometUser ? 7 : 6;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Palettenkonto</h1>
          <p className="text-sm text-slate-500">Übersicht der Euro-Paletten Salden und Buchungen.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            CSV Export
          </Button>
          {canWrite && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Neue Buchung
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {loadingBalances ? (
          <Card className="col-span-full border-slate-200 shadow-sm flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </Card>
        ) : balances?.map(balance => (
          <Card key={balance.speditionId} className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 truncate" title={balance.speditionName ?? ""}>
                {balance.speditionName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${(balance.balance ?? 0) < 0 ? 'text-red-600' : (balance.balance ?? 0) > 0 ? 'text-green-600' : 'text-slate-800'}`}>
                {(balance.balance ?? 0) > 0 ? "+" : ""}{balance.balance}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {balance.lastMovementDate
                  ? `Letzte Buchung: ${format(new Date(balance.lastMovementDate), "dd.MM.yyyy")}`
                  : "Keine Buchungen"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isCometUser && (
        <div className="flex flex-wrap gap-3 items-end bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Spedition</label>
            <Select value={filterSpeditionId} onValueChange={setFilterSpeditionId}>
              <SelectTrigger className="w-44 h-9 bg-white">
                <SelectValue placeholder="Alle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Alle</SelectItem>
                {speditionen?.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Von</label>
            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 w-36 bg-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Bis</label>
            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 w-36 bg-white" />
          </div>
          {(filterSpeditionId !== "__all__" || dateFrom || dateTo) && (
            <Button variant="ghost" size="sm" onClick={() => { setFilterSpeditionId("__all__"); setDateFrom(""); setDateTo(""); }}>
              Zurücksetzen
            </Button>
          )}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Buchungen</h3>
          <span className="text-sm text-slate-500">{movements?.length ?? 0} Einträge</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              {isCometUser && <TableHead>Spedition</TableHead>}
              <TableHead>Art</TableHead>
              <TableHead>Palettenschein-Nr.</TableHead>
              <TableHead>Verladung</TableHead>
              <TableHead>Bemerkung</TableHead>
              <TableHead className="text-right">Anzahl</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingMovements ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : !movements || movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center py-8 text-slate-500">
                  Keine Buchungen gefunden.
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <TableRow
                  key={movement.id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => handleRowClick(movement)}
                >
                  <TableCell className="whitespace-nowrap text-slate-600">
                    {format(new Date(movement.movementDate), "dd.MM.yyyy")}
                  </TableCell>
                  {isCometUser && (
                    <TableCell className="font-medium text-slate-900">{movement.speditionName}</TableCell>
                  )}
                  <TableCell>
                    <Badge variant="outline" className={getMovementColor(movement.movementType)}>
                      {movement.movementType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-700">
                    {(movement as any).palettenscheinnummer || (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {movement.shipmentId ? (
                      <button
                        className="flex items-center gap-1.5 text-left group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedShipmentId(movement.shipmentId!);
                          setIsShipmentDrawerOpen(true);
                        }}
                      >
                        <span className="font-mono text-xs text-slate-400 bg-slate-100 rounded px-1 py-0.5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          #{movement.shipmentId}
                        </span>
                        <span className="text-slate-600 group-hover:text-primary transition-colors truncate max-w-[120px]">
                          {movement.shipmentBezeichnung}
                        </span>
                      </button>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500 truncate max-w-[180px]" title={movement.bemerkungen || ""}>
                    {movement.bemerkungen || <span className="text-slate-300">—</span>}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${movement.movementType === "ausgang" ? 'text-red-600' : 'text-green-600'}`}>
                    {displayAmount(movement)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MovementDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <MovementDetailSheet
        movement={selectedMovement}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
      <ShipmentDrawer
        shipmentId={selectedShipmentId}
        open={isShipmentDrawerOpen}
        onOpenChange={(open) => {
          setIsShipmentDrawerOpen(open);
          if (!open) setSelectedShipmentId(null);
        }}
      />
    </div>
  );
}
