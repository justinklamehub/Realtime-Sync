import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Loader2, Search, Truck, AlertTriangle, CheckCircle2 } from "lucide-react";

const API = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api";

const S = {
  page: {
    minHeight: "100dvh",
    background: "#0d1b2a",
    color: "#e2e8f0",
    fontFamily: "system-ui, -apple-system, sans-serif",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "24px 16px",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: 32,
    marginTop: 16,
  },
  logo: {
    fontSize: 13,
    letterSpacing: "0.15em",
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#f8fafc",
    letterSpacing: "0.02em",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    background: "#162032",
    border: "1px solid #1e3a5f",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 8,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "0.1em",
    background: "#0d1b2a",
    border: "2px solid #b4ff00",
    borderRadius: 8,
    color: "#f8fafc",
    outline: "none",
    textTransform: "uppercase" as const,
    boxSizing: "border-box" as const,
  },
  btnGreen: {
    width: "100%",
    padding: "16px",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "0.1em",
    background: "#b4ff00",
    color: "#0d1b2a",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  btnGray: {
    width: "100%",
    padding: "14px",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.08em",
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid #2d4a6b",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 8,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #1e3a5f",
    fontSize: 14,
  },
  infoLabel: { color: "#94a3b8" },
  infoValue: { color: "#f8fafc", fontWeight: 600 },
  statusBadge: (found: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: found ? "rgba(180,255,0,0.12)" : "rgba(239,68,68,0.12)",
    color: found ? "#b4ff00" : "#f87171",
    border: `1px solid ${found ? "#b4ff00" : "#f87171"}`,
    marginBottom: 16,
  }),
};

type ShipmentInfo = {
  id: number;
  kennzeichen: string;
  bezeichnung: string | null;
  status: string;
} | null;

export default function ScannerLandingPage() {
  const [kennzeichen, setKennzeichen] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [shipment, setShipment] = useState<ShipmentInfo>(null);
  const [spedition, setSpedition] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const kz = kennzeichen.trim().toUpperCase();
    if (!kz) return;
    setIsSearching(true);
    setSearched(false);
    try {
      const res = await fetch(`${API}/scanner/find-shipment?kennzeichen=${encodeURIComponent(kz)}`);
      const data = await res.json();
      setShipment(data.found ? data.shipment : null);
      setSpedition(data.spedition ?? null);
      setSearched(true);
    } catch {
      setShipment(null);
      setSearched(true);
    } finally {
      setIsSearching(false);
    }
  }

  function goToChecklist(kz: string, ship: ShipmentInfo, sped: string | null) {
    const params = new URLSearchParams({ kennzeichen: kz });
    if (ship) {
      params.set("shipmentId", String(ship.id));
      params.set("bezeichnung", ship.bezeichnung ?? "");
    }
    if (sped) params.set("spedition", sped);
    setLocation(`/scanner/gefahrgut?${params.toString()}`);
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.logo}>COMET LKW • Scanner</div>
        <div style={S.title}>Gefahrgut-Checkliste</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>FB LOG – 016</div>
      </div>

      <div style={S.card}>
        <form onSubmit={handleSearch}>
          <label style={S.label}>LKW Kennzeichen</label>
          <input
            ref={inputRef}
            style={S.input}
            value={kennzeichen}
            onChange={(e) => {
              setKennzeichen(e.target.value.toUpperCase());
              setSearched(false);
              setShipment(null);
            }}
            placeholder="z.B. MH-AB 1234"
            autoFocus
            autoCapitalize="characters"
            spellCheck={false}
          />
          <button type="submit" style={S.btnGreen} disabled={isSearching || !kennzeichen.trim()}>
            {isSearching ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Search size={18} />}
            {isSearching ? "SUCHE..." : "VERLADUNG SUCHEN"}
          </button>
        </form>
      </div>

      {searched && (
        <div style={S.card}>
          {shipment ? (
            <>
              <div style={S.statusBadge(true)}>
                <CheckCircle2 size={13} />
                Verladung gefunden
              </div>
              <div style={S.infoRow}>
                <span style={S.infoLabel}>Kennzeichen</span>
                <span style={S.infoValue}>{shipment.kennzeichen}</span>
              </div>
              {shipment.bezeichnung && (
                <div style={S.infoRow}>
                  <span style={S.infoLabel}>Bezeichnung</span>
                  <span style={S.infoValue}>{shipment.bezeichnung}</span>
                </div>
              )}
              {spedition && (
                <div style={S.infoRow}>
                  <span style={S.infoLabel}>Spedition</span>
                  <span style={S.infoValue}>{spedition}</span>
                </div>
              )}
              <div style={{ ...S.infoRow, borderBottom: "none" }}>
                <span style={S.infoLabel}>Status</span>
                <span style={S.infoValue}>{shipment.status}</span>
              </div>
              <button
                style={S.btnGreen}
                onClick={() => goToChecklist(kennzeichen.trim().toUpperCase(), shipment, spedition)}
              >
                <Truck size={18} />
                CHECKLISTE AUSFÜLLEN
              </button>
            </>
          ) : (
            <>
              <div style={S.statusBadge(false)}>
                <AlertTriangle size={13} />
                Keine Verladung gefunden
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 16px 0" }}>
                Für das Kennzeichen <strong style={{ color: "#f8fafc" }}>{kennzeichen.trim().toUpperCase()}</strong> ist keine
                aktive Verladung registriert. Sie können die Checkliste trotzdem ausfüllen.
              </p>
              <button
                style={S.btnGreen}
                onClick={() => goToChecklist(kennzeichen.trim().toUpperCase(), null, null)}
              >
                <Truck size={18} />
                CHECKLISTE TROTZDEM AUSFÜLLEN
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
