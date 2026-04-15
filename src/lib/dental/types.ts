export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  serviceId: string;
  serviceName: string;
  date: string;        // "YYYY-MM-DD"
  time: string;        // "HH:MM"
  duration: number;    // minutes
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  appointmentId: string;
  type: "confirmation" | "reminder" | "cancellation" | "update";
  channel: "whatsapp" | "email";
  to: string;
  message: string;
  sentAt: string;
  status: "logged" | "sent" | "failed";
}

export interface DentalDB {
  appointments: Appointment[];
  patients: unknown[];
  notifications_log: NotificationLog[];
}

export interface CreateAppointmentInput {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

export interface GetOccupiedSlotsInput {
  doctorId: string;
  date: string;
}

export interface UpdateStatusInput {
  appointmentId: string;
  status: AppointmentStatus;
}

export interface RescheduleInput {
  appointmentId: string;
  newDate: string;  // "YYYY-MM-DD"
  newTime: string;  // "HH:MM"
}

export interface ClinicSettings {
  clinicName: string;
  phone: string;
  address: string;
  logoUrl: string;   // data-URL or external URL
  accentColor: string;
  updatedAt: string;
}

export interface SaveSettingsInput {
  clinicName: string;
  phone: string;
  address: string;
  logoUrl: string;
  accentColor: string;
}
