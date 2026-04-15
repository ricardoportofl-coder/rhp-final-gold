import { useState, useMemo, createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Check, Clock, User, Phone,
  Mail, FileText, Sparkles, Shield, Zap, Heart, Star,
  CheckCircle2, MessageCircle, CalendarDays, ArrowRight,
  AlertTriangle, Loader2, LogOut,
} from "lucide-react";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay, isWeekend, startOfWeek,
  endOfWeek, isSameMonth,
} from "date-fns";
import { getOccupiedSlotsFn, createAppointmentFn } from "@/lib/dental/actions";
import { ThemeCtx, getColors } from "@/lib/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import TicketCard from "./TicketCard";
import type { Appointment } from "@/lib/dental/types";

// ─── THEME ────────────────────────────────────────────────────────────────────
const useC = () => useContext(ThemeCtx);

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CLINIC_PHONE = "+1 (305) 922-7181";
const WHATSAPP_NUM = "13059227181";
const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif";

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const SERVICES = [
  { id:"checkup",   name:"Checkup & Cleaning",  duration:45,  desc:"Full exam + professional cleaning & polish",    icon:Shield,   color:"#34C759", ids:["sarah","emily","any"] },
  { id:"whitening", name:"Teeth Whitening",      duration:90,  desc:"Professional laser whitening treatment",        icon:Sparkles, color:"#FF9F0A", ids:["emily","sarah","any"] },
  { id:"ortho",     name:"Orthodontic Consult",  duration:60,  desc:"Braces, aligners & bite correction evaluation", icon:Star,     color:"#007AFF", ids:["james","any"]        },
  { id:"implant",   name:"Implant Assessment",   duration:45,  desc:"X-ray scan + full implant treatment plan",      icon:Zap,      color:"#AF52DE", ids:["michael","any"]      },
  { id:"emergency", name:"Emergency Care",       duration:30,  desc:"Pain relief, broken tooth or urgent need",      icon:Heart,    color:"#FF3B30", ids:["sarah","michael","any"] },
];

const PROFESSIONALS = [
  { id:"any",     name:"Any Available",      specialty:"First Available Slot",   exp:"",       rating:0,   gradient:"linear-gradient(135deg,#C7C7CC,#AEAEB2)", initials:"✦",  bio:"We'll match you with the best professional for your needs." },
  { id:"sarah",   name:"Dr. Sarah Mitchell", specialty:"General Dentist",        exp:"12 yrs", rating:4.9, gradient:"linear-gradient(135deg,#007AFF,#5856D6)", initials:"SM", bio:"Specialist in preventive care. Voted Top Dentist Miami 2024." },
  { id:"james",   name:"Dr. James Ortega",   specialty:"Orthodontist",           exp:"15 yrs", rating:4.8, gradient:"linear-gradient(135deg,#34C759,#30D158)", initials:"JO", bio:"Board-certified orthodontist. Expert in Invisalign systems." },
  { id:"emily",   name:"Dr. Emily Chen",     specialty:"Cosmetic Specialist",    exp:"9 yrs",  rating:5.0, gradient:"linear-gradient(135deg,#FF9F0A,#FF6B2B)", initials:"EC", bio:"Renowned for smile transformations. Published cosmetic author." },
  { id:"michael", name:"Dr. Michael Torres", specialty:"Implantologist",         exp:"18 yrs", rating:4.9, gradient:"linear-gradient(135deg,#AF52DE,#BF5AF2)", initials:"MT", bio:"Over 3,000 implants placed. Pioneer in minimally invasive techniques." },
];

const ALL_SLOTS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
const STEPS     = [{ n:1, label:"Service" },{ n:2, label:"Professional" },{ n:3, label:"Date & Time" },{ n:4, label:"Your Info" },{ n:5, label:"Summary" }];

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Patient { name:string; phone:string; email:string; notes:string; }
type ServiceObj      = typeof SERVICES[0];
type ProfessionalObj = typeof PROFESSIONALS[0];

// ─── PHONE MASK ───────────────────────────────────────────────────────────────
function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 1)  return `+${d}`;
  if (d.length <= 4)  return `+${d[0]} (${d.slice(1)}`;
  if (d.length <= 7)  return `+${d[0]} (${d.slice(1,4)}) ${d.slice(4)}`;
  if (d.length <= 11) return `+${d[0]} (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;
  return `+${d[0]} (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7,11)}`;
}

function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p: string) { return p.replace(/\D/g,"").length >= 10; }

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const todayDate     = () => { const d=new Date(); d.setHours(0,0,0,0); return d; };
const isBeforeToday = (d:Date) => d < todayDate();
const isAvailable   = (d:Date, m:Date) => !isBeforeToday(d) && !isWeekend(d) && isSameMonth(d,m);
const hexToRgb      = (h:string) => `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`;

function fadeUp(delay=0) {
  return { initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, exit:{opacity:0,y:-10}, transition:{duration:0.28,delay,ease:[0.25,0.1,0.25,1]} };
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Header({ title, sub }:{ title:string; sub:string }) {
  const C = useC();
  return (
    <div style={{ marginBottom:32 }}>
      <h2 style={{ fontFamily:C.font, fontSize:28, fontWeight:700, color:C.text, margin:"0 0 6px", letterSpacing:"-0.02em" }}>{title}</h2>
      <p  style={{ fontFamily:C.font, fontSize:14, color:C.textSub, margin:0 }}>{sub}</p>
    </div>
  );
}

function Card({ children, selected, accent, onClick, style }:{ children:React.ReactNode; selected?:boolean; accent?:string; onClick?:()=>void; style?:React.CSSProperties }) {
  const C = useC();
  const a = accent ?? C.accent;
  return (
    <motion.div onClick={onClick}
      whileHover={onClick?{ scale:1.012, boxShadow:C.shadowMd }:{}}
      whileTap={onClick  ?{ scale:0.99  }:{}}
      style={{ background:C.surface, borderRadius:16, border:`1.5px solid ${selected?a:C.border}`, boxShadow:selected?`0 0 0 3px rgba(${hexToRgb(a)},0.12), ${C.shadow}`:C.shadow, cursor:onClick?"pointer":"default", transition:"border-color 0.2s, box-shadow 0.2s", ...style }}>
      {children}
    </motion.div>
  );
}

function StarRating({ rating }:{ rating:number }) {
  const C = useC();
  if (!rating) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
      {[1,2,3,4,5].map(i=><Star key={i} size={11} fill={i<=Math.round(rating)?"#FF9F0A":"none"} color={i<=Math.round(rating)?"#FF9F0A":C.textMuted} strokeWidth={1.5}/>)}
      <span style={{ fontFamily:C.font, fontSize:12, color:C.textSub, marginLeft:3 }}>{rating}</span>
    </div>
  );
}

function navBtnStyle(C: ReturnType<typeof useC>): React.CSSProperties {
  return { width:34, height:34, borderRadius:10, background:C.surface2, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", outline:"none", boxShadow:C.shadow };
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ step, service, prof, date, time, patient }:{ step:number; service?:ServiceObj; prof?:ProfessionalObj; date:Date|null; time:string|null; patient:Patient }) {
  const C = useC();
  return (
    <aside style={{ width:280, minHeight:"100vh", background:C.surface, borderRight:`1px solid ${C.border}`, padding:"44px 26px", display:"flex", flexDirection:"column", gap:32, position:"sticky", top:0, flexShrink:0, boxShadow:"2px 0 12px rgba(0,0,0,0.04)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#007AFF,#5856D6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 4px 12px rgba(0,122,255,0.3)" }}>🦷</div>
        <div>
          <div style={{ fontFamily:C.font, fontWeight:700, fontSize:15, color:C.text }}>Smile Premium Dental</div>
          <div style={{ fontFamily:C.font, fontSize:10, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>Premium Care · Miami</div>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {STEPS.map(s => {
          const done=step>s.n, active=step===s.n;
          return (
            <div key={s.n} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:12, background:active?C.accentDim:"transparent", transition:"background 0.2s" }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:done?C.success:active?C.accent:C.surface3, border:`1.5px solid ${done?C.success:active?C.accent:C.surface4}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.25s", boxShadow:active?`0 2px 8px ${C.accentGlow}`:"none" }}>
                {done?<Check size={12} color="#fff" strokeWidth={3}/>:<span style={{ fontFamily:C.font, fontSize:11, fontWeight:700, color:active?"#fff":C.textMuted }}>{s.n}</span>}
              </div>
              <span style={{ fontFamily:C.font, fontSize:13, fontWeight:active?600:400, color:active?C.accent:done?C.text:C.textMuted, transition:"color 0.2s" }}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {(service||date||patient.name) && (
        <motion.div {...fadeUp()} style={{ background:C.surface2, borderRadius:16, padding:20, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ fontFamily:C.font, fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:"0.12em", textTransform:"uppercase" }}>Your Booking</div>
          {service&&<SR icon={<service.icon size={13} color={service.color}/>} label={service.name} sub={service.duration+"min"}/>}
          {prof&&prof.id!=="any"&&<SR icon={<User size={13} color={C.textSub}/>} label={prof.name} sub={prof.specialty}/>}
          {date&&<SR icon={<CalendarDays size={13} color={C.textSub}/>} label={format(date,"EEE, MMM d, yyyy")}/>}
          {time&&<SR icon={<Clock size={13} color={C.textSub}/>} label={time}/>}
          {patient.name&&<SR icon={<User size={13} color={C.textSub}/>} label={patient.name}/>}
        </motion.div>
      )}
      <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:10 }}>
        {/* Support button */}
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUM}`} target="_blank" rel="noopener noreferrer"
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"10px 16px", borderRadius:12, background:"#25D366", color:"#fff", fontFamily:C.font, fontSize:13, fontWeight:600, textDecoration:"none", boxShadow:"0 4px 14px rgba(37,211,102,0.35)" }}>
          <MessageCircle size={15}/> WhatsApp Support
        </motion.a>
        {/* Exit button */}
        <motion.a
          href="/home"
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"10px 16px", borderRadius:12, background:"transparent", border:`1.5px solid ${C.border}`, color:C.textSub, fontFamily:C.font, fontSize:13, fontWeight:500, textDecoration:"none" }}>
          <LogOut size={14}/> Exit
        </motion.a>
        <div style={{ fontFamily:C.font, fontSize:11, color:C.textMuted, lineHeight:1.7, textAlign:"center" }}>
          {CLINIC_PHONE}
        </div>
      </div>
    </aside>
  );
}

function SR({ icon, label, sub }:{ icon:React.ReactNode; label:string; sub?:string }) {
  const C = useC();
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
      <div style={{ marginTop:2, flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily:C.font, fontSize:13, fontWeight:500, color:C.text }}>{label}</div>
        {sub&&<div style={{ fontFamily:C.font, fontSize:11, color:C.textSub }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── STEP 1 — SERVICE ─────────────────────────────────────────────────────────
function StepService({ selected, onSelect }:{ selected:string|null; onSelect:(id:string)=>void }) {
  const C = useC();
  return (
    <motion.div {...fadeUp()}>
      <Header title="Select a Service" sub="What brings you in today?"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:14 }}>
        {SERVICES.map((s,i) => {
          const active=selected===s.id;
          return (
            <motion.div key={s.id} {...fadeUp(i*0.04)}>
              <Card selected={active} accent={s.color} onClick={() => onSelect(s.id)}>
                <div style={{ padding:22, display:"flex", alignItems:"flex-start", gap:16 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:`rgba(${hexToRgb(s.color)},0.1)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <s.icon size={22} color={s.color}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:C.font, fontWeight:600, fontSize:15, color:C.text, marginBottom:5 }}>{s.name}</div>
                    <div style={{ fontFamily:C.font, fontSize:12, color:C.textSub, lineHeight:1.5 }}>{s.desc}</div>
                    <div style={{ fontFamily:C.font, fontSize:12, color:s.color, marginTop:10, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                      <Clock size={11}/> {s.duration} min
                    </div>
                  </div>
                  {active&&<div style={{ width:22, height:22, borderRadius:"50%", background:s.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Check size={12} color="#fff" strokeWidth={3}/></div>}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── STEP 2 — PROFESSIONAL ────────────────────────────────────────────────────
function StepProfessional({ selected, serviceId, onSelect }:{ selected:string|null; serviceId:string|null; onSelect:(id:string)=>void }) {
  const C = useC();
  const service = SERVICES.find(s=>s.id===serviceId);
  const available = serviceId?PROFESSIONALS.filter(p=>service?.ids.includes(p.id)):PROFESSIONALS;
  return (
    <motion.div {...fadeUp()}>
      <Header title="Our Professionals" sub={service?`Specialists for ${service.name}`:"Choose your doctor"}/>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {available.map((p,i) => {
          const active=selected===p.id;
          return (
            <motion.div key={p.id} {...fadeUp(i*0.05)}>
              <Card selected={active} onClick={() => onSelect(p.id)}>
                <div style={{ padding:22, display:"flex", alignItems:"center", gap:20 }}>
                  <div style={{ width:60, height:60, borderRadius:"50%", background:p.gradient, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:C.font, fontSize:p.id==="any"?22:15, fontWeight:700, color:"#fff", boxShadow:C.shadow }}>
                    {p.initials}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:C.font, fontWeight:700, fontSize:16, color:C.text, marginBottom:3 }}>{p.name}</div>
                    <div style={{ fontFamily:C.font, fontSize:13, color:C.accent, fontWeight:500, marginBottom:p.rating?6:0 }}>{p.specialty}</div>
                    {p.rating>0&&<StarRating rating={p.rating}/>}
                    {p.bio&&<div style={{ fontFamily:C.font, fontSize:12, color:C.textSub, marginTop:8, lineHeight:1.5 }}>{p.bio}</div>}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                    {p.exp&&<div style={{ fontFamily:C.font, fontSize:11, fontWeight:600, color:C.textSub, background:C.surface2, padding:"4px 10px", borderRadius:20, border:`1px solid ${C.border}` }}>{p.exp}</div>}
                    {active&&<div style={{ width:24, height:24, borderRadius:"50%", background:C.accent, display:"flex", alignItems:"center", justifyContent:"center" }}><Check size={13} color="#fff" strokeWidth={3}/></div>}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── STEP 3 — DATE & TIME ─────────────────────────────────────────────────────
function StepDateTime({ profId, date, time, onDate, onTime }:{ profId:string|null; date:Date|null; time:string|null; onDate:(d:Date)=>void; onTime:(t:string)=>void }) {
  const C = useC();
  const [month, setMonth] = useState(() => { const d=new Date(); d.setDate(1); return d; });
  const days = useMemo(() => eachDayOfInterval({ start:startOfWeek(startOfMonth(month)), end:endOfWeek(endOfMonth(month)) }), [month]);
  const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const dateStr = date ? format(date,"yyyy-MM-dd") : null;
  const { data:occupiedSlots=[], isFetching } = useQuery({
    queryKey: ["slots", profId, dateStr],
    queryFn:  () => getOccupiedSlotsFn({ doctorId:profId!, date:dateStr! }),
    enabled:  !!profId && !!dateStr && profId!=="any",
    staleTime: 30_000,
  });

  return (
    <motion.div {...fadeUp()} style={{ display:"flex", gap:32, flexWrap:"wrap", alignItems:"flex-start" }}>
      <div style={{ flex:"1 1 320px" }}>
        <Header title="Pick a Date" sub="Available weekdays only"/>
        <Card>
          <div style={{ padding:26 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <button onClick={() => setMonth(subMonths(month,1))} style={navBtnStyle(C)}><ChevronLeft size={15} color={C.textSub}/></button>
              <span style={{ fontFamily:C.font, fontWeight:700, fontSize:16, color:C.text }}>{format(month,"MMMM yyyy")}</span>
              <button onClick={() => setMonth(addMonths(month,1))} style={navBtnStyle(C)}><ChevronRight size={15} color={C.textSub}/></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:8 }}>
              {DAY_LABELS.map(d=><div key={d} style={{ fontFamily:C.font, fontSize:11, fontWeight:600, color:C.textMuted, textAlign:"center" }}>{d}</div>)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
              {days.map((day,i) => {
                const inMonth=isSameMonth(day,month), avail=isAvailable(day,month);
                const isNow=isSameDay(day,new Date()), sel=date&&isSameDay(day,date);
                return (
                  <button key={i} disabled={!avail} onClick={() => avail&&onDate(day)}
                    style={{ height:40, borderRadius:10, fontFamily:C.font, fontSize:13, fontWeight:isNow?700:400, cursor:avail?"pointer":"default", outline:"none", border:sel?"none":isNow?`1.5px solid ${C.accent}`:"1px solid transparent", background:sel?C.accent:isNow&&!sel?C.accentDim:"transparent", color:!inMonth?C.textMuted:sel?"#fff":avail?C.text:C.surface4, opacity:!inMonth?0.3:1, transition:"all 0.15s", boxShadow:sel?`0 2px 8px ${C.accentGlow}`:"none" }}>
                    {format(day,"d")}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
      <div style={{ flex:"0 0 210px" }}>
        <Header title="Pick a Time" sub={date?format(date,"EEE, MMM d"):"Select a date first"}/>
        {isFetching&&<div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, fontFamily:C.font, fontSize:12, color:C.textSub }}><Loader2 size={13} color={C.accent} style={{ animation:"spin 1s linear infinite" }}/> Checking…</div>}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {ALL_SLOTS.map(slot => {
            const taken=occupiedSlots.includes(slot), sel=time===slot, dis=taken||!date;
            return (
              <button key={slot} disabled={dis} onClick={() => !dis&&onTime(slot)}
                style={{ padding:"12px 16px", borderRadius:12, fontFamily:C.font, fontSize:13, fontWeight:500, cursor:dis?"default":"pointer", outline:"none", display:"flex", justifyContent:"space-between", alignItems:"center", background:sel?C.accent:C.surface, border:`1.5px solid ${sel?C.accent:C.border}`, color:dis?C.textMuted:sel?"#fff":C.text, opacity:taken?0.35:1, transition:"all 0.15s", boxShadow:sel?`0 2px 8px ${C.accentGlow}`:C.shadow }}>
                <span>{slot}</span>
                {taken&&<span style={{ fontSize:10, color:C.textMuted }}>Taken</span>}
                {sel&&<Check size={13} color="#fff" strokeWidth={3}/>}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── STEP 4 — PATIENT INFO ────────────────────────────────────────────────────
function StepPatient({ patient, onChange, showErrors }:{ patient:Patient; onChange:(p:Patient)=>void; showErrors:boolean }) {
  const C = useC();
  const [focused, setFocused] = useState<keyof Patient|null>(null);

  const setField = (key:keyof Patient) => (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const val = key==="phone" ? maskPhone(e.target.value) : e.target.value;
    onChange({...patient,[key]:val});
  };

  const errors: Record<string, boolean> = showErrors ? {
    name:  !patient.name.trim(),
    phone: !isValidPhone(patient.phone),
    email: !isValidEmail(patient.email),
  } : {};

  const fieldStyle = (key: keyof Patient): React.CSSProperties => ({
    width:"100%", boxSizing:"border-box", padding:"13px 16px",
    background: C.surface,
    border: `1.5px solid ${errors[key] ? C.danger : focused===key ? C.accent : C.border}`,
    borderRadius:12, fontFamily:C.font, fontSize:15, color:C.text, outline:"none",
    boxShadow: errors[key] ? `0 0 0 3px ${C.dangerDim}` : focused===key ? `0 0 0 3px ${C.accentDim}` : `inset 0 1px 2px rgba(0,0,0,0.04)`,
    transition:"all 0.2s",
  });

  return (
    <motion.div {...fadeUp()}>
      <Header title="Your Information" sub="We'll send your confirmation via WhatsApp"/>
      <div style={{ maxWidth:520, display:"flex", flexDirection:"column", gap:18 }}>
        {([
          ["name",  "Full Name",        <User  size={14} color={C.textSub}/>, "Jane Smith",          "text"  ],
          ["phone", "WhatsApp / Phone", <Phone size={14} color={C.textSub}/>, "+1 (305) 000-0000",  "tel"   ],
          ["email", "Email Address",    <Mail  size={14} color={C.textSub}/>, "jane@email.com",      "email" ],
        ] as [keyof Patient, string, React.ReactNode, string, string][]).map(([key,label,icon,ph,type]) => (
          <div key={key}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {icon}
                <label style={{ fontFamily:C.font, fontSize:12, fontWeight:600, color:C.textSub, letterSpacing:"0.06em", textTransform:"uppercase" }}>{label}</label>
              </div>
              {errors[key]&&<span style={{ fontFamily:C.font, fontSize:11, color:C.danger }}>Required</span>}
            </div>
            <input type={type} value={patient[key]} placeholder={ph}
              onFocus={()=>setFocused(key)} onBlur={()=>setFocused(null)}
              onChange={setField(key)} style={fieldStyle(key)}/>
          </div>
        ))}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <FileText size={14} color={C.textSub}/>
            <label style={{ fontFamily:C.font, fontSize:12, fontWeight:600, color:C.textSub, letterSpacing:"0.06em", textTransform:"uppercase" }}>Notes (optional)</label>
          </div>
          <textarea value={patient.notes} placeholder="Allergies, concerns, last visit info…" rows={4}
            onFocus={()=>setFocused("notes")} onBlur={()=>setFocused(null)}
            onChange={setField("notes")}
            style={{ ...fieldStyle("notes"), resize:"vertical", height:"auto" }}/>
        </div>
      </div>
    </motion.div>
  );
}

// ─── STEP 5 — SUMMARY & CONFIRM ───────────────────────────────────────────────
function StepSummary({ service, prof, date, time, patient, onConfirm, confirmedApt, submitting, error }:{
  service?:ServiceObj; prof?:ProfessionalObj; date:Date|null; time:string|null; patient:Patient;
  onConfirm:()=>void; confirmedApt:Appointment|null; submitting:boolean; error:string|null;
}) {
  const C = useC();

  if (confirmedApt) {
    return (
      <motion.div {...fadeUp()} style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:20 }}>
        <div style={{ fontFamily:C.font, fontSize:15, color:C.success, fontWeight:600, marginBottom:28, display:"flex", alignItems:"center", gap:8 }}>
          <CheckCircle2 size={18}/> Appointment saved successfully!
        </div>
        <TicketCard appointment={confirmedApt} onBookAnother={() => window.location.reload()}/>
      </motion.div>
    );
  }

  const rows = [
    { label:"Service",  value:service?.name,                                  icon:<Shield      size={14} color={service?.color}/> },
    { label:"Duration", value:service?.duration+" min",                       icon:<Clock       size={14} color={C.textSub}/>      },
    { label:"Doctor",   value:prof?.id==="any"?"Any Available":prof?.name,    icon:<User        size={14} color={C.textSub}/>      },
    { label:"Date",     value:date?format(date,"EEEE, MMMM d, yyyy"):"—",    icon:<CalendarDays size={14} color={C.textSub}/>     },
    { label:"Time",     value:time??"—",                                       icon:<Clock       size={14} color={C.textSub}/>      },
    { label:"Patient",  value:patient.name||"—",                              icon:<User        size={14} color={C.textSub}/>      },
    { label:"Phone",    value:patient.phone||"—",                             icon:<Phone       size={14} color={C.textSub}/>      },
    { label:"Email",    value:patient.email||"—",                             icon:<Mail        size={14} color={C.textSub}/>      },
  ];

  const waMsg = encodeURIComponent(`Hi! Booking ${service?.name} on ${date?format(date,"MMMM d, yyyy"):""} at ${time}.\nName: ${patient.name}\nPhone: ${patient.phone}`);

  return (
    <motion.div {...fadeUp()}>
      <Header title="Booking Summary" sub="Review your details before confirming"/>
      <div style={{ maxWidth:580 }}>
        <div style={{ background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.shadow }}>
          <div style={{ padding:8 }}>
            {rows.map((row,i) => (
              <div key={row.label} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 20px", borderBottom:i<rows.length-1?`1px solid ${C.border}`:"none" }}>
                <div style={{ width:28, flexShrink:0 }}>{row.icon}</div>
                <div style={{ fontFamily:C.font, fontSize:12, color:C.textMuted, width:80, flexShrink:0, fontWeight:500 }}>{row.label}</div>
                <div style={{ fontFamily:C.font, fontSize:14, color:C.text, fontWeight:500 }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {patient.notes&&(
          <div style={{ marginTop:14, padding:"16px 20px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, boxShadow:C.shadow }}>
            <div style={{ fontFamily:C.font, fontSize:10, fontWeight:700, color:C.textMuted, marginBottom:8, letterSpacing:"0.1em", textTransform:"uppercase" }}>Notes</div>
            <div style={{ fontFamily:C.font, fontSize:14, color:C.text, lineHeight:1.6 }}>{patient.notes}</div>
          </div>
        )}

        {error&&(
          <motion.div {...fadeUp()} style={{ marginTop:14, padding:"14px 18px", background:C.dangerDim, border:`1px solid ${C.danger}33`, borderRadius:14, display:"flex", alignItems:"center", gap:10 }}>
            <AlertTriangle size={16} color={C.danger} style={{ flexShrink:0 }}/>
            <span style={{ fontFamily:C.font, fontSize:13, color:C.danger }}>{error}</span>
          </motion.div>
        )}

        <div style={{ marginTop:28, display:"flex", gap:12 }}>
          <motion.button onClick={onConfirm} disabled={submitting}
            whileHover={!submitting?{ scale:1.02 }:{}} whileTap={!submitting?{ scale:0.98 }:{}}
            style={{ flex:1, padding:"16px 28px", borderRadius:14, background:submitting?C.surface3:C.accent, border:"none", color:submitting?C.textMuted:"#fff", fontFamily:C.font, fontSize:15, fontWeight:700, cursor:submitting?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:!submitting?`0 4px 20px ${C.accentGlow}`:"none", transition:"all 0.2s" }}>
            {submitting?<><Loader2 size={18} style={{ animation:"spin 1s linear infinite" }}/> Saving…</>:<><CheckCircle2 size={18}/> Confirm Appointment</>}
          </motion.button>
          <motion.a href={`https://wa.me/${WHATSAPP_NUM}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
            style={{ padding:"16px 20px", borderRadius:14, background:"#25D366", color:"#fff", fontFamily:C.font, fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:8, textDecoration:"none", whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(37,211,102,0.3)" }}>
            <MessageCircle size={18}/> WhatsApp
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── LOYALTY CARD ─────────────────────────────────────────────────────────────
const CARE_JOURNEY = [
  { label:"Appointment Booked",        done:true,  active:false },
  { label:"Clinic Confirmation",       done:false, active:true  },
  { label:"Your Visit",                done:false, active:false },
  { label:"Post-Care Follow-up",       done:false, active:false },
];

function LoyaltyCard({ service }:{ service?:ServiceObj }) {
  const C = useC();
  const total = CARE_JOURNEY.length;
  const completed = CARE_JOURNEY.filter(s=>s.done).length;
  const pct = Math.round((completed / total) * 100);

  return (
    <motion.div {...fadeUp(0.2)} style={{ maxWidth:580, marginTop:28 }}>
      <div style={{ background:C.surface, borderRadius:18, border:`1px solid ${C.border}`, padding:"24px 28px", boxShadow:C.shadow }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div>
            <div style={{ fontFamily:C.font, fontWeight:700, fontSize:16, color:C.text }}>Your Care Journey</div>
            <div style={{ fontFamily:C.font, fontSize:12, color:C.textSub, marginTop:3 }}>
              {service ? `${service.name} treatment plan` : "Treatment plan"}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:C.font, fontWeight:700, fontSize:22, color:C.accent }}>{pct}%</div>
            <div style={{ fontFamily:C.font, fontSize:11, color:C.textMuted }}>complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height:8, background:C.surface3, borderRadius:99, overflow:"hidden", marginBottom:22 }}>
          <motion.div
            initial={{ width:0 }}
            animate={{ width:`${pct}%` }}
            transition={{ duration:0.9, ease:[0.25,0.1,0.25,1], delay:0.3 }}
            style={{ height:"100%", background:`linear-gradient(90deg, ${C.accent}, #5856D6)`, borderRadius:99 }}
          />
        </div>

        {/* Steps */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {CARE_JOURNEY.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                background: s.done ? C.accent : s.active ? C.accentDim : C.surface3,
                border: `1.5px solid ${s.done ? C.accent : s.active ? C.accent : C.border}`,
                boxShadow: s.done || s.active ? `0 2px 8px ${C.accentGlow}` : "none",
              }}>
                {s.done
                  ? <Check size={13} color="#fff" strokeWidth={3}/>
                  : s.active
                    ? <motion.div animate={{ scale:[1,1.2,1] }} transition={{ repeat:Infinity, duration:1.6, ease:"easeInOut" }} style={{ width:8, height:8, borderRadius:"50%", background:C.accent }}/>
                    : <div style={{ width:8, height:8, borderRadius:"50%", background:C.surface4 }}/>
                }
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:C.font, fontSize:13, fontWeight:s.done||s.active?600:400, color:s.done?C.text:s.active?C.accent:C.textMuted }}>
                  {s.label}
                </div>
                {s.active && <div style={{ fontFamily:C.font, fontSize:11, color:C.textSub, marginTop:1 }}>In progress — typically within 2 hours</div>}
              </div>
              {s.done && <span style={{ fontFamily:C.font, fontSize:10, color:C.success, fontWeight:700, background:C.successDim, padding:"3px 8px", borderRadius:20 }}>DONE</span>}
              {s.active && <span style={{ fontFamily:C.font, fontSize:10, color:C.accent, fontWeight:700, background:C.accentDim, padding:"3px 8px", borderRadius:20 }}>NOW</span>}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};
const slideTransition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] };

export default function DentalScheduler() {
  const scheme = useColorScheme();
  const C      = getColors(scheme);

  const [step,         setStep]         = useState(1);
  const [dir,          setDir]          = useState(1);   // slide direction: 1=forward, -1=backward
  const [svcId,        setSvcId]        = useState<string|null>(null);
  const [profId,       setProfId]       = useState<string|null>(null);
  const [date,         setDate]         = useState<Date|null>(null);
  const [time,         setTime]         = useState<string|null>(null);
  const [patient,      setPatient]      = useState<Patient>({ name:"", phone:"", email:"", notes:"" });
  const [confirmedApt, setConfirmedApt] = useState<Appointment|null>(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState<string|null>(null);
  const [showErrors,   setShowErrors]   = useState(false);
  const [shake,        setShake]        = useState(false);
  const [gcalMsg,      setGcalMsg]      = useState("");

  const service = SERVICES.find(s=>s.id===svcId);
  const prof    = PROFESSIONALS.find(p=>p.id===profId);

  const canNext: Record<number,boolean> = {
    1: !!svcId,
    2: !!profId,
    3: !!date&&!!time,
    4: !!patient.name.trim()&&isValidPhone(patient.phone)&&isValidEmail(patient.email),
    5: true,
  };

  function goForward() { setDir(1); setStep(s=>s+1); setShowErrors(false); setError(null); }
  function goBack()    { setDir(-1); setStep(s=>Math.max(1,s-1)); setShowErrors(false); setError(null); }

  function tryNext() {
    if (canNext[step]) { goForward(); }
    else {
      setShowErrors(true);
      setShake(true);
      setTimeout(()=>setShake(false), 600);
    }
  }

  function syncGoogleCalendar() {
    setGcalMsg("syncing");
    setTimeout(() => setGcalMsg("done"), 900);
    setTimeout(() => setGcalMsg(""), 4000);
  }

  async function handleConfirm() {
    if (!service||!prof||!date||!time) return;
    setSubmitting(true); setError(null);
    try {
      const result = await createAppointmentFn({
        patientName: patient.name, patientPhone: patient.phone,
        patientEmail: patient.email,
        doctorId:   prof.id==="any"?"sarah":prof.id,
        doctorName: prof.id==="any"?"Any Available":prof.name,
        serviceId:  service.id, serviceName: service.name,
        date: format(date,"yyyy-MM-dd"), time,
        duration: service.duration, notes: patient.notes,
      });
      if (result.ok) setConfirmedApt(result.appointment);
      else setError(result.error);
    } catch(e) { setError("Unexpected error. Please try again."); console.error(e); }
    finally { setSubmitting(false); }
  }

  return (
    <ThemeCtx.Provider value={C}>
      {/* Google Calendar toast */}
      <AnimatePresence>
        {gcalMsg && (
          <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
            style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", zIndex:9999, background:"#1D1D1F", color:"#fff", fontFamily:C.font, fontSize:13, fontWeight:500, padding:"12px 22px", borderRadius:40, boxShadow:"0 8px 32px rgba(0,0,0,0.3)", display:"flex", alignItems:"center", gap:10 }}>
            {gcalMsg==="syncing"
              ? <><Loader2 size={14} style={{ animation:"spin 1s linear infinite" }}/> Syncing with Google Calendar…</>
              : <>✅ Event added! Google Calendar integration launching soon.</>}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
        <Sidebar step={step} service={service} prof={prof} date={date} time={time} patient={patient}/>
        <main style={{ flex:1, padding:"52px 60px", overflowY:"auto" }}>
          <AnimatePresence mode="wait" custom={dir}>
            {step===1&&(
              <motion.div key="1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}>
                <StepService selected={svcId} onSelect={id=>{setSvcId(id);setProfId(null);}}/>
              </motion.div>
            )}
            {step===2&&(
              <motion.div key="2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}>
                <StepProfessional selected={profId} serviceId={svcId} onSelect={setProfId}/>
              </motion.div>
            )}
            {step===3&&(
              <motion.div key="3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}>
                <StepDateTime profId={profId} date={date} time={time} onDate={d=>{setDate(d);setTime(null);}} onTime={setTime}/>
              </motion.div>
            )}
            {step===4&&(
              <motion.div key="4" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}>
                <StepPatient patient={patient} onChange={setPatient} showErrors={showErrors}/>
              </motion.div>
            )}
            {step===5&&(
              <motion.div key="5" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}>
                <StepSummary service={service} prof={prof} date={date} time={time} patient={patient} confirmedApt={confirmedApt} submitting={submitting} error={error} onConfirm={handleConfirm}/>
                {/* Loyalty + GCal shown after successful booking */}
                {confirmedApt && (
                  <>
                    <LoyaltyCard service={service}/>
                    <motion.div {...fadeUp(0.4)} style={{ maxWidth:580, marginTop:16 }}>
                      <motion.button onClick={syncGoogleCalendar}
                        whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"14px 24px", borderRadius:14, background:C.surface, border:`1.5px solid ${C.border}`, color:C.text, fontFamily:C.font, fontSize:14, fontWeight:600, cursor:"pointer", boxShadow:C.shadow }}>
                        <CalendarDays size={18} color="#4285F4"/>{" "}Add to Google Calendar
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!confirmedApt && (
            <motion.div
              animate={shake?{ x:[0,-8,8,-6,6,-4,4,0] }:{}}
              transition={{ duration:0.5 }}
              style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:48, paddingTop:32, borderTop:`1px solid ${C.border}` }}
            >
              <motion.button onClick={goBack} disabled={step===1}
                whileHover={step>1?{ scale:1.02 }:{}} whileTap={step>1?{ scale:0.98 }:{}}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 22px", borderRadius:12, background:C.surface, border:`1.5px solid ${C.border}`, color:step===1?C.textMuted:C.textSub, fontFamily:C.font, fontSize:14, fontWeight:500, cursor:step===1?"default":"pointer", opacity:step===1?0.4:1, boxShadow:C.shadow }}>
                <ChevronLeft size={16}/> Back
              </motion.button>
              {step<5&&(
                <motion.button onClick={tryNext}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 32px", borderRadius:12, background:canNext[step]?C.accent:C.danger+"22", border:canNext[step]?"none":`1px solid ${C.danger}44`, color:canNext[step]?"#fff":C.danger, fontFamily:C.font, fontSize:15, fontWeight:700, cursor:"pointer", transition:"all 0.2s", boxShadow:canNext[step]?`0 4px 20px ${C.accentGlow}`:"none" }}>
                  Continue <ArrowRight size={16}/>
                </motion.button>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </ThemeCtx.Provider>
  );
}
