import AskGabrieleBlock from "@/components/AskGabrieleBlock";

import supermarketImg from "@/assets/corporate-supermarket.jpg";
import pharmacyImg from "@/assets/corporate-pharmacy.jpg";
import retailImg from "@/assets/corporate-retail.jpg";

const corporates = [
  {
    title: "Premium Supermarket",
    image: supermarketImg,
    benefits: [
      "Real-Time Inventory Intelligence",
      "Quarterly Performance Insights",
      "Dynamic Staff Optimization",
    ],
  },
  {
    title: "Tech-Forward Pharmacy",
    image: pharmacyImg,
    benefits: [
      "Controlled Substance Compliance",
      "Prescription vs. OTC Analytics",
      "Multi-Shift Coverage Planner",
    ],
  },
  {
    title: "Retail Operations Hub",
    image: retailImg,
    bridge: "Empowering your customers to find exactly what they need, instantly.",
    benefits: [
      "Self-Guided Customer Experience",
      "Revenue vs. Forecast Tracker",
      "Logistics Team Coordination",
    ],
  },
];

export default function CorporateSection() {
  return (
    <section
      className="py-24 px-4 md:px-8"
      style={{ background: "linear-gradient(180deg, #F0E6D2 0%, #F5F5DC 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 anim-fade-up">
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "hsl(38,55%,48%)" }}>
            Tier Three
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4" style={{ fontWeight: 600 }}>
            <span className="text-gradient-gold">Corporate</span> AI Integration
          </h2>
          <p className="font-body text-muted-foreground text-base max-w-2xl mx-auto" style={{ fontWeight: 300 }}>
            Built for large-scale retail chains, pharmacies & high-volume operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {corporates.map((item, i) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-3xl anim-fade-up-d${Math.min(i + 1, 5)}`}
              style={{
                border: "1px solid rgba(200,170,90,0.3)",
                boxShadow: "0 8px 32px -8px rgba(40,28,18,0.25)",
                background: "rgba(240,230,210,0.85)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="relative h-52 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" width={1024} height={768} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(240,230,210,0.95) 0%, rgba(240,230,210,0.3) 50%, transparent 100%)" }} />
                <div className="absolute bottom-4 left-5">
                  <h3 className="font-display text-2xl text-gradient-gold" style={{ fontWeight: 700 }}>{item.title}</h3>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-2.5">
                {item.bridge && (
                  <p className="font-body text-xs text-center py-1.5 px-3 rounded-lg mb-1" style={{ color: "#8B7355", fontWeight: 400, background: "rgba(212,176,104,0.12)", border: "1px solid rgba(212,176,104,0.2)" }}>
                    ✦ {item.bridge}
                  </p>
                )}
                {item.benefits.map((b, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-3 py-2 px-3 rounded-xl"
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
          ))}
        </div>

        <AskGabrieleBlock commands={[
          "...sync inventory across all store aisles",
          "...guide customers to products via QR code",
          "...analyze peak hour foot traffic",
          "...generate regional sales performance reports",
          "...alert managers about low stock levels",
          "...optimize staff allocation for rush hours",
          "...compare revenue against quarterly forecasts",
          "...track controlled substance compliance",
          "...coordinate logistics for new shipments",
          "...monitor prescription vs. OTC sales trends",
          "...schedule multi-shift pharmacy coverage",
          "...automate reorder alerts for top sellers",
        ]} />
      </div>
    </section>
  );
}
