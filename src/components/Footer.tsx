import logo from "@/assets/nyaya-logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-navy-deep py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="NyayaAI" width={28} height={28} />
          <span className="font-bold text-foreground">
            Nyaya<span className="text-primary">AI</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2025 NyayaAI · India's Legal Infrastructure Platform
        </p>
      </div>
    </footer>
  );
}
