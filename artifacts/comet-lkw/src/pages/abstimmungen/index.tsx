import { useListReconciliations } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, Plus, ChevronRight } from "lucide-react";

export default function AbstimmungenPage() {
  const { data: reconciliations, isLoading } = useListReconciliations();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "offen": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">Offen</Badge>;
      case "in_pruefung": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">In Prüfung</Badge>;
      case "bestaetigt": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Bestätigt</Badge>;
      case "abweichung": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Abweichung</Badge>;
      case "abgeschlossen": return <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-200 border-none">Abgeschlossen</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Abstimmungen</h1>
          <p className="text-sm text-slate-500">Regelmäßige Palettenkonto-Abgleiche mit Partnern.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Neue Abstimmung
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Spedition</TableHead>
              <TableHead>Zeitraum</TableHead>
              <TableHead className="text-right">COMET Saldo</TableHead>
              <TableHead className="text-right">Spedition Saldo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : !reconciliations || reconciliations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Keine Abstimmungen gefunden.
                </TableCell>
              </TableRow>
            ) : (
              reconciliations.map((rec) => (
                <TableRow key={rec.id} className="cursor-pointer hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{rec.speditionName}</TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {format(new Date(rec.dateFrom), "dd.MM.yy")} - {format(new Date(rec.dateTo), "dd.MM.yy")}
                  </TableCell>
                  <TableCell className="text-right font-medium">{rec.cometBalance ?? "-"}</TableCell>
                  <TableCell className="text-right font-medium">{rec.speditionBalance ?? "-"}</TableCell>
                  <TableCell>{getStatusBadge(rec.status)}</TableCell>
                  <TableCell className="text-right">
                    <ChevronRight className="w-4 h-4 text-slate-400 inline-block" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
