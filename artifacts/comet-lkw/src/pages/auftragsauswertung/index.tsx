import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import {
  Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2,
  ClipboardList, Eye, EyeOff, User
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") + "/api";

interface LeitgebietRow { leitgebiet: string; auftraege: number; paletten: number; }
interface LieferterminRow { lfdat: string; auftraege: number; paletten: number; }

interface SpedResult {
  spediteurNr: string;
  csvName: string;
  speditionId: number | null;
  speditionDbName: string | null;
  matched: boolean;
  auftraege: number;
  paletten: number;
  freigegeben: boolean;
  leitgebiete: LeitgebietRow[];
  liefertermine: LieferterminRow[];
}

interface AnalyseResult {
  uploadedAt?: string;
  filename?: string | null;
  uploadedByUsername?: string | null;
  totalRows: number;
  totalPaletten: number;
  totalAuftraege: number;
  results: SpedResult[];
}

function formatLfdat(s: string): string {
  const m = s.match(/^(\d+)\.(\d{4})$/);
  if (m) return `KW\u00a0${m[1]}\u00a0/\u00a0${m[2]}`;
  // Also handle dd.mm.yyyy
  const d = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (d) return `${d[1]}.${d[2]}.${d[3]}`;
  return s;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("de-DE", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

const SPED_ROLES = ["speditions_admin", "speditions_bearbeiter", "speditions_viewer"];

function SubTable({ rows }: { rows: { label: string; auftraege: number; paletten: number }[] }) {
  if (rows.length === 0) return <span className="text-slate-300 text-xs">—</span>;
  return (
    <table className="text-xs w-full border-collapse">
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="align-baseline">
            <td className="pr-3 py-px text-slate-700 whitespace-nowrap">{r.label}</td>
            <td className="py-px text-right tabular-nums text-slate-500 whitespace-nowrap">
              {r.auftraege}&nbsp;A&nbsp;/&nbsp;{r.paletten}&nbsp;P
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AuftragsauswertungPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [result, setResult] = useState<AnalyseResult | null>(null);
  const [togglingNr, setTogglingNr] = useState<string | null>(null);

  const isSpedUser = SPED_ROLES.includes(user?.role ?? "");
  const mySpeditionId = user?.speditionId ?? null;

  useEffect(() => {
    let cancelled = false;
    setIsLoadingLatest(true);
    fetch(`${API_BASE}/auftragsauswertung/latest`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setResult(data ?? null); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoadingLatest(false); });
    return () => { cancelled = true; };
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({ title: "Bitte eine CSV-Datei auswählen", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const text = await file.text();
      const r = await fetch(`${API_BASE}/auftragsauswertung/upload`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: text, filename: file.name }),
      });
      const data = await r.json();
      if (!r.ok) {
        toast({ title: data.error ?? "Fehler bei der Auswertung", variant: "destructive" });
      } else {
        setResult({ ...data, uploadedByUsername: user?.username ?? null });
        toast({
          title: `${data.results.length} Speditionen ausgewertet`,
          description: `${data.totalRows} Zeilen verarbeitet`,
        });
      }
    } catch {
      toast({ title: "Netzwerkfehler", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [toast, user?.username]);

  const toggleFreigabe = useCallback(async (spediteurNr: string, freigegeben: boolean) => {
    setTogglingNr(spediteurNr);
    try {
      const r = await fetch(`${API_BASE}/auftragsauswertung/freigaben`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spediteurNr, freigegeben }),
      });
      if (!r.ok) {
        const d = await r.json();
        toast({ title: d.error ?? "Fehler beim Freigeben", variant: "destructive" });
        return;
      }
      setResult((prev) => prev ? {
        ...prev,
        results: prev.results.map((e) =>
          e.spediteurNr === spediteurNr ? { ...e, freigegeben } : e
        ),
      } : prev);
    } catch {
      toast({ title: "Netzwerkfehler", variant: "destructive" });
    } finally {
      setTogglingNr(null);
    }
  }, [toast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const triggerUpload = () => fileRef.current?.click();

  if (isLoadingLatest) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Auftragsauswertung</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {isSpedUser ? "Freigegebene Auswertung" : "SAP-Export (CSV) je Spedition"}
            </p>
          </div>
        </div>
        {!isSpedUser && (
          <Button variant="outline" size="sm" onClick={triggerUpload} disabled={isUploading} className="gap-2">
            {isUploading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Upload className="h-4 w-4" />
            }
            {result ? "Neue CSV hochladen" : "CSV hochladen"}
          </Button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
      />

      {/* Empty states */}
      {!result && !isUploading && !isSpedUser && (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-14 text-center transition-all cursor-pointer select-none",
            isDragging
              ? "border-blue-400 bg-blue-50 scale-[1.01]"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
          )}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={triggerUpload}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-slate-100">
              <Upload className="h-7 w-7 text-slate-400" />
            </div>
            <div>
              <p className="font-medium text-slate-600">CSV-Datei hier ablegen</p>
              <p className="text-sm text-slate-400 mt-1">oder klicken zum Auswählen · SAP-Export, semikolongetrennt</p>
            </div>
          </div>
        </div>
      )}

      {!result && isUploading && (
        <div className="border border-blue-100 bg-blue-50 rounded-xl p-14 text-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <p className="text-sm font-medium text-blue-600">Wird ausgewertet…</p>
          </div>
        </div>
      )}

      {!result && isSpedUser && (
        <div className="border border-slate-200 rounded-xl p-14 text-center">
          <FileSpreadsheet className="h-9 w-9 mx-auto mb-3 text-slate-200" />
          <p className="text-sm text-slate-400">Noch keine Auswertung verfügbar</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div
          className={cn("space-y-4", !isSpedUser && isUploading && "opacity-40 pointer-events-none transition-opacity")}
          onDrop={!isSpedUser ? onDrop : undefined}
          onDragOver={!isSpedUser ? (e) => { e.preventDefault(); setIsDragging(true); } : undefined}
          onDragLeave={!isSpedUser ? () => setIsDragging(false) : undefined}
        >
          {/* Summary cards — admin only */}
          {!isSpedUser && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Speditionen", value: result.results.length },
                { label: "Aufträge gesamt", value: result.totalAuftraege.toLocaleString("de-DE") },
                { label: "Paletten (HU) gesamt", value: result.totalPaletten.toLocaleString("de-DE") },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-slate-200 rounded-lg px-5 py-4">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-2xl font-bold text-slate-800 tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Main table card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Table meta bar */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3 flex-wrap">
              <FileSpreadsheet className="h-4 w-4 text-slate-400 shrink-0" />
              {result.filename && (
                <span className="text-sm font-medium text-slate-700">{result.filename}</span>
              )}
              {!isSpedUser && result.totalRows > 0 && (
                <span className="text-xs text-slate-400 bg-slate-200 rounded px-2 py-0.5 font-mono">
                  {result.totalRows.toLocaleString("de-DE")} Zeilen
                </span>
              )}
              <div className="ml-auto flex items-center gap-4 text-xs text-slate-400">
                {result.uploadedByUsername && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {result.uploadedByUsername}
                  </span>
                )}
                {result.uploadedAt && (
                  <span>{formatDate(result.uploadedAt)}</span>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Spedition
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      Aufträge
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      Paletten
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Pro Leitgebiet
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      Pro Liefertermin
                    </th>
                    {!isSpedUser && (
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                        Freigabe
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.results.map((s) => {
                    const isOwn = s.speditionId === mySpeditionId;
                    const leitgebietRows = s.leitgebiete.map((lg) => ({
                      label: lg.leitgebiet,
                      auftraege: lg.auftraege ?? 0,
                      paletten: lg.paletten,
                    }));
                    const lieferterminRows = s.liefertermine.map((lt) => {
                      const lfdat   = typeof lt === "string" ? lt : (lt as LieferterminRow).lfdat;
                      const auftr   = typeof lt === "string" ? 0  : (lt as LieferterminRow).auftraege;
                      const paletts = typeof lt === "string" ? 0  : (lt as LieferterminRow).paletten;
                      return { label: formatLfdat(lfdat), auftraege: auftr, paletten: paletts };
                    });
                    return (
                      <tr
                        key={s.spediteurNr}
                        className={cn(
                          "align-top hover:bg-slate-50/70 transition-colors",
                          isSpedUser && isOwn && "bg-blue-50/30"
                        )}
                      >
                        {/* Spedition name */}
                        <td className="px-5 py-4 min-w-[200px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800">
                              {s.speditionDbName ?? s.csvName}
                            </span>
                            {!isSpedUser && (
                              s.matched
                                ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" title="In Stammdaten gefunden" />
                                : <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" title="Nicht zugeordnet" />
                            )}
                            {isSpedUser && isOwn && (
                              <span className="text-[11px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full leading-none">
                                Ihre Spedition
                              </span>
                            )}
                          </div>
                          {!isSpedUser && s.matched && s.csvName && s.speditionDbName !== s.csvName && (
                            <div className="text-xs text-slate-400 mt-1 pl-0">{s.csvName}</div>
                          )}
                          {!isSpedUser && !s.matched && (
                            <div className="text-xs text-amber-500 mt-1">Keine Zuordnung</div>
                          )}
                        </td>

                        {/* Aufträge */}
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 font-bold text-sm tabular-nums min-w-[2.5rem] h-9 px-2">
                            {s.auftraege}
                          </span>
                        </td>

                        {/* Paletten */}
                        <td className="px-4 py-4 text-center">
                          <span className="font-bold text-slate-700 tabular-nums text-base">
                            {s.paletten.toLocaleString("de-DE")}
                          </span>
                        </td>

                        {/* Pro Leitgebiet */}
                        <td className="px-5 py-4 min-w-[220px]">
                          <SubTable rows={leitgebietRows} />
                        </td>

                        {/* Pro Liefertermin */}
                        <td className="px-5 py-4 min-w-[220px]">
                          <SubTable rows={lieferterminRows} />
                        </td>

                        {/* Freigabe toggle — admin only */}
                        {!isSpedUser && (
                          <td className="px-4 py-4 text-center">
                            {togglingNr === s.spediteurNr ? (
                              <Loader2 className="h-4 w-4 animate-spin text-slate-300 mx-auto" />
                            ) : (
                              <div className="flex flex-col items-center gap-1.5">
                                <Switch
                                  checked={s.freigegeben}
                                  onCheckedChange={(v) => toggleFreigabe(s.spediteurNr, v)}
                                  disabled={togglingNr !== null}
                                />
                                {s.freigegeben
                                  ? <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600"><Eye className="h-3 w-3" />freigegeben</span>
                                  : <span className="flex items-center gap-1 text-[10px] text-slate-400"><EyeOff className="h-3 w-3" />gesperrt</span>
                                }
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warning: unmatched speditionen */}
          {!isSpedUser && result.results.some((r) => !r.matched) && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
              <span>
                Einige Speditionen konnten nicht zugeordnet werden. Bitte die{" "}
                <strong>Speditionsnummer (SAP)</strong> in den Stammdaten hinterlegen.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Drag overlay */}
      {!isSpedUser && isDragging && (
        <div className="fixed inset-0 bg-blue-600/10 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl px-10 py-8 shadow-2xl border-2 border-blue-300 flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Upload className="h-10 w-10 text-blue-500" />
            </div>
            <p className="text-lg font-semibold text-slate-700">CSV ablegen zum Ersetzen</p>
          </div>
        </div>
      )}
    </div>
  );
}
