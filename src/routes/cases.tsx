import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/integrations/supabase/types";

type CaseStatus = Database["public"]["Enums"]["case_status"];
type Case = Database["public"]["Tables"]["cases"]["Row"];

export const Route = createFileRoute("/cases")({
  component: () => <AppLayout><CasesPage /></AppLayout>,
});

const STATUS_COLORS: Record<CaseStatus, string> = {
  pending: "bg-warning/10 text-warning-foreground border-warning/30",
  active: "bg-primary/10 text-primary border-primary/30",
  closed: "bg-muted text-muted-foreground border-border",
};

function CasesPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", status: "pending" as CaseStatus });

  const load = async () => {
    if (!user) return;
    let q = supabase.from("cases").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setCases(data ?? []);
  };

  useEffect(() => { load(); }, [user, filter]);

  const save = async () => {
    if (!user || !form.title.trim()) return;
    if (editingId) {
      await supabase.from("cases").update({ title: form.title, description: form.description, status: form.status }).eq("id", editingId);
    } else {
      await supabase.from("cases").insert({ user_id: user.id, title: form.title, description: form.description, status: form.status });
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", description: "", status: "pending" });
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("cases").delete().eq("id", id);
    load();
  };

  const edit = (c: Case) => {
    setForm({ title: c.title, description: c.description ?? "", status: c.status });
    setEditingId(c.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Case Tracker</h1>
        <Button size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: "", description: "", status: "pending" }); }} className="gap-1">
          <Plus className="h-4 w-4" /> New Case
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "active", "closed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-accent"}`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editingId ? "Edit Case" : "New Case"}</h2>
            <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Case title" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe the case" />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CaseStatus }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <Button onClick={save} className="w-full">{editingId ? "Update" : "Create"} Case</Button>
          </div>
        </div>
      )}

      {/* List */}
      {cases.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No cases yet. Create your first case to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{c.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${STATUS_COLORS[c.status]}`}>
                    {c.status}
                  </span>
                </div>
                {c.description && <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>}
                <p className="text-xs text-muted-foreground mt-2">{new Date(c.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => edit(c)} className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(c.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
