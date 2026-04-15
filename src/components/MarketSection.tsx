export default function MarketSection() {
  return (
    <section id="market" className="border-y border-border bg-card/50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Massive <span className="text-primary">Untapped</span> Market
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            India's legal market is globally validated but locally underbuilt. NyayaAI is positioned to capture this gap.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* India market */}
          <div className="rounded-2xl border border-border bg-background p-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇮🇳</span>
              <h3 className="text-xl font-bold text-foreground">India Opportunity</h3>
            </div>
            <div className="mt-6 space-y-5">
              <MarketStat value="₹8,500 Cr" to="₹20,000+ Cr" label="Market size by 2030" />
              <MarketStat value="63M" to="" label="MSMEs — core monetization base" />
              <MarketStat value="33M+" to="" label="Pending court cases" />
              <MarketStat value="90%" to="" label="Indians avoid legal action due to cost" />
            </div>
          </div>

          {/* Global */}
          <div className="rounded-2xl border border-border bg-background p-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <h3 className="text-xl font-bold text-foreground">Global Validation</h3>
            </div>
            <div className="mt-6 space-y-5">
              <MarketStat value="~$10B" to="" label="Legal AI market by 2030" />
              <MarketStat value="70-80%" to="" label="SaaS margins achievable" />
              <MarketStat value="<₹10" to="" label="Cost per AI-generated document" />
              <MarketStat value="₹5K+" to="" label="SaaS revenue per B2B client/month" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketStat({ value, to, label }: { value: string; to: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-2xl font-bold text-primary">{value}</span>
      {to && <span className="text-lg text-muted-foreground">→ {to}</span>}
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
