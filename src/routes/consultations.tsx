import { createFileRoute, Link } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CalendarIcon, MessageSquare, X, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/consultations")({
  component: ConsultationsPage,
});

type Consultation = {
  id: string;
  lawyer_id: string;
  consultation_date: string;
  time_slot: string;
  status: string;
  notes: string | null;
  created_at: string;
  lawyers?: { name: string; specialization: string };
};

function ConsultationsPage() {
  return (
    <AppLayout>
      <ConsultationsContent />
    </AppLayout>
  );
}

function ConsultationsContent() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");

  const fetchConsultations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("consultations")
      .select("*, lawyers(name, specialization)")
      .eq("user_id", user.id)
      .order("consultation_date", { ascending: false });
    setConsultations((data as any[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchConsultations(); }, [user]);

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.from("consultations").update({ status: "cancelled" }).eq("id", id);
    if (error) toast.error("Failed to cancel");
    else { toast.success("Booking cancelled"); fetchConsultations(); }
  };

  const openChat = async (consultationId: string) => {
    setChatOpen(consultationId);
    const { data } = await supabase
      .from("consultation_messages")
      .select("*")
      .eq("consultation_id", consultationId)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);

    // Subscribe to realtime
    const channel = supabase
      .channel(`consultation-${consultationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "consultation_messages", filter: `consultation_id=eq.${consultationId}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const sendMessage = async () => {
    if (!user || !chatOpen || !newMsg.trim()) return;
    await supabase.from("consultation_messages").insert({
      consultation_id: chatOpen,
      sender_id: user.id,
      content: newMsg.trim(),
    });
    setNewMsg("");
  };

  const upcoming = consultations.filter((c) => c.status === "pending" || c.status === "confirmed");
  const past = consultations.filter((c) => c.status === "completed" || c.status === "cancelled");

  const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    confirmed: "default",
    completed: "secondary",
    cancelled: "destructive",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Consultations</h1>
          <p className="text-muted-foreground mt-1">Manage your lawyer consultations</p>
        </div>
        <Link to="/lawyers"><Button className="gap-2"><CalendarIcon className="h-4 w-4" /> Book New</Button></Link>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {loading ? (
            <div className="animate-pulse h-24 rounded-xl border bg-card" />
          ) : upcoming.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No upcoming consultations. <Link to="/lawyers" className="text-primary">Find a lawyer</Link></p>
          ) : upcoming.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold">{c.lawyers?.name ?? "Unknown"}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{c.lawyers?.specialization} Law · {c.consultation_date} · {c.time_slot}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusColor[c.status]}>{c.status}</Badge>
                  {(c.status === "confirmed") && (
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => openChat(c.id)}>
                      <MessageSquare className="h-3.5 w-3.5" /> Chat
                    </Button>
                  )}
                  {(c.status === "pending" || c.status === "confirmed") && (
                    <Button size="sm" variant="destructive" className="gap-1" onClick={() => cancelBooking(c.id)}>
                      <X className="h-3.5 w-3.5" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="past" className="space-y-3 mt-4">
          {past.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No past consultations.</p>
          ) : past.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold">{c.lawyers?.name ?? "Unknown"}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{c.lawyers?.specialization} Law · {c.consultation_date} · {c.time_slot}</p>
                </div>
                <Badge variant={statusColor[c.status]}>{c.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Chat Dialog */}
      <Dialog open={!!chatOpen} onOpenChange={(o) => { if (!o) setChatOpen(null); }}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Consultation Chat</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-2 py-4 min-h-[200px] max-h-[400px]">
            {messages.length === 0 && <p className="text-center text-sm text-muted-foreground">No messages yet. Start the conversation!</p>}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[75%] text-sm ${m.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type a message…" onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
            <Button size="icon" onClick={sendMessage}><Send className="h-4 w-4" /></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
