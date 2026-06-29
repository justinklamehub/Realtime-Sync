import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, MapPin, Navigation, Calculator, Trophy, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api";

interface Spedition {
  id: number;
  name: string;
  kuerzel: string;
  status: string;
  preisProKm?: number | null;
  mindestpreisProFahrt?: number | null;
  palettenAufschlag?: number | null;
  kraftstoffzuschlagProzent?: number | null;
  fixkostenProFahrt?: number | null;
  mautProKm?: number | null;
}

interface KalkulationResult {
  spedition: Spedition;
  transportKosten: number;
  kraftstoffzuschlag: number;
  palettenKosten: number;
  fixkosten: number;
  mautKosten: number;
  gesamt: number;
  hasPreis: boolean;
}

async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
  const resp = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
    { headers: { "Accept-Language": "de,en", "User-Agent": "COMET-LKW-Verladung/1.0" } }
  );
  if (!resp.ok) return null;
  const data = await resp.json();
  if (!data || data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

async function getRouteDistanceKm(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number }
): Promise<number | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const data = await resp.json();
  if (data.code !== "Ok" || !data.routes?.[0]) return null;
  return Math.round(data.routes[0].distance / 1000);
}

function berechne(sped: Spedition, km: number, paletten: number): KalkulationResult {
  const preis = sped.preisProKm ?? 0;
  const mindest = sped.mindestpreisProFahrt ?? 0;
  const transportKosten = Math.max(km * preis, mindest);
  const kraftstoffzuschlag = transportKosten * ((sped.kraftstoffzuschlagProzent ?? 0) / 100);
  const palettenKosten = paletten * (sped.palettenAufschlag ?? 0);
  const fixkosten = sped.fixkostenProFahrt ?? 0;
  const mautKosten = km * (sped.mautProKm ?? 0);
  const gesamt = transportKosten + kraftstoffzuschlag + palettenKosten + fixkosten + mautKosten;
  const hasPreis = (sped.preisProKm ?? 0) > 0;
  return { spedition: sped, transportKosten, kraftstoffzuschlag, palettenKosten, fixkosten, mautKosten, gesamt, hasPreis };
}

function fmt(val: number) {
  return val.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function NumInput({ label, value, onChange, unit, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "0"}
          className="pr-10"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function KalkulationPage() {
  const { toast } = useToast();

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["settings"],
    queryFn: () => fetch(`${API}/settings`, { credentials: "include" }).then(r => r.json()),
  });

  const { data: speditionen } = useQuery<Spedition[]>({
    queryKey: ["speditionen"],
    queryFn: () => fetch(`${API}/speditionen`, { credentials: "include" }).then(r => r.json()),
  });

  const startortDefault = settings?.["kalkulation_startort"] ?? "";

  const [startort, setStartort] = useState("");
  const [zielort, setZielort] = useState("");
  const [kmStr, setKmStr] = useState("");
  const [paletten, setPaletten] = useState("1");
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<KalkulationResult[] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ start: string; ziel: string; km: number } | null>(null);

  const effectiveStartort = startort || startortDefault;
  const km = parseFloat(kmStr) || 0;
  const palettenZahl = parseInt(paletten) || 0;

  const handleRouteBerechnen = async () => {
    if (!effectiveStartort.trim()) {
      toast({ title: "Startort fehlt", description: "Bitte Startort eingeben oder in den Einstellungen hinterlegen.", variant: "destructive" });
      return;
    }
    if (!zielort.trim()) {
      toast({ title: "Zielort fehlt", description: "Bitte Zielort eingeben.", variant: "destructive" });
      return;
    }
    setIsCalculating(true);
    try {
      const [fromCoord, toCoord] = await Promise.all([
        geocode(effectiveStartort),
        geocode(zielort),
      ]);
      if (!fromCoord) {
        toast({ title: "Startort nicht gefunden", description: `"${effectiveStartort}" konnte nicht geocodiert werden.`, variant: "destructive" });
        return;
      }
      if (!toCoord) {
        toast({ title: "Zielort nicht gefunden", description: `"${zielort}" konnte nicht geocodiert werden.`, variant: "destructive" });
        return;
      }
      const distKm = await getRouteDistanceKm(fromCoord, toCoord);
      if (distKm == null) {
        toast({ title: "Route nicht berechenbar", description: "Die Route konnte nicht berechnet werden. Bitte Kilometer manuell eingeben.", variant: "destructive" });
        return;
      }
      setKmStr(String(distKm));
      setRouteInfo({ start: effectiveStartort, ziel: zielort, km: distKm });
      toast({ title: `Route: ${distKm} km`, description: `Von "${effectiveStartort}" nach "${zielort}"` });
    } catch {
      toast({ title: "Fehler bei der Routenberechnung", description: "Bitte Kilometer manuell eingeben.", variant: "destructive" });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleBerechnen = () => {
    if (km <= 0) {
      toast({ title: "Kilometer fehlen", description: "Bitte Route berechnen oder Kilometer manuell eingeben.", variant: "destructive" });
      return;
    }
    const aktive = (speditionen ?? []).filter(s => s.status === "aktiv");
    if (aktive.length === 0) {
      toast({ title: "Keine aktiven Speditionen", variant: "destructive" });
      return;
    }
    const res = aktive.map(s => berechne(s, km, palettenZahl));
    res.sort((a, b) => {
      if (!a.hasPreis && b.hasPreis) return 1;
      if (a.hasPreis && !b.hasPreis) return -1;
      return a.gesamt - b.gesamt;
    });
    setResults(res);
  };

  const withPreis = results?.filter(r => r.hasPreis) ?? [];
  const withoutPreis = results?.filter(r => !r.hasPreis) ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Spediteur-Kostenvergleich
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Berechnen Sie die Transportkosten aller Speditionen für eine Route und vergleichen Sie sie direkt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">Route</CardTitle>
              </div>
              <CardDescription className="text-xs">Start und Ziel eingeben</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-sm">Startort</Label>
                <Input
                  value={startort}
                  onChange={e => setStartort(e.target.value)}
                  placeholder={startortDefault || "z.B. Hamburg"}
                />
                {startortDefault && !startort && (
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Aus Einstellungen: {startortDefault}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Zielort</Label>
                <Input
                  value={zielort}
                  onChange={e => setZielort(e.target.value)}
                  placeholder="z.B. München"
                  onKeyDown={e => { if (e.key === "Enter") handleRouteBerechnen(); }}
                />
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleRouteBerechnen}
                disabled={isCalculating}
              >
                {isCalculating
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Berechne Route…</>
                  : <><MapPin className="w-4 h-4 mr-2" /> Route berechnen</>
                }
              </Button>
              {routeInfo && (
                <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded p-2">
                  <p className="font-medium text-slate-700 dark:text-slate-300">{routeInfo.km} km Fahrstrecke</p>
                  <p>{routeInfo.start} → {routeInfo.ziel}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">Parameter</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <NumInput
                label="Kilometer (km)"
                value={kmStr}
                onChange={setKmStr}
                unit="km"
                placeholder="automatisch oder manuell"
              />
              <NumInput
                label="Anzahl Paletten"
                value={paletten}
                onChange={setPaletten}
                unit="Stk."
                placeholder="1"
              />
              <Separator />
              <Button className="w-full" onClick={handleBerechnen}>
                <Calculator className="w-4 h-4 mr-2" />
                Kosten vergleichen
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {results === null ? (
            <Card className="shadow-sm h-full flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center text-slate-400 py-16">
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Noch keine Berechnung</p>
                <p className="text-xs mt-1">Route und Parameter eingeben, dann „Kosten vergleichen" klicken.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {withPreis.length > 0 && (
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Vergleich — {km} km, {palettenZahl} Palette{palettenZahl !== 1 ? "n" : ""}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-slate-50 dark:bg-slate-800 text-xs text-slate-500">
                            <th className="text-left px-4 py-2 font-medium">Rang</th>
                            <th className="text-left px-4 py-2 font-medium">Spedition</th>
                            <th className="text-right px-4 py-2 font-medium">Transport</th>
                            <th className="text-right px-4 py-2 font-medium">KST-ZS</th>
                            <th className="text-right px-4 py-2 font-medium">Paletten</th>
                            <th className="text-right px-4 py-2 font-medium">Fix</th>
                            <th className="text-right px-4 py-2 font-medium">Maut</th>
                            <th className="text-right px-4 py-2 font-medium font-bold">Gesamt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {withPreis.map((r, i) => {
                            const isBest = i === 0;
                            const isWorst = i === withPreis.length - 1 && withPreis.length > 1;
                            return (
                              <tr
                                key={r.spedition.id}
                                className={`border-b last:border-0 transition-colors ${
                                  isBest
                                    ? "bg-emerald-50 dark:bg-emerald-950/30"
                                    : isWorst
                                    ? "bg-red-50/50 dark:bg-red-950/20"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                }`}
                              >
                                <td className="px-4 py-3">
                                  {isBest ? (
                                    <Badge className="bg-emerald-500 text-white text-xs">🥇 1.</Badge>
                                  ) : (
                                    <span className="text-slate-400 font-medium">{i + 1}.</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-medium text-slate-900 dark:text-white">{r.spedition.name}</div>
                                  <div className="text-xs text-slate-400">
                                    {(r.spedition.preisProKm ?? 0).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €/km
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums">{fmt(r.transportKosten)}</td>
                                <td className="px-4 py-3 text-right tabular-nums text-slate-500">
                                  {r.kraftstoffzuschlag > 0 ? fmt(r.kraftstoffzuschlag) : "—"}
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums text-slate-500">
                                  {r.palettenKosten > 0 ? fmt(r.palettenKosten) : "—"}
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums text-slate-500">
                                  {r.fixkosten > 0 ? fmt(r.fixkosten) : "—"}
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums text-slate-500">
                                  {r.mautKosten > 0 ? fmt(r.mautKosten) : "—"}
                                </td>
                                <td className={`px-4 py-3 text-right tabular-nums font-bold ${isBest ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                                  {fmt(r.gesamt)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {withPreis.length >= 2 && (
                <Card className="shadow-sm bg-slate-50 dark:bg-slate-800/50 border-dashed">
                  <CardContent className="py-3 px-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {withPreis[0].spedition.name}
                      </span>
                      {" "}ist um{" "}
                      <span className="font-semibold">
                        {fmt(withPreis[withPreis.length - 1].gesamt - withPreis[0].gesamt)}
                      </span>
                      {" "}günstiger als{" "}
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {withPreis[withPreis.length - 1].spedition.name}
                      </span>.
                    </p>
                  </CardContent>
                </Card>
              )}

              {withoutPreis.length > 0 && (
                <Card className="shadow-sm border-amber-200">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Ohne Preiskonfiguration</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Folgende Speditionen haben keine Tarife hinterlegt:{" "}
                          {withoutPreis.map(r => r.spedition.name).join(", ")}.
                          Bitte Tarife unter Speditionen → Tarife ergänzen.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
