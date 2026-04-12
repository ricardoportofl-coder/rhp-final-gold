import AskGabrieleBlock from "@/components/AskGabrieleBlock";

import medicalImg from "@/assets/medical-card.jpg";
import dentalImg from "@/assets/dental-card.jpg";
import beautyImg from "@/assets/beauty-card.jpg";

const businesses = [
  {
    title: "Luxury Medical Clinic",
    image: medicalImg,
    benefits: [
      "Seamless Patient Chart Sync",
      "Instant Lab Result Alerts",
      "Zero No-Show Strategy",
    ],
  },
  {
    title: "Dental Office & Reception",
    image: dentalImg,
    benefits: [
      "Instant WhatsApp Patient Connection",
      "Automated Treatment Estimates",
      "Frictionless Insurance Claims",
    ],
  },
  {
    title: "High-End Beauty Salon",
    image: beautyImg,
    benefits: [
      "Smart Stylist Scheduling",
      "Premium Inventory Intelligence",
      "VIP Loyalty Campaigns",
    ],
  },
];

export default function BusinessSection() {
  return (
    <section
      className="py-24 px-4 md:px-8"
      style={{ background: "linear-gradient(180deg, #F5F5DC 0%, #F0E6D2 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 anim-fade-up">
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "hsl(38,55%,48%)" }}>
            Tier Two
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4" style={{ fontWeight: 600 }}>
            <span className="text-gradient-gold">Business</span> Solutions
          </h2>
          <p className="font-body text-muted-foreground text-base max-w-2xl mx-auto" style={{ fontWeight: 300 }}>
            Designed for clinics, salons & premium service businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businesses.map((item, i) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-3xl anim-fade-up-d${Math.min(i + 1, 5)}`}
              style={{
                border: "1px solid rgba(200,170,90,0.3)",
                boxShadow: "0 8px 32px -8px rgba(40,28,18,0.15)",
                background: "rgba(240,230,210,0.85)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="relative h-52 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" width={640} height={512} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(240,230,210,0.95) 0%, rgba(240,230,210,0.3) 50%, transparent 100%)" }} />
                <div className="absolute bottom-4 left-5">
                  <h3 className="font-display text-2xl text-gradient-gold" style={{ fontWeight: 700 }}>{item.title}</h3>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-2.5">
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
          "...automate medical appointment confirmations",
          "...send WhatsApp reminders to prevent no-shows",
          "...optimize the doctor's daily schedule",
          "...follow up with patients post-consultation",
          "...manage clinic staff shifts",
          "...generate treatment plan estimates instantly",
          "...process insurance claims automatically",
          "...track premium product inventory levels",
          "...send loyalty discount offers to VIP clients",
          "...coordinate stylist schedules for weekends",
          "...alert staff about schedule conflicts",
          "...sync patient records across locations",
        ]} />
      </div>
    </section>
  );
}
