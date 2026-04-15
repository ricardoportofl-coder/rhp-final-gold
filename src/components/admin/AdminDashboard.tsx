import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, CheckCircle2, AlertCircle, XCircle,
  ChevronLeft, ChevronRight, Search, LayoutGrid, List,
  User, Phone, Mail, Edit3, DollarSign, Users, TrendingUp,
  X, Clock, Settings, ArrowUpRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { format, addDays, subDays, startOfWeek,
         eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ThemeCtx, getColors, SERVICE_PRICES } from "@/lib/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import type { Appointment, AppointmentStatus } from "@/lib/dental/types";
import { updateStatusFn, rescheduleFn, populateDemoDataFn } from "@/lib/dental/actions";

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif";

// ─── DOCTORS ──────────────────────────────────────────────────────────────────
const DOCTORS = [
  { id:"sarah",   name:"Dr. Sarah Mitchell", gradient:"linear-gradient(135deg,#007AFF,#5856D6)" },
  { id:"james",   name:"Dr. James Ortega",   gradient:"linear-gradient(135deg,#34C759,#30D158)" },
  { id:"emily",   name:"Dr. Emily Chen",     gradient:"linear-gradient(135deg,#FF9F0A,#FF6B2B)" },
  { id:"michael", name:"Dr. Michael Torres", gradient:"linear-gradient(135deg,#AF52DE,#BF5AF2)" },
];

const ALL_SLOTS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];

// ─── STATUS ───────────────────────────────────────────────────────────────────
const STATUS: Record<AppointmentStatus,{ label:string; color:string; dim:string; icon:React.ElementType }> = {
  pending:   { label:"Pending",   color:"#FF9F0A", dim:"rgba(255,159,10,0.12)",  icon:AlertCircle  },
  confirmed: { label:"Confirmed", color:"#34C759", dim:"rgba(52,199,89,0.12)",   icon:CheckCircle2 },
  cancelled: { label:"Cancelled", color:"#8E8E93", dim:"rgba(142,142,147,0.12)", icon:XCircle      },
};

function StatusBadge({ status }:{ status:AppointmentStatus }) {
  const cfg = STATUS[status];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:20, background:cfg.dim, fontFamily:FONT, fontSize:11, fontWeight:600, color:cfg.color }}>
      <cfg.icon size={10} strokeWidth={2.5}/> {cfg.label}
    </span>
  );
}

// ─── TIMELINE MATH ────────────────────────────────────────────────────────────
const DAY_START = 8 * 60;
const PX_PER_MIN = 2;
const TIMELINE_H = 10 * 60 * PX_PER_MIN; // 8AM–6PM

function timeTop(t:string) { return (parseInt(t)*60+parseInt(t.split(":")[1]) - DAY_START)*PX_PER_MIN; }
const HOUR_MARKS = Array.from({length:11},(_,i)=>({ h:8+i, top:(i*60*PX_PER_MIN) }));

// ─── RESCHEDULE MODAL ─────────────────────────────────────────────────────────
function RescheduleModal({ apt, onClose, onSave }:{ apt:Appointment; onClose:()=>void; onSave:(newDate:string,newTime:string)=>Promise<void> }) {
  const [newDate, setNewDate] = useState(apt.date);
  const [newTime, setNewTime] = useState(apt.time);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState("");

  async function handleSave() {
    setSaving(true); setErr("");
    try { await onSave(newDate, newTime); onClose(); }
    catch(e:any) { setErr(e.message ?? "Error saving."); }
    finally { setSaving(false); }
  }

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.92,y:16 }} animate={{ scale:1,y:0 }} exit={{ scale:0.92,y:16 }}
        style={{ background:"#FFFFFF", borderRadius:20, padding:32, width:400, boxShadow:"0 24px 80px rgba(0,0,0,0.2)", position:"relative" }}
        onClick={e=>e.stopPropagation()}>

        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"#F5F5F7", border:"none", width:30, height:30, borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <X size={15} color="#6E6E73"/>
        </button>

        <div style={{ fontFamily:FONT, fontWeight:700, fontSize:18, color:"#1D1D1F", marginBottom:4 }}>Reschedule Appointment</div>
        <div style={{ fontFamily:FONT, fontSize:13, color:"#6E6E73", marginBottom:24 }}>{apt.patientName} · {apt.serviceName}</div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ fontFamily:FONT, fontSize:11, fontWeight:600, color:"#6E6E73", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:8 }}>New Date</label>
            <input type="date" value={newDate} min={format(new Date(),"yyyy-MM-dd")} onChange={e=>setNewDate(e.target.value)}
              style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px", borderRadius:12, border:"1.5px solid rgba(0,0,0,0.12)", fontFamily:FONT, fontSize:14, color:"#1D1D1F", outline:"none" }}/>
          </div>

          <div>
            <label style={{ fontFamily:FONT, fontSize:11, fontWeight:600, color:"#6E6E73", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:8 }}>New Time</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
              {ALL_SLOTS.map(slot => (
                <button key={slot} onClick={()=>setNewTime(slot)}
                  style={{ padding:"8px 4px", borderRadius:10, border:`1.5px solid ${newTime===slot?"#007AFF":"rgba(0,0,0,0.1)"}`, background:newTime===slot?"rgba(0,122,255,0.1)":"#FFFFFF", color:newTime===slot?"#007AFF":"#1D1D1F", fontFamily:FONT, fontSize:12, fontWeight:newTime===slot?600:400, cursor:"pointer" }}>
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {err&&<div style={{ marginTop:12, fontFamily:FONT, fontSize:12, color:"#FF3B30", padding:"10px 14px", background:"rgba(255,59,48,0.08)", borderRadius:10 }}>{err}</div>}

        <div style={{ display:"flex", gap:10, marginTop:24 }}>
          <button onClick={handleSave} disabled={saving}
            style={{ flex:1, padding:"13px", borderRadius:12, background:saving?"#E8E8ED":"#007AFF", border:"none", color:saving?"#AEAEB2":"#FFFFFF", fontFamily:FONT, fontSize:14, fontWeight:700, cursor:saving?"default":"pointer" }}>
            {saving?"Saving…":"Reschedule"}
          </button>
          <button onClick={onClose} style={{ padding:"13px 20px", borderRadius:12, background:"#F5F5F7", border:"none", color:"#6E6E73", fontFamily:FONT, fontSize:14, cursor:"pointer" }}>Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── DAY VIEW ─────────────────────────────────────────────────────────────────
function DayView({ appointments, selectedDate, onDateChange, onStatusChange, onReschedule }:{
  appointments:Appointment[]; selectedDate:Date; onDateChange:(d:Date)=>void;
  onStatusChange:(id:string,s:AppointmentStatus)=>void; onReschedule:(apt:Appointment)=>void;
}) {
  const [popover, setPopover] = useState<string|null>(null);
  const dateStr = format(selectedDate,"yyyy-MM-dd");
  const dayApts = appointments.filter(a=>a.date===dateStr);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <NBtn onClick={()=>onDateChange(subDays(selectedDate,1))}><ChevronLeft size={15} color="#6E6E73"/></NBtn>
          <div>
            <div style={{ fontFamily:FONT, fontWeight:700, fontSize:20, color:"#1D1D1F" }}>{format(selectedDate,"EEEE, MMMM d")}</div>
            <div style={{ fontFamily:FONT, fontSize:12, color:"#6E6E73" }}>{dayApts.filter(a=>a.status!=="cancelled").length} active appointments</div>
          </div>
          <NBtn onClick={()=>onDateChange(addDays(selectedDate,1))}><ChevronRight size={15} color="#6E6E73"/></NBtn>
        </div>
        <button onClick={()=>onDateChange(new Date())} style={{ padding:"7px 16px", borderRadius:10, background:"rgba(0,122,255,0.1)", border:"none", color:"#007AFF", fontFamily:FONT, fontSize:13, fontWeight:600, cursor:"pointer" }}>Today</button>
      </div>

      <div style={{ overflowX:"auto" }}>
        <div style={{ display:"flex", minWidth:DOCTORS.length*210+60 }}>
          {/* Ruler */}
          <div style={{ width:60, flexShrink:0, paddingTop:56, position:"relative", height:TIMELINE_H+56 }}>
            {HOUR_MARKS.map(m=>(
              <div key={m.h} style={{ position:"absolute", top:56+m.top-8, right:6, fontFamily:FONT, fontSize:10, color:"#AEAEB2", whiteSpace:"nowrap" }}>
                {m.h<=12?`${m.h} AM`:m.h===12?`12 PM`:`${m.h-12} PM`}
              </div>
            ))}
          </div>

          {DOCTORS.map(doc=>{
            const docApts=dayApts.filter(a=>a.doctorId===doc.id);
            return (
              <div key={doc.id} style={{ flex:1, minWidth:200, borderLeft:"1px solid rgba(0,0,0,0.06)" }}>
                {/* Header */}
                <div style={{ height:56, display:"flex", alignItems:"center", gap:10, padding:"0 12px", borderBottom:"1px solid rgba(0,0,0,0.06)", background:"#FFFFFF" }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:doc.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }}>
                    {doc.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <div style={{ fontFamily:FONT, fontSize:12, fontWeight:600, color:"#1D1D1F" }}>{doc.name.split(" ").slice(-1)[0]}</div>
                    <div style={{ fontFamily:FONT, fontSize:10, color:"#8E8E93" }}>{docApts.filter(a=>a.status!=="cancelled").length} booked</div>
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ position:"relative", height:TIMELINE_H, background:"#F5F5F7" }}>
                  {HOUR_MARKS.map(m=><div key={m.h} style={{ position:"absolute", top:m.top, left:0, right:0, height:1, background:"rgba(0,0,0,0.05)" }}/>)}

                  {docApts.map(apt=>{
                    const cfg=STATUS[apt.status];
                    const h=Math.max(apt.duration*PX_PER_MIN-4,44);
                    const open=popover===apt.id;
                    return (
                      <div key={apt.id} style={{ position:"absolute", top:timeTop(apt.time), left:4, right:4, height:h, background:apt.status==="cancelled"?"rgba(142,142,147,0.08)":"#FFFFFF", border:`1.5px solid ${cfg.color}22`, borderLeft:`3px solid ${cfg.color}`, borderRadius:10, padding:"6px 10px", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", zIndex:open?20:1, overflow:"hidden" }}
                        onClick={()=>setPopover(open?null:apt.id)}>
                        <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:"#1D1D1F", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{apt.patientName}</div>
                        {h>50&&<div style={{ fontFamily:FONT, fontSize:10, color:"#6E6E73", marginTop:1 }}>{apt.time} · {apt.serviceName}</div>}
                        {h>70&&<StatusBadge status={apt.status}/>}

                        <AnimatePresence>
                          {open&&(
                            <motion.div initial={{ opacity:0,scale:0.94,y:-4 }} animate={{ opacity:1,scale:1,y:0 }} exit={{ opacity:0,scale:0.94,y:-4 }}
                              style={{ position:"absolute", top:"calc(100% + 6px)", left:0, zIndex:50, width:240, background:"#FFFFFF", border:"1px solid rgba(0,0,0,0.08)", borderRadius:14, padding:16, boxShadow:"0 8px 32px rgba(0,0,0,0.12)" }}
                              onClick={e=>e.stopPropagation()}>
                              <div style={{ fontFamily:FONT, fontWeight:700, fontSize:14, color:"#1D1D1F", marginBottom:4 }}>{apt.patientName}</div>
                              <div style={{ fontFamily:FONT, fontSize:12, color:"#6E6E73", marginBottom:8 }}>{apt.serviceName} · {apt.time}</div>
                              <div style={{ fontFamily:FONT, fontSize:12, color:"#6E6E73", marginBottom:4 }}>{apt.patientPhone}</div>
                              <StatusBadge status={apt.status}/>
                              <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
                                {apt.status==="pending"&&<AB label="Confirm" color="#34C759" onClick={()=>{onStatusChange(apt.id,"confirmed");setPopover(null);}}/>}
                                {apt.status!=="cancelled"&&<AB label="Reschedule" color="#007AFF" onClick={()=>{onReschedule(apt);setPopover(null);}}/>}
                                {apt.status!=="cancelled"&&<AB label="Cancel" color="#FF3B30" onClick={()=>{onStatusChange(apt.id,"cancelled");setPopover(null);}}/>}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                  {docApts.length===0&&<div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", fontFamily:FONT, fontSize:12, color:"#AEAEB2" }}>Free day</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NBtn({ children, onClick }:{ children:React.ReactNode; onClick:()=>void }) {
  return <button onClick={onClick} style={{ width:34,height:34,borderRadius:10,background:"#FFFFFF",border:"1px solid rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",outline:"none",boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>{children}</button>;
}

function AB({ label,color,onClick }:{ label:string;color:string;onClick:()=>void }) {
  return <button onClick={onClick} style={{ flex:1,padding:"7px 10px",borderRadius:8,background:`${color}15`,border:`1px solid ${color}33`,color,fontFamily:FONT,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }}>{label}</button>;
}

// ─── WEEK VIEW ────────────────────────────────────────────────────────────────
function WeekView({ appointments, selectedDate, onDateChange, onStatusChange, onReschedule }:{
  appointments:Appointment[]; selectedDate:Date; onDateChange:(d:Date)=>void;
  onStatusChange:(id:string,s:AppointmentStatus)=>void; onReschedule:(apt:Appointment)=>void;
}) {
  const weekStart=startOfWeek(selectedDate,{weekStartsOn:1});
  const days=eachDayOfInterval({start:weekStart,end:addDays(weekStart,4)});

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <NBtn onClick={()=>onDateChange(subDays(selectedDate,7))}><ChevronLeft size={15} color="#6E6E73"/></NBtn>
        <div style={{ fontFamily:FONT, fontWeight:700, fontSize:18, color:"#1D1D1F" }}>
          {format(weekStart,"MMM d")} – {format(addDays(weekStart,4),"MMM d, yyyy")}
        </div>
        <NBtn onClick={()=>onDateChange(addDays(selectedDate,7))}><ChevronRight size={15} color="#6E6E73"/></NBtn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
        {days.map(day=>{
          const ds=format(day,"yyyy-MM-dd");
          const dayApts=appointments.filter(a=>a.date===ds);
          const now=isToday(day);
          return (
            <div key={ds} style={{ background:"#FFFFFF", border:`1.5px solid ${now?"#007AFF":"rgba(0,0,0,0.08)"}`, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(0,0,0,0.06)", background:now?"rgba(0,122,255,0.06)":"#FFFFFF", cursor:"pointer" }} onClick={()=>onDateChange(day)}>
                <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, color:now?"#007AFF":"#8E8E93", textTransform:"uppercase", letterSpacing:"0.08em" }}>{format(day,"EEE")}</div>
                <div style={{ fontFamily:FONT, fontSize:22, fontWeight:700, color:now?"#007AFF":"#1D1D1F", letterSpacing:"-0.02em" }}>{format(day,"d")}</div>
                <div style={{ fontFamily:FONT, fontSize:11, color:"#AEAEB2", marginTop:2 }}>{dayApts.filter(a=>a.status!=="cancelled").length} apt{dayApts.filter(a=>a.status!=="cancelled").length!==1?"s":""}</div>
              </div>
              <div style={{ padding:10, display:"flex", flexDirection:"column", gap:6, minHeight:80 }}>
                {dayApts.length===0&&<div style={{ fontFamily:FONT, fontSize:11, color:"#AEAEB2", textAlign:"center", paddingTop:14 }}>Free</div>}
                {dayApts.map(apt=>{
                  const cfg=STATUS[apt.status];
                  return (
                    <div key={apt.id} style={{ padding:"8px 10px", borderRadius:10, background:cfg.dim, borderLeft:`3px solid ${cfg.color}` }}>
                      <div style={{ fontFamily:FONT, fontSize:12, fontWeight:600, color:"#1D1D1F" }}>{apt.time} · {apt.patientName}</div>
                      <div style={{ fontFamily:FONT, fontSize:10, color:"#6E6E73", marginTop:2 }}>{apt.serviceName}</div>
                      {apt.status!=="cancelled"&&(
                        <button onClick={()=>onReschedule(apt)} style={{ marginTop:6, background:"none", border:"none", color:"#007AFF", fontFamily:FONT, fontSize:10, fontWeight:600, cursor:"pointer", padding:0 }}>
                          <Edit3 size={10} style={{ display:"inline",marginRight:3 }}/>Reschedule
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PATIENT LIST ─────────────────────────────────────────────────────────────
function PatientList({ appointments, onStatusChange, onReschedule }:{
  appointments:Appointment[]; onStatusChange:(id:string,s:AppointmentStatus)=>void; onReschedule:(apt:Appointment)=>void;
}) {
  const [search, setSearch] = useState("");
  const filtered = appointments.filter(a=>
    a.patientName.toLowerCase().includes(search.toLowerCase())||
    a.patientPhone.includes(search)||
    a.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ position:"relative", marginBottom:20, maxWidth:400 }}>
        <Search size={15} color="#AEAEB2" style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patient, service…"
          style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px 11px 40px", borderRadius:12, background:"#FFFFFF", border:"1.5px solid rgba(0,0,0,0.08)", fontFamily:FONT, fontSize:14, color:"#1D1D1F", outline:"none", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}/>
      </div>
      <div style={{ background:"#FFFFFF", borderRadius:16, border:"1px solid rgba(0,0,0,0.08)", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1.2fr 1.2fr 1fr 1fr 180px", padding:"12px 20px", borderBottom:"1px solid rgba(0,0,0,0.06)", background:"#F5F5F7" }}>
          {["Patient","Service","Doctor","Date","Time","Actions"].map(h=>(
            <div key={h} style={{ fontFamily:FONT, fontSize:11, fontWeight:600, color:"#AEAEB2", letterSpacing:"0.08em", textTransform:"uppercase" }}>{h}</div>
          ))}
        </div>
        {filtered.length===0&&<div style={{ padding:40, textAlign:"center", fontFamily:FONT, fontSize:14, color:"#AEAEB2" }}>No appointments found</div>}
        {filtered.map((apt,i)=>(
          <motion.div key={apt.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.02 }}
            style={{ display:"grid", gridTemplateColumns:"2fr 1.2fr 1.2fr 1fr 1fr 180px", padding:"14px 20px", borderBottom:i<filtered.length-1?"1px solid rgba(0,0,0,0.06)":"none", alignItems:"center" }}>
            <div>
              <div style={{ fontFamily:FONT, fontSize:14, fontWeight:600, color:"#1D1D1F" }}>{apt.patientName}</div>
              <div style={{ fontFamily:FONT, fontSize:11, color:"#6E6E73", marginTop:2 }}>{apt.patientPhone}</div>
            </div>
            <div style={{ fontFamily:FONT, fontSize:13, color:"#1D1D1F" }}>{apt.serviceName}</div>
            <div style={{ fontFamily:FONT, fontSize:13, color:"#1D1D1F" }}>{DOCTORS.find(d=>d.id===apt.doctorId)?.name.split(" ").slice(-1)[0]??apt.doctorId}</div>
            <div style={{ fontFamily:FONT, fontSize:13, color:"#1D1D1F" }}>{apt.date}</div>
            <div style={{ fontFamily:FONT, fontSize:13, color:"#1D1D1F" }}>{apt.time}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
              <StatusBadge status={apt.status}/>
              {apt.status==="pending"&&<button onClick={()=>onStatusChange(apt.id,"confirmed")} title="Confirm" style={{ background:"none",border:"none",cursor:"pointer",color:"#34C759",padding:2 }}><CheckCircle2 size={15}/></button>}
              {apt.status!=="cancelled"&&<button onClick={()=>onReschedule(apt)} title="Reschedule" style={{ background:"none",border:"none",cursor:"pointer",color:"#007AFF",padding:2 }}><Edit3 size={15}/></button>}
              {apt.status!=="cancelled"&&<button onClick={()=>onStatusChange(apt.id,"cancelled")} title="Cancel" style={{ background:"none",border:"none",cursor:"pointer",color:"#FF3B30",padding:2 }}><XCircle size={15}/></button>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── DOCTOR COLORS ────────────────────────────────────────────────────────────
const DOC_COLORS: Record<string, string> = {
  sarah:"#007AFF", james:"#34C759", emily:"#FF9F0A", michael:"#AF52DE",
};

// ─── REVENUE TREND CHART ──────────────────────────────────────────────────────
function RevenueChart({ appointments }:{ appointments:Appointment[] }) {
  const data = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const ds = format(d, "yyyy-MM-dd");
      const dayApts = appointments.filter(a => a.date === ds && a.status !== "cancelled");
      const rev = dayApts.reduce((s, a) => s + (SERVICE_PRICES[a.serviceId] ?? 0), 0);
      return { day: format(d, "EEE d"), revenue: rev, count: dayApts.length };
    });
  }, [appointments]);

  const total = data.reduce((s, d) => s + d.revenue, 0);
  const peak  = Math.max(...data.map(d => d.revenue));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {value:number}[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"#1D1D1F", borderRadius:10, padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
        <div style={{ fontFamily:FONT, fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:2 }}>{label}</div>
        <div style={{ fontFamily:FONT, fontSize:16, fontWeight:700, color:"#FFFFFF" }}>${payload[0].value.toLocaleString()}</div>
      </div>
    );
  };

  return (
    <div style={{ background:"#FFFFFF", borderRadius:18, border:"1px solid rgba(0,0,0,0.08)", padding:"22px 28px", boxShadow:"0 1px 4px rgba(0,0,0,0.06),0 4px 12px rgba(0,0,0,0.06)", flex:1 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:FONT, fontWeight:700, fontSize:14, color:"#1D1D1F" }}>Revenue — 7 Day Trend</div>
          <div style={{ fontFamily:FONT, fontSize:12, color:"#6E6E73", marginTop:2 }}>Estimated from booked services</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:FONT, fontSize:22, fontWeight:700, color:"#1D1D1F", letterSpacing:"-0.02em" }}>${total.toLocaleString()}</div>
          <div style={{ display:"flex", alignItems:"center", gap:4, justifyContent:"flex-end", marginTop:2 }}>
            <ArrowUpRight size={12} color="#34C759"/>
            <span style={{ fontFamily:FONT, fontSize:11, color:"#34C759", fontWeight:600 }}>Peak ${peak.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top:4, right:4, left:-20, bottom:0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#007AFF" stopOpacity={0.18}/>
              <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false}/>
          <XAxis dataKey="day" tick={{ fontFamily:FONT, fontSize:11, fill:"#AEAEB2" }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fontFamily:FONT, fontSize:10, fill:"#AEAEB2" }} axisLine={false} tickLine={false} tickFormatter={v=>v===0?"":("$"+v)}/>
          <Tooltip content={<CustomTooltip/>} cursor={{ stroke:"rgba(0,122,255,0.15)", strokeWidth:2 }}/>
          <Area type="monotone" dataKey="revenue" stroke="#007AFF" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r:4, fill:"#007AFF", strokeWidth:2, stroke:"#FFFFFF" }} activeDot={{ r:6, fill:"#007AFF", stroke:"#FFFFFF", strokeWidth:2 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── DOCTOR PRODUCTIVITY CHART ────────────────────────────────────────────────
function DoctorChart({ appointments }:{ appointments:Appointment[] }) {
  const data = useMemo(() => {
    const active = appointments.filter(a => a.status !== "cancelled");
    return DOCTORS.map(doc => {
      const docApts = active.filter(a => a.doctorId === doc.id);
      return {
        name: doc.name.split(" ").slice(-1)[0], // last name
        apts: docApts.length,
        rev:  docApts.reduce((s, a) => s + (SERVICE_PRICES[a.serviceId] ?? 0), 0),
        color: DOC_COLORS[doc.id] ?? "#007AFF",
      };
    }).sort((a, b) => b.apts - a.apts);
  }, [appointments]);

  const topDoc = data[0];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {value:number; payload:{rev:number}}[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"#1D1D1F", borderRadius:10, padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
        <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:"#FFFFFF" }}>Dr. {label}</div>
        <div style={{ fontFamily:FONT, fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:4 }}>{payload[0].value} appointments</div>
        <div style={{ fontFamily:FONT, fontSize:12, color:"#34C759", marginTop:2 }}>${payload[0].payload.rev.toLocaleString()} est. revenue</div>
      </div>
    );
  };

  return (
    <div style={{ background:"#FFFFFF", borderRadius:18, border:"1px solid rgba(0,0,0,0.08)", padding:"22px 28px", boxShadow:"0 1px 4px rgba(0,0,0,0.06),0 4px 12px rgba(0,0,0,0.06)", flex:1 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:FONT, fontWeight:700, fontSize:14, color:"#1D1D1F" }}>Productivity by Doctor</div>
          <div style={{ fontFamily:FONT, fontSize:12, color:"#6E6E73", marginTop:2 }}>Active appointments · excl. cancelled</div>
        </div>
        {topDoc && topDoc.apts > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,159,10,0.1)", borderRadius:20, padding:"4px 12px" }}>
            <span style={{ fontSize:12 }}>⭐</span>
            <span style={{ fontFamily:FONT, fontSize:11, fontWeight:700, color:"#FF9F0A" }}>Dr. {topDoc.name}</span>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top:4, right:4, left:-20, bottom:0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false}/>
          <XAxis dataKey="name" tick={{ fontFamily:FONT, fontSize:11, fill:"#AEAEB2" }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fontFamily:FONT, fontSize:10, fill:"#AEAEB2" }} axisLine={false} tickLine={false} allowDecimals={false}/>
          <Tooltip content={<CustomTooltip/>} cursor={{ fill:"rgba(0,0,0,0.03)", radius:6 }}/>
          <Bar dataKey="apts" radius={[6,6,0,0]}>
            {data.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.9}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── METRIC CARD ──────────────────────────────────────────────────────────────
function MetricCard({ label,value,sub,color,icon:Icon,prefix }:{ label:string;value:number|string;sub:string;color:string;icon:React.ElementType;prefix?:string }) {
  return (
    <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }}
      style={{ background:"#FFFFFF", border:"1px solid rgba(0,0,0,0.08)", borderRadius:18, padding:"20px 24px", display:"flex", alignItems:"flex-start", gap:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06),0 4px 12px rgba(0,0,0,0.06)", flex:1 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={22} color={color}/>
      </div>
      <div>
        <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
          {prefix&&<span style={{ fontFamily:FONT, fontSize:16, fontWeight:600, color:"#6E6E73" }}>{prefix}</span>}
          <span style={{ fontFamily:FONT, fontSize:32, fontWeight:700, color:"#1D1D1F", letterSpacing:"-0.02em", lineHeight:1 }}>{value}</span>
        </div>
        <div style={{ fontFamily:FONT, fontSize:13, color:"#6E6E73", marginTop:4 }}>{label}</div>
        <div style={{ fontFamily:FONT, fontSize:11, color:"#AEAEB2", marginTop:2 }}>{sub}</div>
      </div>
    </motion.div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
type Tab = "day"|"week"|"patients";

export default function AdminDashboard({ initialAppointments }:{ initialAppointments:Appointment[] }) {
  const scheme = useColorScheme();
  const C      = getColors(scheme);

  const [appointments,  setAppointments]  = useState<Appointment[]>(initialAppointments);
  const [selectedDate,  setSelectedDate]  = useState(new Date());
  const [tab,           setTab]           = useState<Tab>("day");
  const [rescheduleApt, setRescheduleApt] = useState<Appointment|null>(null);
  const [demoStatus,    setDemoStatus]    = useState<"idle"|"loading"|"done">("idle");

  const handlePopulateDemo = useCallback(async () => {
    setDemoStatus("loading");
    try {
      const { added } = await populateDemoDataFn();
      // Reload page to reflect new data from server
      alert(`✅ Demo data added: ${added} appointments. Reloading…`);
      window.location.reload();
    } catch(e) {
      console.error(e);
      setDemoStatus("idle");
    }
  }, []);

  const todayStr = format(new Date(),"yyyy-MM-dd");
  const todayApts = appointments.filter(a=>a.date===todayStr);
  const activeToday = todayApts.filter(a=>a.status!=="cancelled");

  // Metrics
  const revenue = activeToday.reduce((sum,a)=>{
    return sum + (SERVICE_PRICES[a.serviceId]??0);
  }, 0);

  const createdTodayStr = new Date().toISOString().slice(0,10);
  const newPatientsToday = new Set(
    appointments.filter(a=>a.createdAt.startsWith(createdTodayStr)).map(a=>a.patientPhone)
  ).size;

  const stats = {
    total:     todayApts.length,
    confirmed: todayApts.filter(a=>a.status==="confirmed").length,
    pending:   todayApts.filter(a=>a.status==="pending").length,
    cancelled: todayApts.filter(a=>a.status==="cancelled").length,
  };

  async function handleStatusChange(id:string, status:AppointmentStatus) {
    try {
      const result = await updateStatusFn({ appointmentId:id, status });
      if (result.ok) setAppointments(prev=>prev.map(a=>a.id===id?{...a,status,updatedAt:new Date().toISOString()}:a));
    } catch(e) { console.error(e); }
  }

  async function handleReschedule(apt:Appointment, newDate:string, newTime:string) {
    const result = await rescheduleFn({ appointmentId:apt.id, newDate, newTime });
    if (!result.ok) throw new Error(result.error);
    setAppointments(prev=>prev.map(a=>a.id===apt.id?{...a,date:newDate,time:newTime,updatedAt:new Date().toISOString()}:a));
  }

  const TABS:[Tab,string,React.ElementType][] = [
    ["day","Day View",CalendarDays],["week","Week View",LayoutGrid],["patients","All Patients",List],
  ];

  return (
    <ThemeCtx.Provider value={C}>
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:FONT }}>

        {/* Top bar */}
        <header style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 0 rgba(0,0,0,0.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#007AFF,#5856D6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🦷</div>
            <div>
              <div style={{ fontFamily:FONT, fontWeight:700, fontSize:16, color:C.text }}>Smile Premium Dental</div>
              <div style={{ fontFamily:FONT, fontSize:11, color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase" }}>Admin Dashboard</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontFamily:FONT, fontSize:14, color:C.textSub }}>{format(new Date(),"EEEE, MMMM d, yyyy")}</div>
            {/* Hidden demo button — hold Shift to see label */}
            <button onClick={handlePopulateDemo} disabled={demoStatus==="loading"}
              title="Populate 20 demo appointments for stress testing"
              style={{ padding:"7px 14px", borderRadius:10, background:"rgba(142,142,147,0.12)", border:"1px solid rgba(142,142,147,0.2)", color:"#8E8E93", fontFamily:FONT, fontSize:12, fontWeight:600, cursor:demoStatus==="loading"?"default":"pointer", opacity:demoStatus==="loading"?0.6:1 }}>
              {demoStatus==="loading"?"⏳ Seeding…":"⚗️ Demo"}
            </button>
            <a href="/settings" title="Clinic Settings" style={{ width:36, height:36, borderRadius:10, background:C.surface2, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none" }}>
              <Settings size={16} color={C.textSub}/>
            </a>
            <a href="/dental" style={{ padding:"8px 16px", borderRadius:10, background:C.accentDim, color:C.accent, textDecoration:"none", fontFamily:FONT, fontSize:13, fontWeight:600 }}>Patient Portal →</a>
          </div>
        </header>

        <main style={{ padding:"32px 40px", maxWidth:1600, margin:"0 auto" }}>

          {/* ── METRICS ── */}
          <div style={{ display:"flex", gap:14, marginBottom:32, flexWrap:"wrap" }}>
            <MetricCard label="Total Today"        value={stats.total}        sub={`${stats.confirmed} confirmed · ${stats.pending} pending`} color="#007AFF" icon={CalendarDays}/>
            <MetricCard label="Est. Revenue Today"  value={revenue.toLocaleString()} sub="Based on booked services" color="#34C759" icon={DollarSign} prefix="$"/>
            <MetricCard label="New Patients Today"  value={newPatientsToday}   sub="First appointment today"    color="#FF9F0A" icon={Users}/>
            <MetricCard label="Cancelled Today"     value={stats.cancelled}    sub="Removed from schedule"      color="#FF3B30" icon={TrendingUp}/>
          </div>

          {/* ── ANALYTICS ROW ── */}
          <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
            <RevenueChart appointments={appointments}/>
            <DoctorChart  appointments={appointments}/>
          </div>

          {/* ── TABS ── */}
          <div style={{ display:"flex", gap:4, marginBottom:28, background:C.surface3, borderRadius:12, padding:4, width:"fit-content" }}>
            {TABS.map(([id,label,Icon])=>(
              <button key={id} onClick={()=>setTab(id)}
                style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 20px", borderRadius:9, border:"none", cursor:"pointer", fontFamily:FONT, fontSize:14, fontWeight:tab===id?600:400, background:tab===id?C.surface:"transparent", color:tab===id?C.text:C.textSub, boxShadow:tab===id?C.shadow:"none", transition:"all 0.2s" }}>
                <Icon size={15}/> {label}
              </button>
            ))}
          </div>

          {/* ── CONTENT ── */}
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }} transition={{ duration:0.2 }}>
              {tab==="day"      && <DayView     appointments={appointments} selectedDate={selectedDate} onDateChange={setSelectedDate} onStatusChange={handleStatusChange} onReschedule={setRescheduleApt}/>}
              {tab==="week"     && <WeekView    appointments={appointments} selectedDate={selectedDate} onDateChange={setSelectedDate} onStatusChange={handleStatusChange} onReschedule={setRescheduleApt}/>}
              {tab==="patients" && <PatientList appointments={appointments} onStatusChange={handleStatusChange} onReschedule={setRescheduleApt}/>}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── RESCHEDULE MODAL ── */}
      <AnimatePresence>
        {rescheduleApt&&(
          <RescheduleModal
            apt={rescheduleApt}
            onClose={()=>setRescheduleApt(null)}
            onSave={(newDate,newTime)=>handleReschedule(rescheduleApt,newDate,newTime)}
          />
        )}
      </AnimatePresence>
    </ThemeCtx.Provider>
  );
}
