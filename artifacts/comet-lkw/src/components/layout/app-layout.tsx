import { ReactNode } from "react";
import { AppSidebar } from "./sidebar";
import { ConnectionBanner } from "./connection-banner";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <ConnectionBanner />
        <main className="flex-1 overflow-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
