import { useSocket } from "@/hooks/use-socket";
import { AlertCircle } from "lucide-react";

export function ConnectionBanner() {
  const { isConnected } = useSocket();

  if (isConnected) return null;

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2">
      <AlertCircle className="w-4 h-4" />
      Verbindung zum Server verloren. Reconnect läuft...
    </div>
  );
}
