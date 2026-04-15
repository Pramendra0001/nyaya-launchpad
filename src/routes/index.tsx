import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, FileText, MessageSquare, Search, ArrowRight, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Nyaya Launchpad — India's Legal Infrastructure Platform" },
      { name: "description", content: "AI-powered legal guidance, document automation, and case management. Democratizing justice for 1.4B Indians." },
    ],
  }),
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Scale className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Nyaya<span className="text-primary">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" /> AI-Powered Legal Platform
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Justice, Made <span className="text-primary">Accessible</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            AI-powered legal guidance, document automation, and case management.
            From advice to action — built for 1.4 billion Indians.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold mb-12">Everything You Need</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageSquare, title: "AI Legal Assistant", desc: "Get instant guidance on Indian laws in simple language" },
              { icon: FileText, title: "Document Generator", desc: "Generate FIRs, agreements, affidavits and legal notices" },
              { icon: Scale, title: "Case Tracker", desc: "Create and manage your legal cases with status tracking" },
              { icon: Search, title: "Knowledge Hub", desc: "Browse curated legal articles across categories" },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <f.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-3 text-center">
          {[
            { value: "63M+", label: "MSMEs Underserved" },
            { value: "33M+", label: "Pending Cases" },
            { value: "90%", label: "Avoid Legal Action" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center gap-12 flex-wrap">
            {[
              { icon: Shield, text: "Bank-grade Security" },
              { icon: Zap, text: "Instant Responses" },
              { icon: Users, text: "Built for India" },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2 text-muted-foreground">
                <t.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">NyayaAI</span>
          </div>
          <p>© 2026 NyayaAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
