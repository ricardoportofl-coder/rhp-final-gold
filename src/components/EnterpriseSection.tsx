import AskGabrieleBlock from "@/components/AskGabrieleBlock";
import VIPContactBlock from "@/components/VIPContactBlock";
import enterpriseImg from "@/assets/enterprise-hq.jpg";

const benefits = [
  "Global Dashboard Consolidation",
  "Cross-Regional Supply Chain Analysis",
  "Shareholder-Ready KPI Reports",
  "Multi-Location Staff Synchronization",
];

export default function EnterpriseSection() {
  return (
    <section
      className="py-24 px-4 md:px-8"
      style={{ background: "linear-gradient(180deg, #F5F5DC 0%, #EADBC8 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 anim-fade-up">
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "hsl(38,55%,48%)" }}>
            Tier Four · The Command Center
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4" style={{ fontWeight: 600 }}>
            <span className="text-gradient-gold">Enterprise</span> AI Infrastructure
          </h2>
          <p className="font-body text-muted-foreground text-base max-w-2xl mx-auto" style={{ fontWeight: 300 }}>
            The AI brain connecting every store to headquarters & global stakeholders
          </p>
        </div>

        <div
          className="group relative overflow-hidden rounded-3xl anim-fade-up-d1"
          style={{
            border: "1px solid rgba(200,170,90,0.4)",
            boxShadow: "0 12px 48px -8px rgba(40,28,18,0.3)",
            background: "rgba(240,230,210,0.9)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img src={enterpriseImg} alt="Enterprise Command Center" className="w-full h-full object-cover" loading="lazy" width={1280} height={768} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(240,230,210,0.95) 0%, rgba(240,230,210,0.4) 50%, transparent 100%)" }} />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-display text-3xl md:text-4xl text-gradient-gold" style={{ fontWeight: 700 }}>Global Intelligence Hub</h3>
              <p className="font-body text-sm mt-1" style={{ color: "#5C4033", fontWeight: 300 }}>Connecting branches · shareholders · supply chains</p>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map((b, j) => (
              <div
                key={j}
                className="flex items-start gap-3 py-2.5 px-4 rounded-xl"
                style={{
                  background: "rgba(180,150,80,0.1)",
                  border: "1px solid rgba(180,150,80,0.18)",
                }}
              >
                <span style={{ color: "#D4B068", fontSize: "10px", marginTop: "5px" }}>●</span>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#5C4033", fontWeight: 500 }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </div>

        <AskGabrieleBlock commands={[
          "...consolidate worldwide data for shareholders",
          "...monitor compliance across 15,000 locations",
          "...prepare executive summaries for the board",
          "...track global supply chain logistics",
          "...synchronize staffing rosters across all branches",
          "...generate quarterly revenue projections",
          "...flag cross-regional inventory bottlenecks",
          "...coordinate global product launches",
          "...audit multi-country regulatory compliance",
          "...forecast demand trends across all markets",
          "...optimize distribution center workflows",
          "...benchmark performance across divisions",
        ]} />

        <VIPContactBlock />
      </div>
    </section>
  );
}
