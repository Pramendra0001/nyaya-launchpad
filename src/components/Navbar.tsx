import logo from "@/assets/nyaya-logo.png";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="NyayaAI" width={36} height={36} />
          <span className="text-xl font-bold text-foreground">
            Nyaya<span className="text-primary">AI</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#market" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Market</a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          <a href="#competitors" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Why Us</a>
        </div>
        <a
          href="#cta"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          Get Early Access
        </a>
      </div>
    </nav>
  );
}
