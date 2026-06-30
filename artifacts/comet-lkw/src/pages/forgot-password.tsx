import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
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
    setLoading(true);
    try {
      await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      setSent(true);
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
          <CardDescription className="text-slate-500">Passwort zurücksetzen</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <MailCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 mb-1">E-Mail gesendet</p>
                <p className="text-sm text-slate-500">
                  Falls ein Konto mit dieser E-Mail oder diesem Benutzernamen existiert, wurde ein Reset-Link gesendet.
                  Bitte prüfen Sie Ihren Posteingang (und Spam-Ordner).
                </p>
              </div>
              <Link href="/login">
                <Button variant="outline" className="mt-2 gap-2">
                  <ArrowLeft className="w-4 h-4" /> Zurück zur Anmeldung
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-500 mb-2">
                Geben Sie Ihre E-Mail-Adresse oder Ihren Benutzernamen ein. Sie erhalten einen Link zum Zurücksetzen Ihres Passworts.
              </p>
              <div className="space-y-2">
                <Label htmlFor="identifier">E-Mail oder Benutzername</Label>
                <Input
                  id="identifier"
                  placeholder="name@spedition.de"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  autoFocus
                  className="bg-white"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full mt-2" disabled={loading || !identifier.trim()}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset-Link senden
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
