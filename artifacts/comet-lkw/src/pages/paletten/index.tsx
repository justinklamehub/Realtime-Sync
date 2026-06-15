import { useState } from "react";
import { useListPalletBalances, useListPalletMovements } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2, Plus, Download } from "lucide-react";
import { MovementDialog } from "./components/movement-dialog";

export default function PalettenPage() {
  const { data: balances, isLoading: loadingBalances } = useListPalletBalances();
  const { data: movements, isLoading: loadingMovements } = useListPalletMovements();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getMovementColor = (type: string) => {
    switch (type) {
      case "eingang": return "bg-green-100 text-green-800 hover:bg-green-200 border-transparent";
      case "ausgang": return "bg-red-100 text-red-800 hover:bg-red-200 border-transparent";
      case "korrektur": return "bg-orange-100 text-orange-800 hover:bg-orange-200 border-transparent";
      case "abstimmung": return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent";
      default: return "bg-slate-100 text-slate-800 border-transparent";
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Palettenkonto</h1>
          <p className="text-sm text-slate-500">Übersicht der Euro-Paletten Salden und Buchungen.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            CSV Export
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Neue Buchung
          </Button>
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
              <CardTitle className="text-sm font-medium text-slate-500 truncate" title={balance.speditionName}>
                {balance.speditionName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${balance.balance < 0 ? 'text-red-600' : balance.balance > 0 ? 'text-green-600' : 'text-slate-800'}`}>
                {balance.balance > 0 ? "+" : ""}{balance.balance}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {balance.lastMovementDate ? `Letzte Bewegung: ${format(new Date(balance.lastMovementDate), "dd.MM.yyyy")}` : "Keine Bewegungen"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Letzte Buchungen</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Spedition</TableHead>
              <TableHead>Art</TableHead>
              <TableHead>Referenz</TableHead>
              <TableHead>Bemerkung</TableHead>
              <TableHead className="text-right">Anzahl</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingMovements ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : !movements || movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Keine Buchungen gefunden.
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="whitespace-nowrap text-slate-600">
                    {format(new Date(movement.movementDate), "dd.MM.yyyy")}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{movement.speditionName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getMovementColor(movement.movementType)}>
                      {movement.movementType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {movement.shipmentBezeichnung || "-"}
                  </TableCell>
                  <TableCell className="text-slate-500 truncate max-w-[200px]" title={movement.bemerkungen || ""}>
                    {movement.bemerkungen || "-"}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${movement.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {movement.amount > 0 ? "+" : ""}{movement.amount}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MovementDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
