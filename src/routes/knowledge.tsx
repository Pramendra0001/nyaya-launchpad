import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Enums"]["knowledge_category"];
type Article = Database["public"]["Tables"]["knowledge_articles"]["Row"];

export const Route = createFileRoute("/knowledge")({
  component: () => <AppLayout><KnowledgePage /></AppLayout>,
});

const CATEGORY_COLORS: Record<Category, string> = {
  criminal: "bg-red-500/10 text-red-600 border-red-500/30",
  civil: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  corporate: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [selected, setSelected] = useState<Article | null>(null);

  useEffect(() => {
    const load = async () => {
      let q = supabase.from("knowledge_articles").select("*").order("created_at", { ascending: false });
      if (category !== "all") q = q.eq("category", category);
      if (search.trim()) q = q.ilike("title", `%${search}%`);
      const { data } = await q;
      setArticles(data ?? []);
    };
    load();
  }, [search, category]);

  if (selected) {
    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={() => setSelected(null)} className="text-sm text-primary hover:underline">← Back to articles</button>
        <div className="rounded-xl border bg-card p-6">
          <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium mb-3 ${CATEGORY_COLORS[selected.category]}`}>
            {selected.category}
          </span>
          <h1 className="text-2xl font-bold mb-4">{selected.title}</h1>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{selected.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold">Knowledge Hub</h1>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {(["all", "criminal", "civil", "corporate"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${category === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-accent"}`}
            >
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
          <p>No articles found. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className="rounded-xl border bg-card p-5 text-left transition-shadow hover:shadow-md"
            >
              <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium mb-3 ${CATEGORY_COLORS[a.category]}`}>
                {a.category}
              </span>
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{a.title}</h3>
              {a.summary && <p className="text-xs text-muted-foreground line-clamp-3">{a.summary}</p>}
              <p className="text-xs text-muted-foreground mt-3">{new Date(a.created_at).toLocaleDateString()}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
