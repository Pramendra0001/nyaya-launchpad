export default function CTASection() {
  return (
    <section id="cta" className="py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-5xl">
          Ready to Transform <span className="text-primary">Legal Access</span>?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Join the movement to democratize justice in India. Be among the first 500 users
          to experience AI-powered legal execution.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:hello@nyayaai.in"
            className="rounded-xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-[var(--glow-gold)]"
          >
            Get Early Access
          </a>
          <a
            href="mailto:invest@nyayaai.in"
            className="rounded-xl border border-primary/30 bg-primary/10 px-10 py-4 text-base font-semibold text-primary transition-all hover:bg-primary/20"
          >
            Investor Deck →
          </a>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Seed round: ₹5,00,000 · Capital-efficient MVP · 70-80% margins
        </p>
      </div>
    </section>
  );
}
