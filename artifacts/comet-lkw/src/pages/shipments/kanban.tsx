import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useListShipments, useUpdateShipment, getListShipmentsQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Lock, ShieldOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "@/hooks/use-toast";

const API = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api";

const KANBAN_STATUSES = ["Angemeldet", "Angekommen", "in Verladung", "Verladen"] as const;
type KanbanStatus = (typeof KANBAN_STATUSES)[number];

const STATUS_COLORS: Record<KanbanStatus, string> = {
  Angemeldet:    "bg-slate-100 border-slate-300",
  Angekommen:    "bg-blue-50 border-blue-200",
  "in Verladung": "bg-amber-50 border-amber-200",
  Verladen:      "bg-green-50 border-green-200",
};

const STATUS_HEADER_COLORS: Record<KanbanStatus, string> = {
  Angemeldet:    "bg-slate-50 border-slate-200 text-slate-700",
  Angekommen:    "bg-blue-50 border-blue-200 text-blue-700",
  "in Verladung": "bg-amber-50 border-amber-200 text-amber-700",
  Verladen:      "bg-green-50 border-green-200 text-green-700",
};

const WARE_STATUS_CYCLE: Record<string, string> = {
  "nicht bereit": "vorbereitet",
  "vorbereitet":  "ausgedruckt",
  "ausgedruckt":  "nicht bereit",
};

const WARE_STATUS_COLORS: Record<string, string> = {
  "nicht bereit": "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",
  "vorbereitet":  "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
  "ausgedruckt":  "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
};

const WARE_STATUS_LABELS: Record<string, string> = {
  "nicht bereit": "Nicht bereit",
  "vorbereitet":  "Vorbereitet",
  "ausgedruckt":  "Ausgedruckt",
};

function WareStatusBadge({
  wareStatus,
  onCycle,
  canEdit,
}: {
  wareStatus: string | null;
  onCycle: () => void;
  canEdit: boolean;
}) {
  const ws = wareStatus || "nicht bereit";
  const colorClass = WARE_STATUS_COLORS[ws] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium transition-colors ${colorClass} ${canEdit ? "cursor-pointer select-none" : "cursor-default"}`}
      title={canEdit ? "Klicken zum Wechseln" : undefined}
      onClick={(e) => {
        if (!canEdit) return;
        e.stopPropagation();
        onCycle();
      }}
    >
      {WARE_STATUS_LABELS[ws] ?? ws}
    </span>
  );
}

function SortableShipmentCard({
  shipment,
  canDrag,
  canEditWare,
  onWareStatusCycle,
}: {
  shipment: any;
  canDrag: boolean;
  canEditWare: boolean;
  onWareStatusCycle: (id: number, current: string | null) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: shipment.id,
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`shadow-sm border-slate-200 mb-2 ${canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-default"} ${isDragging ? "shadow-lg" : ""}`}
    >
      <CardContent className="p-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-slate-400">#{shipment.id}</span>
          {shipment.gesperrtFuerSpedition && (
            <Lock className="w-3 h-3 text-red-400 shrink-0" />
          )}
        </div>
        <div className="font-semibold text-slate-900 text-sm leading-tight truncate">
          {shipment.kennzeichen || <span className="text-slate-400 font-normal">Kein Kennzeichen</span>}
        </div>
        <div className="text-xs text-slate-500 truncate">
          {shipment.speditionName || "—"}
        </div>
        {shipment.relation && (
          <div className="text-xs text-slate-500 truncate">
            {shipment.relation}
          </div>
        )}
        <div className="pt-0.5">
          <WareStatusBadge
            wareStatus={shipment.wareStatus}
            canEdit={canEditWare}
            onCycle={() => onWareStatusCycle(shipment.id, shipment.wareStatus)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function DroppableColumn({
  status,
  items,
  canDrag,
  canEditWare,
  isLoading,
  onWareStatusCycle,
}: {
  status: KanbanStatus;
  items: any[];
  canDrag: boolean;
  canEditWare: boolean;
  isLoading: boolean;
  onWareStatusCycle: (id: number, current: string | null) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className={`flex flex-col flex-shrink-0 w-72 rounded-xl border-2 h-full transition-all ${STATUS_COLORS[status]} ${isOver && canDrag ? "ring-2 ring-primary ring-offset-1 scale-[1.01]" : ""}`}
    >
      <div className={`px-3 py-2.5 border-b rounded-t-xl flex items-center justify-between ${STATUS_HEADER_COLORS[status]}`}>
        <h3 className="font-semibold text-sm">{status}</h3>
        <Badge variant="secondary" className="bg-white/70 border text-xs tabular-nums">
          {isLoading ? "…" : items.length}
        </Badge>
      </div>

      <ScrollArea className="flex-1 px-2 py-2" ref={setNodeRef}>
        <SortableContext id={status} items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="min-h-[80px]">
            {items.map((shipment) => (
              <SortableShipmentCard
                key={shipment.id}
                shipment={shipment}
                canDrag={canDrag}
                canEditWare={canEditWare}
                onWareStatusCycle={onWareStatusCycle}
              />
            ))}
            {items.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-20 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                Keine Verladungen
              </div>
            )}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  );
}

export default function KanbanPage() {
  const { data: shipments, isLoading } = useListShipments();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<number | null>(null);

  const { data: permissions, isLoading: permLoading } = useQuery<Record<string, boolean>>({
    queryKey: ["auth-permissions"],
    queryFn: () =>
      fetch(`${API}/auth/permissions`, { credentials: "include" }).then((r) => r.json()),
    staleTime: 60_000,
  });

  const canDrag = permissions?.["kanban.use"] ?? false;
  const canEditWare = permissions?.["shipment.edit"] ?? false;

  const updateShipment = useUpdateShipment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey() });
      },
      onError: () => {
        toast({ title: "Fehler beim Aktualisieren", variant: "destructive" });
        queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey() });
      },
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const visibleShipments = (shipments ?? []).filter(
    (s) => KANBAN_STATUSES.includes(s.status as KanbanStatus)
  );

  const byStatus = KANBAN_STATUSES.reduce(
    (acc, status) => {
      acc[status] = visibleShipments.filter((s) => s.status === status);
      return acc;
    },
    {} as Record<KanbanStatus, any[]>
  );

  const handleDragStart = (event: any) => setActiveId(event.active.id);

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const fromStatus = visibleShipments.find((s) => s.id === active.id)?.status;

    let toStatus: string | undefined;
    if ((KANBAN_STATUSES as readonly string[]).includes(over.id)) {
      toStatus = over.id;
    } else {
      toStatus = over.data.current?.sortable?.containerId;
      if (!toStatus) {
        toStatus = visibleShipments.find((s) => s.id === over.id)?.status;
      }
    }

    if (!toStatus || toStatus === fromStatus) return;

    updateShipment.mutate({ id: active.id, data: { status: toStatus as any } });
  };

  const handleWareStatusCycle = (id: number, current: string | null) => {
    const next = WARE_STATUS_CYCLE[current ?? "nicht bereit"] ?? "nicht bereit";
    updateShipment.mutate({ id, data: { wareStatus: next as any } });
  };

  const activeShipment = activeId ? visibleShipments.find((s) => s.id === activeId) : null;

  if (isLoading || permLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canDrag && permissions && !permissions["kanban.use"]) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-3 text-slate-500">
        <ShieldOff className="w-10 h-10 text-slate-300" />
        <p className="text-sm font-medium">Keine Berechtigung für das Kanban-Board</p>
        <p className="text-xs text-slate-400">Bitte einen Administrator um die Berechtigung <strong>kanban.use</strong>.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-full overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Kanban-Board</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {canDrag ? "Per Drag & Drop zwischen den Spalten verschieben" : "Nur-Lesen — kein Drag & Drop"}
            {" · "}Ware-Status per Klick auf den Badge ändern
          </p>
        </div>
        <div className="text-xs text-slate-400 tabular-nums">
          {visibleShipments.length} aktive Verladung{visibleShipments.length !== 1 ? "en" : ""}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-2 h-full">
          {KANBAN_STATUSES.map((status) => (
            <DroppableColumn
              key={status}
              status={status}
              items={byStatus[status]}
              canDrag={canDrag}
              canEditWare={canEditWare}
              isLoading={isLoading}
              onWareStatusCycle={handleWareStatusCycle}
            />
          ))}
        </div>

        <DragOverlay>
          {activeShipment ? (
            <Card className="shadow-2xl border-primary/40 w-72 rotate-2 opacity-95">
              <CardContent className="p-3 space-y-1.5">
                <span className="text-xs font-mono text-slate-400">#{activeShipment.id}</span>
                <div className="font-semibold text-slate-900 text-sm">
                  {activeShipment.kennzeichen || "Kein Kennzeichen"}
                </div>
                <div className="text-xs text-slate-500">{activeShipment.speditionName || "—"}</div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
