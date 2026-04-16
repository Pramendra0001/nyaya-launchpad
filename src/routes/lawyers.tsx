import { createFileRoute, Link } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Briefcase, Clock } from "lucide-react";

export const Route = createFileRoute("/lawyers")({
  component: LawyersPage,
  head: () => ({
    meta: [
      { title: "Consult a Lawyer — NyayaAI" },
      { name: "description", content: "Find and book verified lawyers across specializations." },
    ],
  }),
});

type Lawyer = {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  rating: number;
  bio: string | null;
  consultation_fee: number | null;
  is_available: boolean;
  profile_photo_url: string | null;
};

function LawyersPage() {
  return (
    <AppLayout>
      <LawyersContent />
    </AppLayout>
  );
}

function LawyersContent() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("all");

  useEffect(() => {
    supabase.from("lawyers").select("*").order("rating", { ascending: false }).then(({ data }) => {
      setLawyers((data as Lawyer[]) ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = lawyers.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || (l.bio?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchSpec = specFilter === "all" || l.specialization === specFilter;
    return matchSearch && matchSpec;
  });

  const specs = ["all", "criminal", "civil", "corporate", "family", "property", "labour", "tax", "constitutional"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Consult a Lawyer</h1>
        <p className="text-muted-foreground mt-1">Find verified lawyers and book consultations</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search lawyers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={specFilter} onValueChange={setSpecFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            {specs.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s === "all" ? "All Specializations" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl border bg-card animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No lawyers found matching your criteria.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <Link
              key={l.id}
              to="/lawyers/$id"
              params={{ id: l.id }}
              className="group rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {l.name.charAt(0)}
                </div>
                <Badge variant={l.is_available ? "default" : "secondary"} className="text-xs">
                  {l.is_available ? "Available" : "Offline"}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg">{l.name}</h3>
              <p className="text-sm text-primary capitalize mt-1">{l.specialization} Law</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {l.experience_years}y exp</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-warning" /> {l.rating}</span>
              </div>
              {l.consultation_fee && (
                <p className="mt-2 text-sm font-medium">₹{l.consultation_fee}/session</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
