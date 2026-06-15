import { useState } from "react";
import { useListSpeditionen } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit } from "lucide-react";
import { SpeditionDialog } from "./components/spedition-dialog";

export default function SpeditionenPage() {
  const { data: speditionen, isLoading } = useListSpeditionen();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Speditionen</h1>
          <p className="text-sm text-slate-500">Verwalten Sie Partner-Speditionen und deren Berechtigungen.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Neue Spedition
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kürzel</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : !speditionen || speditionen.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Keine Speditionen gefunden.
                </TableCell>
              </TableRow>
            ) : (
              speditionen.map((spedition) => (
                <TableRow key={spedition.id}>
                  <TableCell className="font-medium text-slate-900">{spedition.name}</TableCell>
                  <TableCell>{spedition.kuerzel}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-slate-700">{spedition.ansprechpartner || "-"}</div>
                      <div className="text-slate-500 text-xs">{spedition.email || "-"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={spedition.status === "aktiv" ? "default" : "secondary"} className={spedition.status === "aktiv" ? "bg-green-100 text-green-800 hover:bg-green-100 border-none" : ""}>
                      {spedition.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4 text-slate-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <SpeditionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
