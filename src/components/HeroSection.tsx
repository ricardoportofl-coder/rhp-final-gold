import { useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import goldenSilhouette from "@/assets/golden-silhouette.jpg";

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    let w: number, h: number;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; phase: number; speed: number;
    }

    let particles: Particle[] = [];

    function resize() {
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = [];
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.08 - Math.random() * 0.2,
          size: 1 + Math.random() * 2.5,
          alpha: 0.25 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 1,
        });
      }
    }

    resize();
    window.addEventListener("resize", resize);

    function draw(time: number) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx + Math.sin(t * p.speed + p.phase) * 0.1;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const twinkle = 0.5 + 0.5 * Math.sin(t * p.speed * 2 + p.phase);
        const a = p.alpha * twinkle;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `rgba(200,175,100,${a * 0.8})`);
        grad.addColorStop(0.5, `rgba(200,175,100,${a * 0.15})`);
        grad.addColorStop(1, `rgba(200,175,100,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,210,160,${a * 0.9})`;
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: "block" }} />;
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(170deg, #F5F5DC 0%, #F0E8D8 30%, #EADBC8 60%, #F5F5DC 100%)",
        }}
      />

      {/* Floating gold particles */}
      <FloatingParticles />

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, #F5F5DC 90%)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center max-w-2xl pt-24">
        {/* Brand name */}
        <p
          className="font-display text-lg md:text-xl tracking-[0.25em] uppercase anim-fade-up"
          style={{ color: "hsl(30,20%,38%)", fontWeight: 400 }}
        >
          Gabriele's Golden Voice
        </p>

        {/* Subtitle */}
        <p
          className="font-body text-[11px] md:text-xs tracking-[0.3em] uppercase anim-fade-up-d1"
          style={{ color: "hsl(30,12%,52%)", fontWeight: 300 }}
        >
          Premium Artificial Intelligence
        </p>

        {/* Golden silhouette card */}
        <div className="anim-scale mt-4">
          <div
            className="relative w-[280px] h-[380px] md:w-[320px] md:h-[440px] rounded-3xl overflow-hidden"
            style={{
              border: "1px solid rgba(200,170,90,0.25)",
              boxShadow: "0 0 80px -10px rgba(180,145,70,0.35), 0 30px 60px -15px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={goldenSilhouette}
              alt="Gabriele AI - Golden Silhouette"
              width={768}
              height={1024}
              className="w-full h-full object-cover"
            />
            {/* Glow overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 40%, rgba(200,170,80,0.12) 0%, transparent 60%)",
              }}
            />
          </div>
        </div>

        {/* Start Talking button */}
        <button
          className="group relative flex items-center gap-3 px-10 py-4 rounded-full bg-primary text-primary-foreground font-body font-semibold text-base btn-pulse-glow transition-transform duration-200 hover:scale-105 active:scale-95 anim-fade-up-d2 mt-4"
        >
          <Mic className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="tracking-[0.15em] uppercase text-sm">Start Talking</span>
        </button>

        {/* Tagline */}
        <p
          className="font-body text-[10px] tracking-[0.35em] uppercase mt-1 anim-fade-up-d3"
          style={{ color: "hsl(35,25%,58%)", fontWeight: 300 }}
        >
          Powered by AI · Refined by Elegance
        </p>
      </div>
    </section>
  );
}
