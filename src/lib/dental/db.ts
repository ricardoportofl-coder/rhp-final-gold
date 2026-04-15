import type {
  DentalDB,
  Appointment,
  CreateAppointmentInput,
  NotificationLog,
  ClinicSettings,
  SaveSettingsInput,
} from "./types";

// Paths built without static `path` import so client bundle stays clean
const DB_PATH       = `${process.cwd()}/database/dental_core.json`;
const SETTINGS_PATH = `${process.cwd()}/database/clinic_settings.json`;

// Dynamic import helpers — only resolved at runtime on the server
async function fsRead(file: string): Promise<string> {
  const { readFile } = await import("fs/promises");
  return readFile(file, "utf-8");
}
async function fsWrite(file: string, data: string): Promise<void> {
  const { writeFile, mkdir } = await import("fs/promises");
  const { dirname } = await import("path");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, data, "utf-8");
}
const BUFFER_MIN    = 15; // minutes between appointments

// ─── DEFAULT SETTINGS ─────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: ClinicSettings = {
  clinicName:   "Smile Premium Dental",
  phone:        "+1 (305) 922-7181",
  address:      "1234 Brickell Ave, Miami, FL 33131",
  logoUrl:      "",
  accentColor:  "#007AFF",
  updatedAt:    new Date().toISOString(),
};

export async function readSettings(): Promise<ClinicSettings> {
  try {
    const raw = await fsRead(SETTINGS_PATH);
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as ClinicSettings;
  } catch {
    await fsWrite(SETTINGS_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(input: SaveSettingsInput): Promise<ClinicSettings> {
  const updated: ClinicSettings = { ...input, updatedAt: new Date().toISOString() };
  await fsWrite(SETTINGS_PATH, JSON.stringify(updated, null, 2));
  return updated;
}

// ─── I/O ──────────────────────────────────────────────────────────────────────

export async function readDB(): Promise<DentalDB> {
  try {
    const raw = await fsRead(DB_PATH);
    return JSON.parse(raw) as DentalDB;
  } catch {
    const empty: DentalDB = { appointments: [], patients: [], notifications_log: [] };
    await writeDB(empty);
    return empty;
  }
}

export async function writeDB(data: DentalDB): Promise<void> {
  await fsWrite(DB_PATH, JSON.stringify(data, null, 2));
}

// ─── CONFLICT DETECTION ───────────────────────────────────────────────────────

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function detectConflict(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  time: string,
  duration: number,
  excludeId?: string
): boolean {
  const newStart = timeToMinutes(time);
  const newEnd = newStart + duration + BUFFER_MIN;

  return appointments
    .filter(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.status !== "cancelled" &&
        a.id !== excludeId
    )
    .some((a) => {
      const existStart = timeToMinutes(a.time);
      const existEnd = existStart + a.duration + BUFFER_MIN;
      return newStart < existEnd && existStart < newEnd;
    });
}

// ─── QUERIES ──────────────────────────────────────────────────────────────────

export async function getAllAppointments(): Promise<Appointment[]> {
  const db = await readDB();
  return db.appointments.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
}

export async function getOccupiedSlots(
  doctorId: string,
  date: string
): Promise<string[]> {
  const db = await readDB();
  const active = db.appointments.filter(
    (a) => a.doctorId === doctorId && a.date === date && a.status !== "cancelled"
  );

  // Mark all slots blocked by existing appointments (including 15-min buffer)
  const ALL_SLOTS = [
    "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
    "14:00","14:30","15:00","15:30","16:00","16:30","17:00",
  ];

  return ALL_SLOTS.filter((slot) => {
    const slotMin = timeToMinutes(slot);
    return active.some((a) => {
      const start = timeToMinutes(a.time);
      const end = start + a.duration + BUFFER_MIN;
      return slotMin >= start && slotMin < end;
    });
  });
}

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<{ ok: true; appointment: Appointment } | { ok: false; error: string }> {
  const db = await readDB();

  if (
    detectConflict(
      db.appointments,
      input.doctorId,
      input.date,
      input.time,
      input.duration
    )
  ) {
    return {
      ok: false,
      error: `${input.doctorName} already has an appointment (+ 15 min buffer) at ${input.time} on ${input.date}. Please choose a different time.`,
    };
  }

  const appointment: Appointment = {
    id: `apt-${crypto.randomUUID().slice(0, 8)}`,
    ...input,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.appointments.push(appointment);
  await writeDB(db);
  return { ok: true, appointment };
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: Appointment["status"]
): Promise<Appointment | null> {
  const db = await readDB();
  const idx = db.appointments.findIndex((a) => a.id === appointmentId);
  if (idx === -1) return null;

  db.appointments[idx] = {
    ...db.appointments[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeDB(db);
  return db.appointments[idx];
}

export async function rescheduleAppointment(
  appointmentId: string,
  newDate: string,
  newTime: string
): Promise<{ ok: true; appointment: Appointment } | { ok: false; error: string }> {
  const db = await readDB();
  const idx = db.appointments.findIndex((a) => a.id === appointmentId);
  if (idx === -1) return { ok: false, error: "Appointment not found" };

  const apt = db.appointments[idx];

  if (
    detectConflict(
      db.appointments,
      apt.doctorId,
      newDate,
      newTime,
      apt.duration,
      appointmentId
    )
  ) {
    return {
      ok: false,
      error: `${apt.doctorName} already has a booking (+ 15 min buffer) at ${newTime} on ${newDate}.`,
    };
  }

  db.appointments[idx] = {
    ...apt,
    date: newDate,
    time: newTime,
    updatedAt: new Date().toISOString(),
  };
  await writeDB(db);
  return { ok: true, appointment: db.appointments[idx] };
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export async function sendNotification(
  appointmentId: string,
  to: string,
  message: string,
  type: NotificationLog["type"]
): Promise<void> {
  const db = await readDB();
  const log: NotificationLog = {
    id: crypto.randomUUID(),
    appointmentId,
    type,
    channel: "whatsapp",
    to,
    message,
    sentAt: new Date().toISOString(),
    status: "logged",
  };
  db.notifications_log.push(log);
  await writeDB(db);
  // Future: replace this log with real WhatsApp API call
  console.log(`[NOTIFICATION:${type.toUpperCase()}] → ${to}\n  ${message}`);
}

// ─── DEMO DATA ────────────────────────────────────────────────────────────────

const DEMO_NAMES   = ["Alice Johnson","Marcus Webb","Sofia Reyes","David Kim","Laura Santos","James Miller","Nina Patel","Carlos Diaz","Emma Wilson","Ryan O'Brien","Priya Nair","Tyler Benson","Aisha Okafor","Liam Chen","Mia Tanaka","Oscar Ruiz","Zoe Larsson","Hassan Ali","Grace Park","Ethan Moore"];
const DEMO_PHONES  = ["+13051110001","+13051110002","+13051110003","+13051110004","+13051110005","+13051110006","+13051110007","+13051110008","+13051110009","+13051110010","+13051110011","+13051110012","+13051110013","+13051110014","+13051110015","+13051110016","+13051110017","+13051110018","+13051110019","+13051110020"];
const DEMO_DOCTORS = [
  { id:"sarah",   name:"Dr. Sarah Mitchell"  },
  { id:"james",   name:"Dr. James Ortega"    },
  { id:"emily",   name:"Dr. Emily Chen"      },
  { id:"michael", name:"Dr. Michael Torres"  },
];
const DEMO_SERVICES = [
  { id:"checkup",   name:"Checkup & Cleaning",  duration:45 },
  { id:"whitening", name:"Teeth Whitening",      duration:90 },
  { id:"ortho",     name:"Orthodontic Consult",  duration:60 },
  { id:"implant",   name:"Implant Assessment",   duration:45 },
  { id:"emergency", name:"Emergency Care",       duration:30 },
];
const DEMO_STATUSES: Appointment["status"][] = ["pending","confirmed","confirmed","confirmed","cancelled"];
const DEMO_SLOTS    = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"];

function addDays(date: string, n: number): string {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export async function populateDemoData(): Promise<{ added: number }> {
  const db = await readDB();

  // Remove previous demo appointments to allow re-seeding
  db.appointments = db.appointments.filter(a => !a.id.startsWith("demo-"));

  const today = new Date().toISOString().slice(0, 10);
  let added = 0;

  for (let i = 0; i < 20; i++) {
    const name    = DEMO_NAMES[i];
    const phone   = DEMO_PHONES[i];
    const doctor  = DEMO_DOCTORS[i % DEMO_DOCTORS.length];
    const service = DEMO_SERVICES[i % DEMO_SERVICES.length];
    const status  = DEMO_STATUSES[i % DEMO_STATUSES.length];
    const daysAhead = (i % 7);  // spread across next 7 days
    const date    = addDays(today, daysAhead);
    const time    = DEMO_SLOTS[i % DEMO_SLOTS.length];

    // Skip if this slot is already taken for this doctor
    const conflict = detectConflict(db.appointments, doctor.id, date, time, service.duration);
    if (conflict) continue;

    const apt: Appointment = {
      id:          `demo-${crypto.randomUUID().slice(0, 8)}`,
      patientName: name,
      patientPhone: phone,
      patientEmail: `${name.split(" ")[0].toLowerCase()}@demo.com`,
      doctorId:    doctor.id,
      doctorName:  doctor.name,
      serviceId:   service.id,
      serviceName: service.name,
      date,
      time,
      duration:    service.duration,
      status,
      notes:       "Demo appointment",
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    };

    db.appointments.push(apt);
    added++;
  }

  await writeDB(db);
  return { added };
}
