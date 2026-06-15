import { ReactNode, useState, useEffect } from "react";
import { AppSidebar } from "./sidebar";
import { ConnectionBanner } from "./connection-banner";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const STORAGE_KEY = "sidebar-collapsed";

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(collapsed)); } catch { /* */ }
  }, [collapsed]);

  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
      <AppSidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <ConnectionBanner />
        {/* Top header bar */}
        <div className="h-12 shrink-0 flex items-center px-4 border-b border-slate-200 bg-white">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={collapsed ? "Menü ausklappen" : "Menü einklappen"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>
        <main className="flex-1 overflow-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
