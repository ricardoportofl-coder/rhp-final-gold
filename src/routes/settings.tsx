import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Upload, Palette, Phone, MapPin, Building2,
  CheckCircle2, ChevronLeft, RotateCcw,
} from "lucide-react";
import { getSettingsFn, saveSettingsFn } from "@/lib/dental/actions";
import type { ClinicSettings } from "@/lib/dental/types";

export const Route = createFileRoute("/settings")({
  loader: async () => {
    const settings = await getSettingsFn();
    return { settings };
  },
  component: SettingsPage,
});

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif";

const ACCENT_PRESETS = [
  "#007AFF", "#5856D6", "#34C759", "#FF9F0A",
  "#FF3B30", "#AF52DE", "#00C7BE", "#FF6B2B",
];

function SettingsPage() {
  const { settings: initial } = Route.useLoaderData();
  return <ClinicSettingsForm initial={initial} />;
}

function Field({
  label, icon, children, hint,
}: {
  label: string; icon: React.ReactNode; children: React.ReactNode; hint?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon}
        <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#6E6E73", letterSpacing: "0.07em", textTransform: "uppercase" }}>{label}</label>
      </div>
      {children}
      {hint && <div style={{ fontFamily: FONT, fontSize: 11, color: "#AEAEB2" }}>{hint}</div>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "13px 16px",
  background: "#FFFFFF", border: "1.5px solid rgba(0,0,0,0.1)",
  borderRadius: 12, fontFamily: FONT, fontSize: 15, color: "#1D1D1F",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
};

function ClinicSettingsForm({ initial }: { initial: ClinicSettings }) {
  const [form,     setForm]     = useState<ClinicSettings>(initial);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof ClinicSettings) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, logoUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true); setSaved(false);
    try {
      const updated = await saveSettingsFn({
        clinicName:   form.clinicName,
        phone:        form.phone,
        address:      form.address,
        logoUrl:      form.logoUrl,
        accentColor:  form.accentColor,
      });
      setForm(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  }

  const fStyle = (key: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focused === key ? form.accentColor : "rgba(0,0,0,0.1)",
    boxShadow:   focused === key ? `0 0 0 3px ${form.accentColor}22` : "inset 0 1px 2px rgba(0,0,0,0.04)",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", fontFamily: FONT }}>

      {/* ── HEADER ── */}
      <header style={{ background: "#FFFFFF", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/admin" style={{ display: "flex", alignItems: "center", gap: 6, color: "#6E6E73", textDecoration: "none", fontFamily: FONT, fontSize: 14 }}>
            <ChevronLeft size={16}/> Dashboard
          </a>
          <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.1)" }}/>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: "#1D1D1F" }}>Clinic Settings</div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: "#AEAEB2", letterSpacing: "0.06em", textTransform: "uppercase" }}>Profile & Branding</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setForm(initial)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 10, background: "rgba(0,0,0,0.04)", border: "none", color: "#6E6E73", fontFamily: FONT, fontSize: 13, cursor: "pointer" }}>
            <RotateCcw size={13}/> Reset
          </button>
          <motion.button onClick={handleSave} disabled={saving}
            whileHover={!saving ? { scale: 1.02 } : {}} whileTap={!saving ? { scale: 0.98 } : {}}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 22px", borderRadius: 11, background: saving ? "#E8E8ED" : form.accentColor, border: "none", color: saving ? "#AEAEB2" : "#FFFFFF", fontFamily: FONT, fontSize: 14, fontWeight: 700, cursor: saving ? "default" : "pointer", boxShadow: saving ? "none" : `0 4px 16px ${form.accentColor}44` }}>
            <Save size={15}/> {saving ? "Saving…" : "Save Changes"}
          </motion.button>
        </div>
      </header>

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 76, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: "#1D1D1F", color: "#fff", fontFamily: FONT, fontSize: 14, fontWeight: 500, padding: "12px 24px", borderRadius: 40, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
            <CheckCircle2 size={16} color="#34C759"/> Settings saved successfully
          </motion.div>
        )}
      </AnimatePresence>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Identity card */}
            <Section title="Clinic Identity" sub="Public-facing name and contact info">
              <Field label="Clinic Name" icon={<Building2 size={14} color="#6E6E73"/>}>
                <input value={form.clinicName} onChange={set("clinicName")}
                  onFocus={() => setFocused("clinicName")} onBlur={() => setFocused(null)}
                  placeholder="Smile Premium Dental"
                  style={fStyle("clinicName")}/>
              </Field>
              <Field label="Phone Number" icon={<Phone size={14} color="#6E6E73"/>} hint="Displayed in booking confirmations and patient tickets">
                <input value={form.phone} onChange={set("phone")}
                  onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                  placeholder="+1 (305) 922-7181"
                  style={fStyle("phone")}/>
              </Field>
              <Field label="Address" icon={<MapPin size={14} color="#6E6E73"/>} hint="Shown in appointment PDFs and patient portal footer">
                <input value={form.address} onChange={set("address")}
                  onFocus={() => setFocused("address")} onBlur={() => setFocused(null)}
                  placeholder="1234 Brickell Ave, Miami, FL 33131"
                  style={fStyle("address")}/>
              </Field>
            </Section>

            {/* Branding */}
            <Section title="Brand Color" sub="Used as the accent throughout the entire app">
              <Field label="Accent Color" icon={<Palette size={14} color="#6E6E73"/>}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input type="color" value={form.accentColor}
                    onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                    style={{ width: 44, height: 44, borderRadius: 12, border: "1.5px solid rgba(0,0,0,0.1)", cursor: "pointer", padding: 3, background: "#fff" }}/>
                  <input value={form.accentColor} onChange={set("accentColor")}
                    onFocus={() => setFocused("accent")} onBlur={() => setFocused(null)}
                    style={{ ...fStyle("accent"), flex: 1, fontFamily: "monospace", fontSize: 14 }}/>
                </div>
                {/* Presets */}
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {ACCENT_PRESETS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, accentColor: c }))}
                      title={c}
                      style={{ width: 30, height: 30, borderRadius: 8, background: c, border: form.accentColor === c ? `3px solid #1D1D1F` : "2px solid transparent", cursor: "pointer", transition: "transform 0.15s", transform: form.accentColor === c ? "scale(1.2)" : "scale(1)" }}/>
                  ))}
                </div>
              </Field>
            </Section>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Logo upload */}
            <Section title="Clinic Logo" sub="Appears in the booking portal and PDF tickets">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoFile} style={{ display: "none" }}/>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                {/* Preview */}
                <div style={{ width: 120, height: 120, borderRadius: 28, background: form.logoUrl ? "transparent" : `${form.accentColor}15`, border: `2px dashed ${form.logoUrl ? "transparent" : form.accentColor + "55"}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                  {form.logoUrl
                    ? <img src={form.logoUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                    : <span style={{ fontSize: 44 }}>🦷</span>
                  }
                </div>
                <button onClick={() => fileRef.current?.click()}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: "#FFFFFF", border: "1.5px solid rgba(0,0,0,0.1)", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#1D1D1F", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <Upload size={14}/> Upload Logo
                </button>
                {form.logoUrl && (
                  <button onClick={() => setForm(f => ({ ...f, logoUrl: "" }))}
                    style={{ background: "none", border: "none", fontFamily: FONT, fontSize: 12, color: "#FF3B30", cursor: "pointer" }}>
                    Remove logo
                  </button>
                )}
                <div style={{ fontFamily: FONT, fontSize: 11, color: "#AEAEB2", textAlign: "center", lineHeight: 1.6 }}>
                  PNG, JPG or SVG · Max 2 MB<br/>Recommended: 512×512 px
                </div>
              </div>
            </Section>

            {/* Live preview */}
            <Section title="Live Preview" sub="How patients see your clinic">
              <div style={{ background: "#F5F5F7", borderRadius: 16, padding: 20 }}>
                {/* Booking portal header mock */}
                <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: form.logoUrl ? "transparent" : `linear-gradient(135deg, ${form.accentColor}, ${form.accentColor}99)`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {form.logoUrl ? <img src={form.logoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : "🦷"}
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#1D1D1F" }}>{form.clinicName || "Clinic Name"}</div>
                    <div style={{ fontFamily: FONT, fontSize: 10, color: "#AEAEB2", letterSpacing: "0.1em", textTransform: "uppercase" }}>Premium Care · Miami</div>
                  </div>
                </div>
                {/* Step indicator mock */}
                <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1,2,3,4,5].map(n => (
                      <div key={n} style={{ flex: 1, height: 6, borderRadius: 99, background: n === 1 ? form.accentColor : n < 1 ? `${form.accentColor}66` : "#E8E8ED" }}/>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, fontFamily: FONT, fontSize: 12, color: "#6E6E73" }}>Step 1 of 5 — Select a Service</div>
                </div>
                {/* CTA button mock */}
                <div style={{ padding: "12px 18px", borderRadius: 12, background: form.accentColor, textAlign: "center", boxShadow: `0 4px 16px ${form.accentColor}44` }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>Continue →</span>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: "#1D1D1F" }}>{title}</div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: "#6E6E73", marginTop: 3 }}>{sub}</div>
      </div>
      {children}
    </motion.div>
  );
}
