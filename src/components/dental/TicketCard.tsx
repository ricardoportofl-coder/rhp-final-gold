import React, { useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { Download, MessageCircle, CalendarDays, Clock, User, Stethoscope } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Appointment } from "@/lib/dental/types";

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif";
const WHATSAPP = "13059227181";

interface TicketCardProps {
  appointment: Appointment;
  onBookAnother: () => void;
}

function TicketRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(0,122,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: "#8E8E93", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 1 }}>{label}</div>
        <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#1D1D1F" }}>{value}</div>
      </div>
    </div>
  );
}

// ── PDF GENERATION ─────────────────────────────────────────────────────────────
async function downloadPDF(apt: Appointment, dateFormatted: string, qrDataUrl: string | null) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // ── Gradient header (blue → indigo block) ──────────────────────────────────
  doc.setFillColor(0, 122, 255);
  doc.roundedRect(0, 0, W, 58, 0, 0, "F");
  doc.setFillColor(88, 86, 214);
  // Right-side darker stripe for depth
  doc.setFillColor(88, 86, 214);
  doc.rect(W * 0.5, 0, W, 58, "F");
  doc.setFillColor(0, 122, 255);
  doc.roundedRect(0, 0, W * 0.65, 58, 0, 0, "F");

  // Clinic wordmark (no emoji — jsPDF can't render them)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text("SMILE PREMIUM DENTAL", 10, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(190, 210, 255);
  doc.text("MIAMI-DADE, FL  \u00B7  PREMIUM DENTAL CARE", 10, 23);

  // Apt ID pill
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`# ${apt.id.toUpperCase()}`, 10, 34);

  // Status dot
  doc.setFillColor(52, 199, 89);
  doc.circle(W - 14, 31, 2.5, "F");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("CONFIRMED", W - 10, 34, { align: "right" });

  // Patient name (large)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(apt.patientName, 10, 50);

  let y = 68;

  // ── Perforated divider (dashed line) ──────────────────────────────────────
  doc.setDrawColor(210, 215, 225);
  doc.setLineDashPattern([2.5, 2], 0);
  doc.line(6, y - 6, W - 6, y - 6);
  doc.setLineDashPattern([], 0);

  // ── Detail rows ───────────────────────────────────────────────────────────
  const rows: [string, string][] = [
    ["SERVICE",   apt.serviceName],
    ["DOCTOR",    apt.doctorName],
    ["DATE",      dateFormatted],
    ["TIME",      `${apt.time}   \u00B7   ${apt.duration} minutes`],
    ["PATIENT",   apt.patientName],
    ["PHONE",     apt.patientPhone],
    ["EMAIL",     apt.patientEmail],
  ];

  for (const [label, value] of rows) {
    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 165);
    doc.text(label, 10, y);
    // Value
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(29, 29, 31);
    doc.text(value, 10, y + 5.5);
    // Separator
    doc.setDrawColor(235, 235, 240);
    doc.setLineDashPattern([], 0);
    doc.line(10, y + 9, W - 10, y + 9);
    y += 16;
  }

  // ── Second perforated divider ─────────────────────────────────────────────
  y += 4;
  doc.setDrawColor(210, 215, 225);
  doc.setLineDashPattern([2.5, 2], 0);
  doc.line(6, y, W - 6, y);
  doc.setLineDashPattern([], 0);
  y += 8;

  // ── QR CODE ───────────────────────────────────────────────────────────────
  if (qrDataUrl) {
    const qrSize = 30;
    doc.addImage(qrDataUrl, "PNG", 10, y, qrSize, qrSize);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 110);
    doc.text("SCAN AT RECEPTION", 10 + qrSize + 8, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(29, 29, 31);
    doc.text("+1 (305) 922-7181", 10 + qrSize + 8, y + 15);
    doc.text("smilepremialdental.com", 10 + qrSize + 8, y + 22);

    y += qrSize + 8;
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(142, 142, 147);
    doc.text("Present this document at reception.", 10, y + 6);
    doc.text("+1 (305) 922-7181  \u00B7  smilepremialdental.com", 10, y + 14);
    y += 20;
  }

  // ── Footer bar ────────────────────────────────────────────────────────────
  doc.setFillColor(245, 245, 247);
  doc.rect(0, H - 14, W, 14, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(174, 174, 178);
  doc.text(
    `Generated ${new Date().toLocaleString("en-US")}  \u00B7  ID: ${apt.id}  \u00B7  Smile Premium Dental`,
    W / 2, H - 5,
    { align: "center" }
  );

  doc.save(`SmileDental-${apt.patientName.replace(/\s+/g, "-")}-${apt.id}.pdf`);
}

// ── TICKET CARD COMPONENT ─────────────────────────────────────────────────────
export default function TicketCard({ appointment: apt, onBookAnother }: TicketCardProps) {
  const qrValue       = `SMILE-APT:${apt.id}|${apt.date}|${apt.time}|${apt.patientName}`;
  const [pdfLoading,  setPdfLoading]  = React.useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const dateFormatted = (() => {
    try { return format(parseISO(apt.date), "EEEE, MMMM d, yyyy"); }
    catch { return apt.date; }
  })();

  async function handleDownloadPDF() {
    setPdfLoading(true);
    try {
      // Get QR code data URL from the hidden canvas rendered by QRCodeCanvas
      const canvas = qrContainerRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
      const qrDataUrl = canvas?.toDataURL("image/png") ?? null;
      await downloadPDF(apt, dateFormatted, qrDataUrl);
    } finally {
      setPdfLoading(false);
    }
  }

  const waMsg = encodeURIComponent(
    `✅ My appointment is confirmed!\nService: ${apt.serviceName}\nDoctor: ${apt.doctorName}\nDate: ${dateFormatted} at ${apt.time}\n— Smile Premium Dental`
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1,    y: 0    }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
    >
      {/* Hidden high-res QRCodeCanvas for PDF embedding */}
      <div ref={qrContainerRef} style={{ position: "absolute", left: -9999, top: -9999, pointerEvents: "none", opacity: 0 }}>
        <QRCodeCanvas value={qrValue} size={300} level="M" bgColor="#FFFFFF" fgColor="#1D1D1F"/>
      </div>

      {/* ── THE TICKET ─────────────────────────────────────────────────────── */}
      <div style={{ width: 380, background: "#FFFFFF", borderRadius: 28, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)" }}>

        {/* Header gradient */}
        <div style={{ background: "linear-gradient(135deg, #007AFF 0%, #5856D6 60%, #AF52DE 100%)", padding: "28px 28px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, backdropFilter: "blur(8px)" }}>🦷</div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: "#FFFFFF" }}>Smile Premium Dental</div>
              <div style={{ fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Miami-Dade, FL · USA</div>
            </div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "5px 14px", border: "1px solid rgba(255,255,255,0.25)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34C759", flexShrink: 0 }}/>
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.12em", textTransform: "uppercase" }}>#{apt.id.toUpperCase()}</span>
          </div>
          <div style={{ marginTop: 14, fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em" }}>{apt.patientName}</div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>Appointment Confirmed ✓</div>
        </div>

        {/* Perforated divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "0 -1px" }}>
          <div style={{ width: 20, height: 20, background: "#F5F5F7", borderRadius: "0 12px 12px 0", flexShrink: 0 }}/>
          <div style={{ flex: 1, borderTop: "2px dashed rgba(0,0,0,0.10)", margin: "0 4px" }}/>
          <div style={{ width: 20, height: 20, background: "#F5F5F7", borderRadius: "12px 0 0 12px", flexShrink: 0 }}/>
        </div>

        {/* Body */}
        <div style={{ padding: "4px 28px 8px" }}>
          <TicketRow icon={<Stethoscope size={15} color="#007AFF"/>}  label="Service" value={apt.serviceName}/>
          <TicketRow icon={<User        size={15} color="#007AFF"/>}  label="Doctor"  value={apt.doctorName}/>
          <TicketRow icon={<CalendarDays size={15} color="#007AFF"/>} label="Date"    value={dateFormatted}/>
          <TicketRow icon={<Clock       size={15} color="#007AFF"/>}  label="Time"    value={`${apt.time} · ${apt.duration} min`}/>
        </div>

        {/* Second perforated divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "8px -1px 0" }}>
          <div style={{ width: 20, height: 20, background: "#F5F5F7", borderRadius: "0 12px 12px 0", flexShrink: 0 }}/>
          <div style={{ flex: 1, borderTop: "2px dashed rgba(0,0,0,0.10)", margin: "0 4px" }}/>
          <div style={{ width: 20, height: 20, background: "#F5F5F7", borderRadius: "12px 0 0 12px", flexShrink: 0 }}/>
        </div>

        {/* QR section */}
        <div style={{ padding: "20px 28px 28px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: 10, flexShrink: 0 }}>
            <QRCodeSVG value={qrValue} size={90} bgColor="#FFFFFF" fgColor="#1D1D1F" level="M"/>
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Verification QR</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: "#6E6E73", lineHeight: 1.5 }}>Scan at reception<br/>to check in instantly</div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: "#AEAEB2", marginTop: 10 }}>+1 (305) 922-7181</div>
          </div>
        </div>
      </div>

      {/* ── ACTIONS ─────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <motion.button onClick={handleDownloadPDF} disabled={pdfLoading}
          whileHover={!pdfLoading ? { scale: 1.03 } : {}} whileTap={!pdfLoading ? { scale: 0.97 } : {}}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 14, background: pdfLoading ? "#3A3A3C" : "#1D1D1F", border: "none", color: "#FFFFFF", fontFamily: FONT, fontSize: 14, fontWeight: 600, cursor: pdfLoading ? "default" : "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", opacity: pdfLoading ? 0.7 : 1, transition: "all 0.2s" }}>
          <Download size={16}/> {pdfLoading ? "Generating PDF…" : "Download PDF"}
        </motion.button>

        <motion.a href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 14, background: "#25D366", color: "#FFFFFF", textDecoration: "none", fontFamily: FONT, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
          <MessageCircle size={16}/> Share via WhatsApp
        </motion.a>

        <motion.button onClick={onBookAnother}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          style={{ padding: "13px 24px", borderRadius: 14, background: "#F5F5F7", border: "1.5px solid rgba(0,0,0,0.08)", color: "#6E6E73", fontFamily: FONT, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          Book Another →
        </motion.button>
      </div>
    </motion.div>
  );
}
