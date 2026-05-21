import { api } from "./api";
import { Doctor, DoctorPackage } from "@/types";

// Paramètres optionnels pour filtrer la liste des médecins
export interface GetDoctorsParams {
  specialty?: string;
  min_rating?: number;
  search?: string;
}

// Transforme la réponse brute du backend en objet Doctor plat et propre.
// Le backend retourne full_name et avatar_url imbriqués sous users: { ... }
// On les remonte au niveau racine pour simplifier l'usage dans les composants.
const normalize = (raw: any): Doctor => ({
  id: raw.id,
  user_id: raw.user_id,
  full_name: raw.users?.full_name ?? "Nom inconnu",
  avatar_url: raw.users?.avatar_url ?? "",
  specialty: raw.specialty ?? "",
  experience_years: raw.experience_years ?? 0,
  rating: raw.rating ?? 0,
  bio: raw.bio ?? "",
  hospital_name: raw.hospital_name ?? "",
  hospital_address: raw.hospital_address ?? "",
  hospital_country: raw.hospital_country ?? "",
  patients_count: raw.patients_count ?? 0,
  packages: (raw.doctor_packages as DoctorPackage[]) ?? [],
});

// Récupère la liste des médecins avec filtres optionnels
export const getDoctors = async (params?: GetDoctorsParams): Promise<Doctor[]> => {
  const response = await api.get("/doctors", { params });
  // L'API retourne { success: true, data: { doctors: [...], count: N } }
  const raw: any[] = response.data.data.doctors ?? [];
  return raw.map(normalize);
};

// Récupère un médecin par son ID
export const getDoctorById = async (id: string): Promise<Doctor> => {
  const response = await api.get(`/doctors/${id}`);
  // L'API retourne { success: true, data: { doctor: {...} } }
  return normalize(response.data.data.doctor);
};
