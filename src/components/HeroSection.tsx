import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-glow-pulse" />
          <span className="text-sm font-medium text-primary">India's First Legal Execution Engine</span>
        </div>

        <h1 className="animate-fade-in-up text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl" style={{ animationDelay: "0.1s" }}>
          Justice, Made{" "}
          <span className="text-primary">Accessible</span>
        </h1>

        <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl" style={{ animationDelay: "0.25s" }}>
          AI-powered legal guidance, automated document generation, and end-to-end
          case execution — all in one platform. From advice to action.
        </p>

        <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.4s" }}>
          <a
            href="#cta"
            className="rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-[var(--glow-gold)]"
          >
            Start Free Trial
          </a>
          <a
            href="#features"
            className="rounded-xl border border-border bg-secondary px-8 py-4 text-base font-semibold text-secondary-foreground transition-colors hover:bg-muted"
          >
            See How It Works
          </a>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-in-up mt-20 grid grid-cols-2 gap-6 md:grid-cols-4" style={{ animationDelay: "0.55s" }}>
          {[
            { value: "33M+", label: "Pending Cases" },
            { value: "90%", label: "Avoid Legal Action" },
            { value: "63M+", label: "MSMEs Underserved" },
            { value: "<₹10", label: "Cost Per Document" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
