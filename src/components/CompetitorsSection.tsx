const competitors = [
  {
    name: "Harvey AI",
    cons: ["No India focus", "No B2C offering", "Enterprise-only pricing"],
    nyayaAdvantage: "India-specific RAG + consumer access",
  },
  {
    name: "LexisNexis",
    cons: ["Expensive licensing", "No execution layer", "Legacy technology"],
    nyayaAdvantage: "10x cheaper, AI-native workflows",
  },
  {
    name: "Vakilsearch",
    cons: ["Human-heavy operations", "High cost per transaction", "Not scalable"],
    nyayaAdvantage: "AI-first, automated, scalable",
  },
  {
    name: "SpotDraft",
    cons: ["Lawyer-only tool", "No consumer access", "Contract-focused only"],
    nyayaAdvantage: "Full legal lifecycle for all users",
  },
  {
    name: "CaseMine",
    cons: ["Research only", "No document generation", "No action workflows"],
    nyayaAdvantage: "Research + documents + execution",
  },
];

export default function CompetitorsSection() {
  return (
    <section id="competitors" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Why <span className="text-primary">NyayaAI</span> Wins
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            No competitor combines AI guidance, document automation, execution workflows, and a marketplace. We're the category creator.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {competitors.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20"
            >
              <h3 className="text-lg font-semibold text-foreground">{c.name}</h3>
              <div className="mt-4 space-y-2">
                {c.cons.map((con) => (
                  <div key={con} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 text-destructive">✕</span>
                    {con}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-start gap-2 text-sm font-medium text-primary">
                  <span className="mt-0.5">✓</span>
                  {c.nyayaAdvantage}
                </div>
              </div>
            </div>
          ))}

          {/* NyayaAI highlight card */}
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 animate-glow-pulse">
            <h3 className="text-lg font-semibold text-primary">NyayaAI</h3>
            <div className="mt-4 space-y-2 text-sm text-foreground">
              <div className="flex items-start gap-2"><span className="text-primary">✓</span> AI-powered legal guidance</div>
              <div className="flex items-start gap-2"><span className="text-primary">✓</span> Document automation</div>
              <div className="flex items-start gap-2"><span className="text-primary">✓</span> Execution workflows</div>
              <div className="flex items-start gap-2"><span className="text-primary">✓</span> Lawyer marketplace</div>
              <div className="flex items-start gap-2"><span className="text-primary">✓</span> India-specific RAG</div>
              <div className="flex items-start gap-2"><span className="text-primary">✓</span> Consumer + enterprise</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
