import { ImageSourcePropType } from "react-native";

export type User = {
  id: string;
  email: string;
  role: "patient" | "doctor";
};

export interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}

// Règle de disponibilité hebdomadaire d'un médecin
// day_of_week : 0=Lundi, 1=Mardi, ..., 6=Dimanche (convention backend, ≠ JS)
export interface AvailabilityRule {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string; // "09:00:00"
  end_time: string; // "17:00:00"
}

// Un package de consultation proposé par un médecin
export interface DoctorPackage {
  id: string;
  type: "messaging" | "video" | "voice";
  price: number;
  duration_minutes: number;
  is_active?: boolean;
}

// Correspond exactement à la réponse de l'API GET /doctors
export interface Doctor {
  id: string;
  user_id: string;
  full_name: string; // vient de users.full_name
  avatar_url: string; // vient de users.avatar_url (URL Supabase Storage)
  specialty: string;
  experience_years: number;
  rating: number;
  bio: string;
  hospital_name: string;
  hospital_address: string;
  hospital_country: string;
  patients_count: number;
  packages: DoctorPackage[];
  isFavorite?: boolean; // état UI uniquement, non présent dans l'API
}

// ── Booking Flow ──────────────────────────────────────────────────────────────

export interface BookingSlot {
  start: string; // "09:00"
  end: string; // "09:30"
}

export interface BookingPatientInfo {
  name: string;
  gender: "male" | "female";
  age: number;
  problemDescription: string;
}

export type PaymentMethod =
  | "paypal"
  | "google_pay"
  | "apple_pay"
  | "credit_card";

export interface BookingCardInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string; // "MM/YY"
  cvv: string;
}
