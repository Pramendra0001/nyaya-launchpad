import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { FileText, Plus, Download, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";
import type { Database } from "@/integrations/supabase/types";

type DocType = Database["public"]["Enums"]["document_type"];

export const Route = createFileRoute("/documents")({
  component: () => <AppLayout><DocumentsPage /></AppLayout>,
});

const DOC_TYPES: { value: DocType; label: string; fields: { name: string; label: string; type: "text" | "textarea" }[] }[] = [
  {
    value: "fir_draft", label: "FIR Draft",
    fields: [
      { name: "complainant_name", label: "Complainant Name", type: "text" },
      { name: "incident_date", label: "Date of Incident", type: "text" },
      { name: "incident_location", label: "Location", type: "text" },
      { name: "incident_details", label: "Details of Incident", type: "textarea" },
    ],
  },
  {
    value: "rental_agreement", label: "Rental Agreement",
    fields: [
      { name: "landlord_name", label: "Landlord Name", type: "text" },
      { name: "tenant_name", label: "Tenant Name", type: "text" },
      { name: "property_address", label: "Property Address", type: "textarea" },
      { name: "monthly_rent", label: "Monthly Rent (₹)", type: "text" },
      { name: "duration_months", label: "Duration (months)", type: "text" },
    ],
  },
  {
    value: "affidavit", label: "Affidavit",
    fields: [
      { name: "deponent_name", label: "Deponent Name", type: "text" },
      { name: "father_name", label: "Father's Name", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "statement", label: "Statement / Declaration", type: "textarea" },
    ],
  },
  {
    value: "legal_notice", label: "Legal Notice",
    fields: [
      { name: "sender_name", label: "Sender Name", type: "text" },
      { name: "recipient_name", label: "Recipient Name", type: "text" },
      { name: "subject", label: "Subject", type: "text" },
      { name: "notice_details", label: "Details", type: "textarea" },
    ],
  },
];

function DocumentsPage() {
  const { user, session } = useAuth();
  const [view, setView] = useState<"list" | "create">("list");
  const [selectedType, setSelectedType] = useState<DocType | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);

  const loadDocs = async () => {
    if (!user) return;
    const { data } = await supabase.from("documents").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setDocs(data ?? []);
  };

  useEffect(() => { loadDocs(); }, [user]);

  const docConfig = DOC_TYPES.find((d) => d.value === selectedType);

  const generate = async () => {
    if (!selectedType || !docConfig || !session) return;
    setGenerating(true);
    setGeneratedContent("");
    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const prompt = `Generate a professional Indian legal ${docConfig.label} document based on: ${JSON.stringify(formData)}. Format it properly with all legal language. Include date, proper headings, and signature lines.`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      if (!resp.ok || !resp.body) throw new Error("Generation failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let content = "";
      let done = false;
      while (!done) {
        const { done: rd, value } = await reader.read();
        if (rd) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const c = JSON.parse(json).choices?.[0]?.delta?.content;
            if (c) { content += c; setGeneratedContent(content); }
          } catch {}
        }
      }

      if (user && content) {
        await supabase.from("documents").insert({
          user_id: user.id,
          type: selectedType,
          title: `${docConfig.label} - ${new Date().toLocaleDateString()}`,
          content,
          form_data: formData,
        });
        loadDocs();
      }
    } catch (e: any) {
      setGeneratedContent(`Error: ${e.message}`);
    }
    setGenerating(false);
  };

  const downloadPDF = (title: string, content: string) => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(content.replace(/[#*`]/g, ""), 170);
    doc.setFontSize(12);
    let y = 20;
    for (const line of lines) {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(line, 20, y);
      y += 7;
    }
    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  if (view === "create" && selectedType && docConfig) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setView("list"); setSelectedType(null); setGeneratedContent(""); setFormData({}); }}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{docConfig.label}</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl border bg-card p-5">
            <h2 className="font-semibold">Fill Details</h2>
            {docConfig.fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea value={formData[f.name] ?? ""} onChange={(e) => setFormData((p) => ({ ...p, [f.name]: e.target.value }))} rows={3} />
                ) : (
                  <Input value={formData[f.name] ?? ""} onChange={(e) => setFormData((p) => ({ ...p, [f.name]: e.target.value }))} />
                )}
              </div>
            ))}
            <Button onClick={generate} disabled={generating} className="w-full gap-2">
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</> : "Generate Document"}
            </Button>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Preview</h2>
              {generatedContent && !generating && (
                <Button variant="outline" size="sm" onClick={() => downloadPDF(docConfig.label, generatedContent)} className="gap-1">
                  <Download className="h-4 w-4" /> PDF
                </Button>
              )}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none max-h-[60vh] overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
              {generatedContent || "Your document will appear here after generation."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Documents</h1>
      </div>

      {/* Create new */}
      <div>
        <h2 className="font-semibold mb-3">Generate New Document</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DOC_TYPES.map((d) => (
            <button
              key={d.value}
              onClick={() => { setSelectedType(d.value); setView("create"); setFormData({}); setGeneratedContent(""); }}
              className="rounded-xl border bg-card p-4 text-left transition-shadow hover:shadow-md"
            >
              <FileText className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">{d.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{d.fields.length} fields</p>
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      {docs.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Recent Documents</h2>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {doc.content && (
                  <Button variant="ghost" size="sm" onClick={() => downloadPDF(doc.title, doc.content)} className="gap-1">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
