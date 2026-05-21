import { create } from "zustand";
import { Doctor } from "@/types";
import { getDoctors, GetDoctorsParams } from "@/services/doctorService";

// ─── Shape du store ────────────────────────────────────────────────────────
// On définit l'interface ici pour que TypeScript nous guide partout.

interface DoctorStore {
  // STATE
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;

  // ACTIONS
  fetchDoctors: (params?: GetDoctorsParams) => Promise<void>;
  reset: () => void;
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useDoctorStore = create<DoctorStore>((set) => ({
  // Valeurs initiales
  doctors: [],
  isLoading: false,
  error: null,

  // Charge les médecins depuis l'API
  // params est optionnel : on peut filtrer par specialty, min_rating, search
  fetchDoctors: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const doctors = await getDoctors(params);
      set({ doctors, isLoading: false });
    } catch {
      set({ error: "Impossible de charger les médecins.", isLoading: false });
    }
  },

  // Remet le store à zéro (utile à la déconnexion)
  reset: () => set({ doctors: [], isLoading: false, error: null }),
}));
