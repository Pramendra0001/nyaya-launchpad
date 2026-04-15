const plans = [
  {
    name: "Citizen",
    price: "Free",
    period: "",
    description: "Basic legal guidance for individuals",
    features: ["AI legal guidance", "2 documents/month", "Legal rights info", "Community support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹499",
    period: "/month",
    description: "For individuals who need regular legal help",
    features: [
      "Unlimited AI guidance",
      "20 documents/month",
      "Complaint filing automation",
      "Lawyer marketplace access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: "₹5,000",
    period: "/month",
    description: "Compliance & legal ops for MSMEs",
    features: [
      "Everything in Professional",
      "Unlimited documents",
      "Compliance monitoring",
      "Team access (5 users)",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border bg-card/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Simple, <span className="text-primary">Transparent</span> Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free. Scale as you grow. 70-80% margins make this sustainable.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 transition-all ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-[var(--glow-gold)]"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-flex rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-0.5 text-primary">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
