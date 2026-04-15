import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import MarketSection from "@/components/MarketSection";
import CompetitorsSection from "@/components/CompetitorsSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "NyayaAI — India's Legal Infrastructure Platform" },
      { name: "description", content: "AI-powered legal guidance, document automation, and execution workflows. Democratizing justice for 1.4B Indians." },
      { property: "og:title", content: "NyayaAI — Justice, Made Accessible" },
      { property: "og:description", content: "India's first full-stack legal execution engine. From advice to action." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <MarketSection />
      <CompetitorsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
