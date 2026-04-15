import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Headphones, Radio, Video, BookOpen, Music, Megaphone } from "lucide-react";
import retailStore from "@/assets/retail-store.jpg";

const slides = [
  {
    title: "Retail & Commerce",
    subtitle: "Smart solutions for retail",
    description: "Smart solutions for retail stores, shops and commercial businesses.",
    icon: Radio,
    image: retailStore,
  },
  {
    title: "Audiobooks Premium",
    subtitle: "Stories that come alive",
    description: "Each chapter becomes an immersive experience with authentic emotional expression and engaging rhythm.",
    icon: Headphones,
    image: null,
    bg: "linear-gradient(135deg, #3D2B14 0%, #6B4C28 40%, #8B6934 100%)",
  },
  {
    title: "Advertising Spots",
    subtitle: "Campaigns that convert",
    description: "Commercial voiceovers with presence and charisma that capture your audience's attention.",
    icon: Megaphone,
    image: null,
    bg: "linear-gradient(135deg, #2E2210 0%, #5C3F20 40%, #7A5A30 100%)",
  },
  {
    title: "Corporate Videos",
    subtitle: "Institutional sophistication",
    description: "Premium voice delivery for executive presentations, training programs, and brand communications.",
    icon: Video,
    image: null,
    bg: "linear-gradient(135deg, #281E0E 0%, #4D3820 40%, #6B5032 100%)",
  },
  {
    title: "E-Learning",
    subtitle: "Engaging education",
    description: "Clear, compelling educational content that keeps learners engaged from start to finish.",
    icon: BookOpen,
    image: null,
    bg: "linear-gradient(135deg, #352812 0%, #5E4225 40%, #7E5E35 100%)",
  },
  {
    title: "Jingles & Audio Idents",
    subtitle: "Sonic identity",
    description: "Create a striking and unforgettable sonic identity for your brand.",
    icon: Music,
    image: null,
    bg: "linear-gradient(135deg, #382A16 0%, #634826 40%, #806236 100%)",
  },
];

export default function CinematicShowcase() {
  const [current, setCurrent] = useState(0);

  const advance = useCallback((dir: number) => {
    setCurrent((prev) => (prev + dir + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => advance(1), 5000);
    return () => clearInterval(timer);
  }, [advance]);

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <section
      className="py-24 px-4 md:px-8 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F5F5DC 0%, #EDE3D4 50%, #F5F5DC 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 anim-fade-up">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4" style={{ fontWeight: 600 }}>
            <span className="text-gradient-gold">Visual</span> Showcase
          </h2>
          <p className="font-body text-muted-foreground text-base max-w-xl mx-auto" style={{ fontWeight: 300 }}>
            A cinematic presentation of our premium services.
          </p>
        </div>

        <div className="relative">
          <div
            className="relative h-[380px] md:h-[440px] overflow-hidden"
            style={{
              borderRadius: "28px",
              border: "1px solid rgba(200,170,90,0.35)",
              boxShadow: "0 24px 64px -16px rgba(100,80,40,0.22), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div
              key={current}
              className="absolute inset-0 flex items-center transition-opacity duration-700"
              style={{ background: slide.image ? "#1a1a1a" : (slide.bg || "#2a1f10") }}
            >
              {/* Image background if available */}
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.85 }}
                  loading="lazy"
                />
              )}

              {/* Glass shine overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.05) 100%)",
                }}
              />
              {/* Radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 25% 35%, rgba(255,255,255,0.14) 0%, transparent 50%)" }}
              />
              {/* Bottom gradient for text readability */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
              />

              <div className="relative z-10 px-10 md:px-16 max-w-2xl flex flex-col gap-4 mt-auto pb-12">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(200,170,90,0.3)",
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#D4B068" }} />
                </div>

                <p className="font-body text-xs tracking-[0.25em] uppercase" style={{ color: "#C8A860" }}>
                  {slide.subtitle}
                </p>

                <h3 className="font-display text-3xl md:text-5xl leading-[1.1]" style={{ color: "#F0E8D8", fontWeight: 600 }}>
                  {slide.title}
                </h3>

                <p className="font-body text-base md:text-lg leading-relaxed max-w-md" style={{ color: "#C8B89A", fontWeight: 300 }}>
                  {slide.description}
                </p>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={() => advance(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-200 hover:scale-110"
            style={{
              background: "rgba(245,245,220,0.7)",
              border: "1px solid rgba(200,180,140,0.4)",
              boxShadow: "0 6px 24px -4px rgba(80,60,30,0.15)",
            }}
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => advance(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-200 hover:scale-110"
            style={{
              background: "rgba(245,245,220,0.7)",
              border: "1px solid rgba(200,180,140,0.4)",
              boxShadow: "0 6px 24px -4px rgba(80,60,30,0.15)",
            }}
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Pill indicators */}
          <div className="flex justify-center gap-2.5 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="h-1.5 rounded-full transition-all duration-400"
                style={{
                  width: i === current ? "2.5rem" : "0.75rem",
                  background: i === current ? "var(--primary)" : "hsl(35,22%,80%)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
