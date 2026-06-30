import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api";

export default function ResetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const { data: pubSettings } = useQuery<Record<string, string>>({
    queryKey: ["settings-public"],
    queryFn: async () => {
      const res = await fetch(`${API}/settings/public`);
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const appName = pubSettings?.app_name || "Easy-Verladung";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Fehler beim Zurücksetzen.");
      } else {
        setDone(true);
        setTimeout(() => setLocation("/login"), 3000);
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1 text-center pb-6 border-b border-slate-100">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl tracking-tighter">
              CO
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            {appName}
          </CardTitle>
          <CardDescription className="text-slate-500">Neues Passwort festlegen</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!token ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <XCircle className="w-12 h-12 text-red-400" />
              <p className="text-sm text-slate-600">Kein gültiger Reset-Link. Bitte fordern Sie einen neuen an.</p>
              <Link href="/forgot-password">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Neuen Link anfordern
                </Button>
              </Link>
            </div>
          ) : done ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 mb-1">Passwort erfolgreich geändert</p>
                <p className="text-sm text-slate-500">Sie werden in Kürze zur Anmeldung weitergeleitet…</p>
              </div>
              <Link href="/login">
                <Button variant="outline" className="mt-2 gap-2">
                  <ArrowLeft className="w-4 h-4" /> Jetzt anmelden
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Neues Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mindestens 6 Zeichen"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Passwort bestätigen</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Passwort wiederholen"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full mt-2" disabled={loading || !password || !confirm}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Passwort speichern
              </Button>
              <div className="text-center">
                <Link href="/login">
                  <button type="button" className="text-sm text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Zurück zur Anmeldung
                  </button>
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
