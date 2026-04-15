import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CalendarDays, Shield, MessageCircle, BarChart3, Bell, Zap,
  CheckCircle2, ArrowRight, Star, Users, Clock, DollarSign,
  Layers, Repeat,
} from "lucide-react";

export const Route = createFileRoute("/home")({ component: SalesPage });

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif";

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } };
}

// ─── MOCK SCREENSHOT PLACEHOLDERS ─────────────────────────────────────────────
function ScreenMock({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1D1D1F", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
      {/* Browser chrome */}
      <div style={{ background: "#2C2C2E", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }}/>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }}/>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }}/>
        <div style={{ flex: 1, marginLeft: 8, background: "#3A3A3C", borderRadius: 6, height: 22, display: "flex", alignItems: "center", paddingLeft: 10 }}>
          <span style={{ fontFamily: FONT, fontSize: 11, color: "#6E6E73" }}>smilepremialdental.com/{label.toLowerCase().replace(" ", "")}</span>
        </div>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}

// ─── STAT BADGE ───────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontSize: 42, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ─── FEATURE CARD ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, color, title, desc, delay }: { icon: React.ElementType; color: string; title: string; desc: string; delay: number }) {
  return (
    <motion.div {...fadeUp(delay)}
      style={{ background: "#FFFFFF", borderRadius: 20, padding: "28px 24px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: "#1D1D1F", marginBottom: 8 }}>{title}</div>
        <div style={{ fontFamily: FONT, fontSize: 14, color: "#6E6E73", lineHeight: 1.65 }}>{desc}</div>
      </div>
    </motion.div>
  );
}

// ─── TESTIMONIAL ──────────────────────────────────────────────────────────────
function Testimonial({ name, role, quote, gradient }: { name: string; role: string; quote: string; gradient: string }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "28px 24px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#FF9F0A" color="#FF9F0A"/>)}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 15, color: "#1D1D1F", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{quote}"</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: gradient, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#fff" }}>
          {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: "#1D1D1F" }}>{name}</div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: "#6E6E73" }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKLIST ITEM ───────────────────────────────────────────────────────────
function CheckItem({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <CheckCircle2 size={18} color="#34C759" strokeWidth={2.5} />
      <span style={{ fontFamily: FONT, fontSize: 15, color: "#1D1D1F" }}>{label}</span>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SalesPage() {
  return (
    <div style={{ background: "#F5F5F7", minHeight: "100vh", fontFamily: FONT }}>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(245,245,247,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "0 5vw", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#007AFF,#5856D6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🦷</div>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#1D1D1F" }}>Smile Premium Dental</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="#features" style={{ fontFamily: FONT, fontSize: 14, color: "#6E6E73", textDecoration: "none" }}>Features</a>
          <a href="#testimonials" style={{ fontFamily: FONT, fontSize: 14, color: "#6E6E73", textDecoration: "none" }}>Reviews</a>
          <a href="/admin" style={{ fontFamily: FONT, fontSize: 14, color: "#6E6E73", textDecoration: "none" }}>Admin</a>
          <a href="/dental" style={{ padding: "8px 18px", borderRadius: 10, background: "#007AFF", color: "#fff", fontFamily: FONT, fontSize: 13, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,122,255,0.3)" }}>Book Now</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: "100px 5vw 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <motion.div {...fadeUp()} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,122,255,0.1)", borderRadius: 40, padding: "6px 16px", marginBottom: 24 }}>
            <Zap size={13} color="#007AFF" fill="#007AFF"/>
            <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#007AFF", letterSpacing: "0.06em", textTransform: "uppercase" }}>Dental SaaS Platform — Miami</span>
          </motion.div>

          <motion.h1 {...fadeUp(0.07)} style={{ fontFamily: FONT, fontSize: "clamp(40px,6vw,72px)", fontWeight: 800, color: "#1D1D1F", letterSpacing: "-0.03em", lineHeight: 1.08, margin: "0 0 24px" }}>
            Your clinic,{" "}
            <span style={{ background: "linear-gradient(135deg,#007AFF,#5856D6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              running like an Apple product.
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.14)} style={{ fontFamily: FONT, fontSize: 18, color: "#6E6E73", lineHeight: 1.75, margin: "0 0 40px", maxWidth: 540 }}>
            Online scheduling, automated WhatsApp confirmations, admin dashboard and real-time metrics — everything Fernando's clinic needs to operate at the highest level.
          </motion.p>

          <motion.div {...fadeUp(0.2)} style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/dental" style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 14, background: "#007AFF", color: "#fff", fontFamily: FONT, fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 32px rgba(0,122,255,0.4)" }}>
              Book Appointment <ArrowRight size={18}/>
            </a>
            <a href="/admin" style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 14, background: "#FFFFFF", color: "#1D1D1F", fontFamily: FONT, fontSize: 16, fontWeight: 600, textDecoration: "none", border: "1.5px solid rgba(0,0,0,0.1)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
              View Dashboard
            </a>
          </motion.div>
        </div>

        {/* Hero visual — scheduler mockup */}
        <motion.div {...fadeUp(0.28)} style={{ marginTop: 72 }}>
          <ScreenMock label="dental" accent="#007AFF">
            {/* Mini scheduler preview */}
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, minHeight: 280 }}>
              <div style={{ background: "#F5F5F7", borderRadius: 12, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#007AFF,#5856D6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🦷</div>
                {["Service","Professional","Date & Time","Your Info","Summary"].map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: i === 0 ? "rgba(0,122,255,0.1)" : "transparent" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: i < 0 ? "#34C759" : i === 0 ? "#007AFF" : "#E8E8ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: i === 0 ? "#fff" : "#AEAEB2" }}>{i + 1}</span>
                    </div>
                    <span style={{ fontFamily: FONT, fontSize: 12, color: i === 0 ? "#007AFF" : "#AEAEB2", fontWeight: i === 0 ? 600 : 400 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: "#FFFFFF" }}>Select a Service</div>
                {[
                  { name: "Checkup & Cleaning", color: "#34C759", time: "45 min" },
                  { name: "Teeth Whitening",    color: "#FF9F0A", time: "90 min" },
                  { name: "Orthodontic Consult",color: "#007AFF", time: "60 min" },
                ].map(s => (
                  <div key={s.name} style={{ background: "rgba(255,255,255,0.06)", border: `1.5px solid ${s.name === "Checkup & Cleaning" ? s.color : "rgba(255,255,255,0.1)"}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{s.name}</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, color: s.color }}>{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScreenMock>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "linear-gradient(135deg,#007AFF,#5856D6)", padding: "64px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }}>
          <Stat value="20s"  label="Average booking time"/>
          <Stat value="100%" label="WhatsApp confirmation rate"/>
          <Stat value="4"    label="Doctors managed simultaneously"/>
          <Stat value="0"    label="Double bookings — ever"/>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "100px 5vw", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div {...fadeUp()} style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#007AFF", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Everything included</div>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#1D1D1F", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            Built for modern dental clinics
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 17, color: "#6E6E73", maxWidth: 480, margin: "0 auto" }}>
            Every feature was designed specifically for Fernando's workflow — from the first click to post-visit follow-up.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
          <FeatureCard delay={0.05} icon={CalendarDays} color="#007AFF" title="Smart Online Scheduling"
            desc="5-step guided booking flow with real-time availability, conflict detection and 15-minute buffer logic between appointments."/>
          <FeatureCard delay={0.1} icon={MessageCircle} color="#25D366" title="WhatsApp Automation"
            desc="Instant confirmations, rescheduling alerts, and cancellation notices sent automatically via WhatsApp to every patient."/>
          <FeatureCard delay={0.15} icon={BarChart3} color="#FF9F0A" title="Admin Dashboard"
            desc="Day view, week view, patient list, doctor productivity chart and revenue metrics — all in one place, updated live."/>
          <FeatureCard delay={0.2} icon={Shield} color="#34C759" title="Conflict-Free Scheduling"
            desc="Zero double bookings. Our engine checks all active appointments plus a 15-minute buffer before confirming any slot."/>
          <FeatureCard delay={0.25} icon={Bell} color="#AF52DE" title="Status Management"
            desc="Pending → Confirmed → Cancelled workflow with one-click actions from the dashboard, auto-notifying patients at each step."/>
          <FeatureCard delay={0.3} icon={DollarSign} color="#FF3B30" title="Revenue Tracking"
            desc="Daily estimated revenue based on booked services, new patient count, and cancellation metrics — always up to date."/>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ background: "#1D1D1F", padding: "100px 5vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div {...fadeUp()} style={{ display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 340px" }}>
              <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#007AFF", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Admin Command Center</div>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", margin: "0 0 20px", lineHeight: 1.15 }}>
                Fernando sees everything<br/>at a glance.
              </h2>
              <p style={{ fontFamily: FONT, fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 32px" }}>
                The dashboard aggregates every appointment across all doctors, shows who's the most productive, and lets you confirm, reschedule or cancel with one tap.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["Live day & week timeline views","Doctor productivity bar chart","One-click confirm, cancel & reschedule","Revenue estimate auto-calculated"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <CheckCircle2 size={18} color="#34C759" strokeWidth={2.5}/>
                    <span style={{ fontFamily: FONT, fontSize: 15, color: "rgba(255,255,255,0.8)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 36, padding: "14px 28px", borderRadius: 12, background: "#007AFF", color: "#fff", fontFamily: FONT, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 32px rgba(0,122,255,0.4)" }}>
                Open Dashboard <ArrowRight size={16}/>
              </a>
            </div>
            <div style={{ flex: "1 1 480px" }}>
              <ScreenMock label="admin" accent="#34C759">
                {/* Mini admin preview */}
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "12", sub: "Total Today", color: "#007AFF" },
                    { label: "$2,150", sub: "Revenue", color: "#34C759" },
                    { label: "5", sub: "New Patients", color: "#FF9F0A" },
                    { label: "1", sub: "Cancelled", color: "#FF3B30" },
                  ].map(m => (
                    <div key={m.label} style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
                      <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: m.color }}>{m.label}</div>
                      <div style={{ fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{m.sub}</div>
                    </div>
                  ))}
                </div>
                {[
                  { name: "Dr. Sarah Mitchell", pct: 90, gradient: "linear-gradient(90deg,#007AFF,#5856D6)", top: true  },
                  { name: "Dr. Emily Chen",     pct: 72, gradient: "linear-gradient(90deg,#FF9F0A,#FF6B2B)", top: false },
                  { name: "Dr. James Ortega",   pct: 60, gradient: "linear-gradient(90deg,#34C759,#30D158)", top: false },
                  { name: "Dr. M. Torres",      pct: 45, gradient: "linear-gradient(90deg,#AF52DE,#BF5AF2)", top: false },
                ].map(d => (
                  <div key={d.name} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{d.name}</span>
                      {d.top && <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#FF9F0A" }}>⭐ TOP</span>}
                    </div>
                    <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${d.pct}%`, height: "100%", background: d.gradient, borderRadius: 99 }}/>
                    </div>
                  </div>
                ))}
              </ScreenMock>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: "100px 5vw", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div {...fadeUp()} style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#1D1D1F", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            Loved by clinics in Miami
          </h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          <Testimonial gradient="linear-gradient(135deg,#007AFF,#5856D6)" name="Fernando Álvarez" role="Clinic Director — Smile Premium Dental"
            quote="We cut no-shows by 60% in the first month. Patients love getting the WhatsApp confirmation immediately after booking."/>
          <Testimonial gradient="linear-gradient(135deg,#34C759,#30D158)" name="Dr. Sarah Mitchell" role="General Dentist"
            quote="The day-view timeline is incredible. I see my entire schedule at a glance — no more paper books, no more double bookings."/>
          <Testimonial gradient="linear-gradient(135deg,#FF9F0A,#FF6B2B)" name="Dr. Emily Chen" role="Cosmetic Specialist"
            quote="Patients actually compliment us on how professional and modern the booking experience feels. The ticket they receive is beautiful."/>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: "#1D1D1F", padding: "100px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div {...fadeUp()} style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#007AFF", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Simple by design</div>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", margin: 0 }}>
              Live in 20 seconds.
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
            {[
              { n: "01", title: "Patient books online", desc: "5-step guided flow. Real-time slot availability. Zero phone calls required.", color: "#007AFF" },
              { n: "02", title: "Auto-confirm via WhatsApp", desc: "Instant message sent the moment the appointment is created. Patient gets a digital ticket.", color: "#5856D6" },
              { n: "03", title: "Fernando manages everything", desc: "One dashboard. All doctors. Revenue metrics, rescheduling, and status updates in one click.", color: "#AF52DE" },
            ].map((s, i) => (
              <motion.div key={s.n} {...fadeUp(i * 0.1)}
                style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "32px 28px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 800, color: s.color, opacity: 0.3, lineHeight: 1, marginBottom: 16 }}>{s.n}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: "#FFFFFF", marginBottom: 12 }}>{s.title}</div>
                <div style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PLATFORM VISION ── */}
      <section style={{ padding: "100px 5vw", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div {...fadeUp()} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#007AFF,#5856D6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={18} color="#FFFFFF"/>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#007AFF", letterSpacing: "0.1em", textTransform: "uppercase" }}>The Platform</div>
        </motion.div>

        <motion.div {...fadeUp(0.07)} style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, color: "#1D1D1F", letterSpacing: "-0.02em", margin: "0 0 20px", lineHeight: 1.1 }}>
            Today it's dentistry.<br/>Tomorrow — every profession.
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 17, color: "#6E6E73", maxWidth: 540, margin: "0 auto 48px", lineHeight: 1.75 }}>
            This is a <strong style={{ color: "#1D1D1F" }}>modular SaaS engine</strong>. The scheduling logic, conflict detection, WhatsApp automation and financial reporting are profession-agnostic. Swap the services. Keep the brain.
          </p>
        </motion.div>

        {/* Profession grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12, maxWidth: 900, margin: "0 auto 60px" }}>
          {[
            { emoji: "🦷", name: "Dentistry",     status: "live",   color: "#007AFF" },
            { emoji: "💆", name: "Aesthetics",    status: "next",   color: "#AF52DE" },
            { emoji: "🏃", name: "Physiotherapy", status: "next",   color: "#34C759" },
            { emoji: "🧠", name: "Psychology",    status: "coming", color: "#FF9F0A" },
            { emoji: "🐾", name: "Veterinary",    status: "coming", color: "#FF6B2B" },
            { emoji: "💅", name: "Beauty Salons", status: "coming", color: "#FF3B30" },
            { emoji: "🏋️", name: "Personal Training", status: "coming", color: "#5856D6" },
            { emoji: "👁️", name: "Ophthalmology", status: "coming", color: "#00C7BE" },
          ].map((p, i) => (
            <motion.div key={p.name} {...fadeUp(i * 0.04)}
              style={{ background: "#FFFFFF", borderRadius: 16, padding: "20px 16px", border: `1.5px solid ${p.status === "live" ? p.color : "rgba(0,0,0,0.07)"}`, textAlign: "center", boxShadow: p.status === "live" ? `0 4px 20px ${p.color}22` : "0 2px 8px rgba(0,0,0,0.04)", position: "relative" }}>
              {p.status === "live" && (
                <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: p.color, borderRadius: 20, padding: "2px 10px", fontFamily: FONT, fontSize: 9, fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>LIVE</div>
              )}
              {p.status === "next" && (
                <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "#34C759", borderRadius: 20, padding: "2px 10px", fontFamily: FONT, fontSize: 9, fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>NEXT</div>
              )}
              <div style={{ fontSize: 32, marginBottom: 10 }}>{p.emoji}</div>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: p.status === "coming" ? "#AEAEB2" : "#1D1D1F" }}>{p.name}</div>
            </motion.div>
          ))}
        </div>

        {/* Architecture callout */}
        <motion.div {...fadeUp(0.2)} style={{ background: "#1D1D1F", borderRadius: 24, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Repeat size={18} color="#007AFF"/>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: "#FFFFFF" }}>Modular by Architecture</span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 480 }}>
              The codebase uses a <strong style={{ color: "#FFFFFF" }}>Skin Master</strong> pattern — shared engine (scheduling, conflict detection, notifications, metrics) with a swappable UI layer per profession. Replicating for a new vertical takes days, not months.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
            {[
              { label: "Conflict Engine",    color: "#007AFF" },
              { label: "WhatsApp Automation",color: "#25D366" },
              { label: "Revenue Reporting",  color: "#FF9F0A" },
              { label: "PDF Tickets",        color: "#AF52DE" },
            ].map(f => (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: f.color, flexShrink: 0 }}/>
                <span style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{f.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg,#007AFF 0%,#5856D6 50%,#AF52DE 100%)", padding: "100px 5vw", textAlign: "center" }}>
        <motion.div {...fadeUp()}>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(32px,5vw,60px)", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em", margin: "0 0 20px", lineHeight: 1.1 }}>
            Ready to modernize your clinic?
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 18, color: "rgba(255,255,255,0.7)", margin: "0 auto 40px", maxWidth: 440 }}>
            The system is live. Book a real appointment, explore the admin, and see how it feels.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/dental" style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 36px", borderRadius: 14, background: "#FFFFFF", color: "#007AFF", fontFamily: FONT, fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}>
              <CalendarDays size={20}/> Book Now — It's Live
            </a>
            <a href="/admin" style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 36px", borderRadius: 14, background: "rgba(255,255,255,0.15)", color: "#FFFFFF", fontFamily: FONT, fontSize: 16, fontWeight: 600, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.3)" }}>
              <Users size={20}/> Admin Dashboard
            </a>
          </div>

          <div style={{ marginTop: 64, display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {["Online scheduling 24/7","WhatsApp notifications","Real-time admin dashboard","PDF appointment tickets","No-conflict guarantee"].map(f => (
              <CheckItem key={f} label={f}/>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1D1D1F", padding: "40px 5vw", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#007AFF,#5856D6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🦷</div>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: "#FFFFFF" }}>Smile Premium Dental</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="/dental"   style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Book</a>
          <a href="/admin"    style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Admin</a>
          <a href="/settings" style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Settings</a>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          © 2026 Smile Premium Dental · Miami, FL
        </div>
      </footer>

    </div>
  );
}
