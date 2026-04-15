const features = [
  {
    icon: "🧠",
    title: "AI Intelligence Layer",
    description:
      "LLM + RAG trained on Indian statutes, case law, and regulatory filings. Every output includes legal citations.",
  },
  {
    icon: "⚡",
    title: "Execution Engine",
    description:
      "Goes beyond advice — automated complaint filing, legal notices, and compliance checklists that drive real outcomes.",
  },
  {
    icon: "📄",
    title: "Document Automation",
    description:
      "Auto-generate NDAs, agreements, RTI applications, and legal notices with jurisdiction-aware templates.",
  },
  {
    icon: "🤝",
    title: "Lawyer Marketplace",
    description:
      "Connect with verified advocates. Commission-based matching ensures quality and accessibility for every case.",
  },
  {
    icon: "🏢",
    title: "SME Compliance SaaS",
    description:
      "Continuous compliance monitoring for 63M+ MSMEs — labor law, GST, environmental, and regulatory tracking.",
  },
  {
    icon: "🔒",
    title: "Trust & Transparency",
    description:
      "AI positioned as assistant, not advisor. Citation-backed outputs with lawyer validation for critical decisions.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Full-Stack Legal <span className="text-primary">Infrastructure</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Three layers working together — intelligence, execution, and marketplace — to transform how India accesses justice.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--glow-gold)]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
