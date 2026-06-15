import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Pencil, X, Check, Phone, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BEREICH_OPTIONS = ["Allgemein", "Paletten", "Verladungen", "Buchhaltung", "Disposition", "Notfall"];

const BEREICH_COLOR: Record<string, string> = {
  Allgemein:    "bg-slate-100 text-slate-600 border-slate-200",
  Paletten:     "bg-blue-50 text-blue-700 border-blue-200",
  Verladungen:  "bg-green-50 text-green-700 border-green-200",
  Buchhaltung:  "bg-purple-50 text-purple-700 border-purple-200",
  Disposition:  "bg-orange-50 text-orange-700 border-orange-200",
  Notfall:      "bg-red-50 text-red-700 border-red-200",
};

interface Contact {
  id: number;
  speditionId: number;
  name: string;
  bereich?: string | null;
  telefon?: string | null;
  email?: string | null;
  bemerkungen?: string | null;
  createdAt: string;
}

interface Props {
  speditionId: number;
  readonly?: boolean;
}

const emptyForm = () => ({ name: "", bereich: "Allgemein", telefon: "", email: "", bemerkungen: "" });

export function ContactsTab({ speditionId, readonly = false }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const qKey = ["spedition-contacts", speditionId];

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: qKey,
    queryFn: () => customFetch(`/api/speditionen/${speditionId}/contacts`),
    enabled: !!speditionId,
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm());

  const createMutation = useMutation({
    mutationFn: (data: typeof form) =>
      customFetch(`/api/speditionen/${speditionId}/contacts`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qKey });
      toast({ title: "Ansprechpartner hinzugefügt" });
      setShowForm(false);
      setForm(emptyForm());
    },
    onError: (e: any) => toast({ title: e?.message ?? "Fehler", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof editForm }) =>
      customFetch(`/api/speditionen/${speditionId}/contacts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qKey });
      toast({ title: "Gespeichert" });
      setEditingId(null);
    },
    onError: (e: any) => toast({ title: e?.message ?? "Fehler", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      customFetch(`/api/speditionen/${speditionId}/contacts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qKey });
      toast({ title: "Ansprechpartner gelöscht" });
    },
    onError: () => toast({ title: "Fehler beim Löschen", variant: "destructive" }),
  });

  const startEdit = (c: Contact) => {
    setEditingId(c.id);
    setEditForm({
      name: c.name,
      bereich: c.bereich ?? "Allgemein",
      telefon: c.telefon ?? "",
      email: c.email ?? "",
      bemerkungen: c.bemerkungen ?? "",
    });
  };

  if (isLoading) return (
    <div className="flex justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-3">
      {contacts.length === 0 && !showForm && (
        <p className="text-sm text-slate-400 text-center py-4">Noch keine Ansprechpartner hinterlegt.</p>
      )}

      {contacts.map(c => (
        <div key={c.id} className="border border-slate-200 rounded-lg bg-white overflow-hidden">
          {editingId === c.id ? (
            <div className="p-3 space-y-2 bg-blue-50/40">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Name *</Label>
                  <Input className="h-8 text-sm" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Bereich</Label>
                  <Select value={editForm.bereich} onValueChange={v => setEditForm(f => ({ ...f, bereich: v }))}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{BEREICH_OPTIONS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Telefon</Label>
                  <Input className="h-8 text-sm" value={editForm.telefon} onChange={e => setEditForm(f => ({ ...f, telefon: e.target.value }))} />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">E-Mail</Label>
                  <Input type="email" className="h-8 text-sm" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Bemerkung</Label>
                  <Input className="h-8 text-sm" value={editForm.bemerkungen} onChange={e => setEditForm(f => ({ ...f, bemerkungen: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}><X className="w-3.5 h-3.5 mr-1" />Abbrechen</Button>
                <Button size="sm" onClick={() => updateMutation.mutate({ id: c.id, data: editForm })} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                  Speichern
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-900 text-sm">{c.name}</span>
                  {c.bereich && (
                    <Badge variant="outline" className={`text-xs px-1.5 py-0 ${BEREICH_COLOR[c.bereich] ?? BEREICH_COLOR.Allgemein}`}>
                      {c.bereich}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                  {c.telefon && (
                    <a href={`tel:${c.telefon}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors">
                      <Phone className="w-3 h-3" />{c.telefon}
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors">
                      <Mail className="w-3 h-3" />{c.email}
                    </a>
                  )}
                </div>
                {c.bemerkungen && <p className="text-xs text-slate-400 mt-0.5">{c.bemerkungen}</p>}
              </div>
              {!readonly && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-700" onClick={() => startEdit(c)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteMutation.mutate(c.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {!readonly && (
        showForm ? (
          <div className="border border-blue-200 rounded-lg p-3 bg-blue-50/30 space-y-2">
            <div className="text-xs font-semibold text-slate-700 mb-1">Neuer Ansprechpartner</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Name *</Label>
                <Input className="h-8 text-sm" placeholder="Vor- und Nachname" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Bereich</Label>
                <Select value={form.bereich} onValueChange={v => setForm(f => ({ ...f, bereich: v }))}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{BEREICH_OPTIONS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Telefon</Label>
                <Input className="h-8 text-sm" placeholder="+49 ..." value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-xs">E-Mail</Label>
                <Input type="email" className="h-8 text-sm" placeholder="name@firma.de" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Bemerkung</Label>
                <Input className="h-8 text-sm" placeholder="Optional" value={form.bemerkungen} onChange={e => setForm(f => ({ ...f, bemerkungen: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setForm(emptyForm()); }}>
                <X className="w-3.5 h-3.5 mr-1" />Abbrechen
              </Button>
              <Button size="sm" onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.name.trim()}>
                {createMutation.isPending ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                Hinzufügen
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="w-full" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />Ansprechpartner hinzufügen
          </Button>
        )
      )}
    </div>
  );
}
