import { createFileRoute, Link } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MessageSquare, FileText, Briefcase, ArrowRight, Users, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ cases: 0, documents: 0, conversations: 0, consultations: 0 });
  const [upcomingConsultations, setUpcomingConsultations] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("cases").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("documents").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("chat_conversations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("consultations").select("id", { count: "exact", head: true }).eq("user_id", user.id).in("status", ["pending", "confirmed"]),
    ]).then(([c, d, ch, con]) => {
      setStats({ cases: c.count ?? 0, documents: d.count ?? 0, conversations: ch.count ?? 0, consultations: con.count ?? 0 });
    });

    supabase
      .from("consultations")
      .select("*, lawyers(name, specialization)")
      .eq("user_id", user.id)
      .in("status", ["pending", "confirmed"])
      .order("consultation_date", { ascending: true })
      .limit(3)
      .then(({ data }) => setUpcomingConsultations(data ?? []));
  }, [user]);

  const quickActions = [
    { to: "/assistant", icon: MessageSquare, title: "Ask AI", desc: "Get legal guidance instantly", color: "text-chart-1" },
    { to: "/documents", icon: FileText, title: "Generate Document", desc: "Create legal documents", color: "text-success" },
    { to: "/cases", icon: Briefcase, title: "Track Case", desc: "Manage your cases", color: "text-warning" },
    { to: "/lawyers", icon: Users, title: "Consult Lawyer", desc: "Book a consultation", color: "text-chart-4" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ""} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your legal workspace overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Cases", value: stats.cases, icon: Briefcase },
          { label: "Documents", value: stats.documents, icon: FileText },
          { label: "AI Conversations", value: stats.conversations, icon: MessageSquare },
          { label: "Consultations", value: stats.consultations, icon: CalendarIcon },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{s.value}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to} className="group rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <a.icon className={`h-8 w-8 ${a.color} mb-3`} />
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {upcomingConsultations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Consultations</h2>
            <Link to="/consultations" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {upcomingConsultations.map((c) => (
              <div key={c.id} className="rounded-xl border bg-card p-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold">{c.lawyers?.name ?? "Unknown"}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{c.lawyers?.specialization} Law · {c.consultation_date} · {c.time_slot}</p>
                </div>
                <Badge variant={c.status === "confirmed" ? "default" : "outline"}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
