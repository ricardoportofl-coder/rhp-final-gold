import { useEffect, useRef } from "react";

const WAVE_COUNT = 6;
const DOT_COUNT = 80;
const TWO_PI = Math.PI * 2;

interface Dot {
  x: number;
  y: number;
  baseRadius: number;
  phaseOffset: number;
  twinkleSpeed: number;
  brightness: number;
}

function createDots(width: number, height: number): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push({
      x: Math.random() * width,
      y: Math.random() * height,
      baseRadius: 0.6 + Math.random() * 1.4,
      phaseOffset: Math.random() * TWO_PI,
      twinkleSpeed: 1.2 + Math.random() * 2,
      brightness: 0.2 + Math.random() * 0.8,
    });
  }
  return dots;
}

export default function AIVoiceWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dotsRef = useRef<Dot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w: number, h: number;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dotsRef.current = createDots(w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    const goldLight = [200, 175, 120];
    const goldDark = [160, 125, 60];

    function draw(time: number) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, w, h);

      const centerY = h / 2;

      // Waves
      for (let i = 0; i < WAVE_COUNT; i++) {
        const progress = i / (WAVE_COUNT - 1);
        const amplitude = 18 + progress * 28;
        const frequency = 0.005 + progress * 0.002;
        const speed = 0.25 + progress * 0.12;
        const phase = t * speed + i * 1.1;
        const opacity = 0.15 + (1 - progress) * 0.3;

        const r = goldLight[0] + (goldDark[0] - goldLight[0]) * progress;
        const g = goldLight[1] + (goldDark[1] - goldLight[1]) * progress;
        const b = goldLight[2] + (goldDark[2] - goldLight[2]) * progress;

        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (let x = 0; x <= w; x += 2) {
          const y =
            centerY +
            Math.sin(x * frequency + phase) * amplitude +
            Math.sin(x * frequency * 2.1 + phase * 1.5) * (amplitude * 0.25);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Dots
      const envelope = 0.6 + 0.4 * Math.sin(t * 0.7);

      for (const dot of dotsRef.current) {
        const twinkle =
          0.3 +
          0.7 * ((Math.sin(t * dot.twinkleSpeed + dot.phaseOffset) + 1) * 0.5);
        const combined = twinkle * envelope * dot.brightness;
        const radius = dot.baseRadius * (0.5 + combined * 0.5);

        const distFromCenter = Math.abs(dot.y - centerY) / (h * 0.4);
        const proxBoost = Math.max(0, 1 - distFromCenter);
        const alpha = combined * (0.2 + proxBoost * 0.6);

        const grad = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, radius * 3
        );
        grad.addColorStop(0, `rgba(190,165,100,${alpha})`);
        grad.addColorStop(0.5, `rgba(190,165,100,${alpha * 0.25})`);
        grad.addColorStop(1, `rgba(190,165,100,0)`);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius * 3, 0, TWO_PI);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius * 0.5, 0, TWO_PI);
        ctx.fillStyle = `rgba(210,190,140,${alpha * 0.8})`;
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

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
