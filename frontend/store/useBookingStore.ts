import {
  BookingCardInfo,
  BookingPatientInfo,
  BookingSlot,
  DoctorPackage,
  PaymentMethod,
} from "@/types";
import { createAppointment } from "@/services/appointmentService";
import { create } from "zustand";

// Ce que le store CONTIENT (l'état)
interface BookingState {
  doctorId: string | null;
  date: Date | null;
  slot: BookingSlot | null;
  package: DoctorPackage | null;
  patientInfo: BookingPatientInfo | null;
  paymentMethod: PaymentMethod | null;
  card: BookingCardInfo | null;

  // Gestion de la soumission finale
  isSubmitting: boolean;
  appointmentId: string | null;
  error: string | null;
}

// Ce que le store peut FAIRE (les actions)
interface BookingActions {
  setDoctor: (doctorId: string) => void;
  setDateAndSlot: (date: Date, slot: BookingSlot) => void;
  setPackage: (pkg: DoctorPackage) => void;
  setPatientInfo: (info: BookingPatientInfo) => void;
  setPayment: (method: PaymentMethod, card?: BookingCardInfo) => void;
  submitBooking: () => Promise<void>;
  reset: () => void;
}

// Le type complet du store = State + Actions
type BookingStore = BookingState & BookingActions;

const initialState: BookingState = {
  doctorId: null,
  date: null,
  slot: null,
  package: null,
  patientInfo: null,
  paymentMethod: null,
  card: null,
  isSubmitting: false,
  appointmentId: null,
  error: null,
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  // 1. On étale les valeurs initiales
  ...initialState,

  // 2. Chaque setter ne fait que "poser l'article dans le chariot"
  setDoctor: (doctorId) => set({ doctorId }),

  setDateAndSlot: (date, slot) => set({ date, slot }),

  setPackage: (pkg) => set({ package: pkg }),

  setPatientInfo: (info) => set({ patientInfo: info }),

  setPayment: (method, card) =>
    set({ paymentMethod: method, card: card ?? null }),

  // 3. La soumission lit TOUT le chariot et envoie au backend
  submitBooking: async () => {
    const state = get();

    if (
      !state.doctorId ||
      !state.date ||
      !state.slot ||
      !state.package ||
      !state.patientInfo ||
      !state.paymentMethod
    ) {
      set({ error: "Booking data incomplete." });
      return;
    }

    set({ isSubmitting: true, error: null });

    // Reconstruction de start_time : date + heure UTC du créneau → ISO 8601
    // Le slot.start vient de l'API en UTC ("09:00" = 09:00 UTC).
    // setUTCHours préserve cette heure UTC sans la déplacer selon le fuseau du device.
    const [hours, minutes] = state.slot.start.split(":").map(Number);
    const startTime = new Date(state.date);
    startTime.setUTCHours(hours, minutes, 0, 0);

    try {
      const result = await createAppointment({
        doctor_id: state.doctorId,
        package_id: state.package.id,
        start_time: startTime.toISOString(),
        patient_name: state.patientInfo.name,
        patient_age: state.patientInfo.age,
        problem_description: state.patientInfo.problemDescription,
      });
      set({ appointmentId: result.id });
    } catch (e: any) {
      // e.response.data.message = message métier du backend (ex: "Créneau hors des horaires")
      // e.message = message axios générique ("Request failed with status code 400")
      const message =
        e?.response?.data?.message ??
        e?.message ??
        "Booking failed. Please try again.";
      set({ error: message });
    } finally {
      set({ isSubmitting: false });
    }
  },

  // 4. Reset : on retourne à un chariot vide
  reset: () => set(initialState),
}));
