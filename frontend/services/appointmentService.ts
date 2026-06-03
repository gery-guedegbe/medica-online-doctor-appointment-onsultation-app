import { Appointment, AppointmentStatus } from "@/types";
import { api } from "./api";

export interface CreateAppointmentPayload {
  doctor_id: string;
  package_id: string;
  start_time: string; // ISO 8601 : "2026-06-04T10:00:00Z"
  patient_name: string;
  patient_age: number;
  problem_description: string;
}

// POST /api/appointments
export const createAppointment = async (
  payload: CreateAppointmentPayload,
): Promise<{ id: string }> => {
  const response = await api.post("/appointments", payload);
  return response.data.data;
};

// Le filtre API utilise "upcoming" (pas "booked") — différent du statut stocké
export type AppointmentFilter = "upcoming" | "completed" | "cancelled";

// GET /api/appointments?status=upcoming|completed|cancelled
export const getMyAppointments = async (
  status?: AppointmentFilter,
): Promise<Appointment[]> => {
  const response = await api.get("/appointments", {
    params: status ? { status } : undefined,
  });
  return response.data.data.appointments;
};

// GET /api/appointments/:id
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const response = await api.get(`/appointments/${id}`);
  return response.data.data.appointment;
};

// PATCH /api/appointments/:id/cancel
export const cancelAppointment = async (
  id: string,
  cancellation_reason?: string,
): Promise<void> => {
  await api.patch(`/appointments/${id}/cancel`, { cancellation_reason });
};

// PATCH /api/appointments/:id/reschedule
export const rescheduleAppointment = async (
  id: string,
  new_start_time: string,
  reschedule_reason?: string,
): Promise<void> => {
  await api.patch(`/appointments/${id}/reschedule`, {
    new_start_time,
    reschedule_reason,
  });
};
