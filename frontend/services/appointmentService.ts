import { api } from "./api";

export interface CreateAppointmentPayload {
  doctor_id: string;
  package_id: string;
  start_time: string; // ISO 8601 : "2026-06-04T10:00:00Z"
  patient_name: string;
  patient_age: number;
  problem_description: string;
}

export interface CreateAppointmentResponse {
  id: string;
}

// POST /api/appointments
export const createAppointment = async (
  payload: CreateAppointmentPayload,
): Promise<CreateAppointmentResponse> => {
  const response = await api.post("/appointments", payload);
  return response.data.data;
};
