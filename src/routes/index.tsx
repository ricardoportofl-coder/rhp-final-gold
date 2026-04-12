import { createFileRoute } from "@tanstack/react-router";
import LuxuryHeader from "@/components/LuxuryHeader";
import HeroSection from "@/components/HeroSection";

import ProfissoesSection from "@/components/ProfissoesSection";
import BusinessSection from "@/components/BusinessSection";
import CorporateSection from "@/components/CorporateSection";
import EnterpriseSection from "@/components/EnterpriseSection";
import SalesQRCode from "@/components/SalesQRCode";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <LuxuryHeader />
      <HeroSection />
      
      
      <ProfissoesSection />
      <BusinessSection />
      <CorporateSection />
      <EnterpriseSection />

      {/* Footer */}
      <footer className="py-20 px-4 text-center border-t border-border/40" style={{ background: "hsl(40,30%,96%)" }}>
        <SalesQRCode />
        <div className="mt-12">
          <p className="font-display text-xl text-gradient-gold font-bold mb-2 tracking-wide">
            Gabriele's Golden Voice
          </p>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground/60">
            © 2026 Golden Voice Intelligence. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
