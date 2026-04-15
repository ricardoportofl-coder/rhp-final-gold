import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/HeroSection";
import PersonalLevelSection from "@/components/PersonalLevelSection";
import GlobalReachSection from "@/components/GlobalReachSection";

import ProfissoesSection from "@/components/ProfissoesSection";
import BusinessSection from "@/components/BusinessSection";
import CorporateSection from "@/components/CorporateSection";
import EnterpriseSection from "@/components/EnterpriseSection";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-black">
      <HeroSection />
      <GlobalReachSection />
      <PersonalLevelSection />

      <ProfissoesSection />
      <BusinessSection />
      <CorporateSection />
      <EnterpriseSection />
    </main>
  );
}
