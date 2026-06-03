import { create } from "zustand";
import { Appointment, AppointmentStatus } from "@/types";
import {
  AppointmentFilter,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment as cancelAppointmentService,
} from "@/services/appointmentService";

// ─── Shape du store ────────────────────────────────────────────────────────

interface AppointmentStore {
  // STATE
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;

  // ACTIONS
  fetchAppointments: (status?: AppointmentFilter) => Promise<void>;
  fetchAppointmentById: (id: string) => Promise<void>;
  cancelAppointment: (id: string, reason?: string) => Promise<void>;
  reset: () => void;
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  // Valeurs initiales
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,

  // Charge tous les rendez-vous, filtré par statut si fourni
  fetchAppointments: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await getMyAppointments(status);
      set({ appointments });
    } catch {
      set({ error: "Unable to load appointments." });
    } finally {
      set({ isLoading: false });
    }
  },

  // Charge le détail d'un seul rendez-vous
  fetchAppointmentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const appointment = await getAppointmentById(id);
      set({ selectedAppointment: appointment });
    } catch {
      set({ error: "Unable to load appointment details." });
    } finally {
      set({ isLoading: false });
    }
  },

  // Annule un rendez-vous et met à jour la liste locale sans refetch
  cancelAppointment: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      await cancelAppointmentService(id, reason);
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "cancelled" as AppointmentStatus,
                cancellation_reason: reason ?? null,
              }
            : a,
        ),
      }));
    } catch {
      set({ error: "Unable to cancel appointment." });
    } finally {
      set({ isLoading: false });
    }
  },

  // Remet le store à zéro (utile à la déconnexion)
  reset: () =>
    set({
      appointments: [],
      selectedAppointment: null,
      isLoading: false,
      error: null,
    }),
}));
