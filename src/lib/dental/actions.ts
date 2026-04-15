import { createServerFn } from "@tanstack/react-start";
import {
  getAllAppointments,
  getOccupiedSlots,
  createAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  sendNotification,
  populateDemoData,
  readSettings,
  saveSettings,
} from "./db";
import type {
  Appointment,
  ClinicSettings,
  CreateAppointmentInput,
  GetOccupiedSlotsInput,
  UpdateStatusInput,
  RescheduleInput,
  SaveSettingsInput,
} from "./types";

// Helper: build a typed server function by casting.
// TanStack Start v1.167 passes the first argument directly to the handler.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sf<TIn, TOut>(method: "GET" | "POST", fn: (input: TIn) => Promise<TOut>) {
  return createServerFn({ method }).handler(fn as any) as unknown as (
    input: TIn
  ) => Promise<TOut>;
}

// ─── GET ALL APPOINTMENTS ─────────────────────────────────────────────────────
export const getAllAppointmentsFn = createServerFn({ method: "GET" }).handler(
  async () => getAllAppointments()
);

// ─── GET OCCUPIED SLOTS ────────────────────────────────────────────────────────
export const getOccupiedSlotsFn = sf<GetOccupiedSlotsInput, string[]>(
  "GET",
  async (input) => getOccupiedSlots(input.doctorId, input.date)
);

// ─── CREATE APPOINTMENT ───────────────────────────────────────────────────────
export const createAppointmentFn = sf<
  CreateAppointmentInput,
  { ok: true; appointment: Appointment } | { ok: false; error: string }
>("POST", async (data) => {
  const result = await createAppointment(data);
  if (result.ok) {
    const apt = result.appointment;
    const msg =
      `✅ Appointment confirmed!\n` +
      `Patient: ${apt.patientName}\n` +
      `Service: ${apt.serviceName}\n` +
      `Doctor: ${apt.doctorName}\n` +
      `Date: ${apt.date} at ${apt.time}\n` +
      `Status: Pending clinic confirmation.\n` +
      `Questions? Call: +1 (305) 922-7181`;
    await sendNotification(apt.id, apt.patientPhone, msg, "confirmation");
  }
  return result;
});

// ─── RESCHEDULE ───────────────────────────────────────────────────────────────
export const rescheduleFn = sf<
  RescheduleInput,
  { ok: true; appointment: Appointment } | { ok: false; error: string }
>("POST", async (data) => {
  const result = await rescheduleAppointment(data.appointmentId, data.newDate, data.newTime);
  if (result.ok) {
    const apt = result.appointment;
    const msg = `📅 Appointment rescheduled!\nNew date: ${apt.date} at ${apt.time}\nService: ${apt.serviceName} with ${apt.doctorName}.\nQuestions? +1 (305) 922-7181`;
    await sendNotification(apt.id, apt.patientPhone, msg, "update");
  }
  return result;
});

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
export const getSettingsFn = createServerFn({ method: "GET" }).handler(
  async () => readSettings()
);

export const saveSettingsFn = sf<SaveSettingsInput, ClinicSettings>(
  "POST",
  async (input) => saveSettings(input)
);

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
export const populateDemoDataFn = createServerFn({ method: "POST" }).handler(
  async () => populateDemoData()
);

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────
export const updateStatusFn = sf<
  UpdateStatusInput,
  { ok: true; appointment: Appointment } | { ok: false; error: string }
>("POST", async (data) => {
  const apt = await updateAppointmentStatus(data.appointmentId, data.status);
  if (!apt) return { ok: false as const, error: "Appointment not found" };

  const msgMap: Record<string, string> = {
    confirmed: `✅ Your ${apt.serviceName} with ${apt.doctorName} on ${apt.date} at ${apt.time} is CONFIRMED. See you soon! — 🦷 Smile Premium Dental`,
    cancelled: `❌ Your appointment on ${apt.date} at ${apt.time} has been cancelled. To reschedule: +1 (305) 922-7181.`,
  };
  if (msgMap[data.status]) {
    await sendNotification(
      apt.id,
      apt.patientPhone,
      msgMap[data.status],
      data.status === "confirmed" ? "confirmation" : "cancellation"
    );
  }
  return { ok: true as const, appointment: apt };
});
