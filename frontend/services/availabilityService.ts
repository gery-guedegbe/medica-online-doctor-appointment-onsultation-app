import { api } from "./api";
import { AvailabilityRule } from "@/types";

// Noms des jours — convention backend : 0=Lundi, 1=Mardi, ..., 6=Dimanche
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Convertit "09:00:00" → "09:00 AM" / "14:00:00" → "02:00 PM"
export const formatTime = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

// Convertit un tableau de règles en texte lisible pour l'affichage
// Ex : "Monday - Friday, 09:00 AM - 05:00 PM"
export const formatWorkingTime = (rules: AvailabilityRule[]): string => {
  if (!rules || rules.length === 0) return "Not available";

  const sorted = [...rules].sort((a, b) => a.day_of_week - b.day_of_week);

  const firstDay = DAY_NAMES[sorted[0].day_of_week];
  const lastDay  = DAY_NAMES[sorted[sorted.length - 1].day_of_week];

  const start = formatTime(sorted[0].start_time);
  const end   = formatTime(sorted[0].end_time);

  const dayRange = firstDay === lastDay ? firstDay : `${firstDay} - ${lastDay}`;
  return `${dayRange}, ${start} - ${end}`;
};

// GET /api/availability/doctor/:doctorId
export const getDoctorAvailability = async (doctorId: string): Promise<AvailabilityRule[]> => {
  const response = await api.get(`/availability/doctor/${doctorId}`);
  return response.data.data.rules ?? [];
};

// GET /api/availability/slots?doctor_id=X&date=YYYY-MM-DD
// Retourne les créneaux disponibles pour un médecin à une date donnée
export const getDoctorSlots = async (
  doctorId: string,
  date: Date,
): Promise<{ start: string; end: string; available: boolean }[]> => {
  // Format YYYY-MM-DD attendu par l'API
  const dateStr = date.toISOString().split("T")[0];
  const response = await api.get("/availability/slots", {
    params: { doctor_id: doctorId, date: dateStr },
  });
  return response.data.data.slots ?? [];
};
