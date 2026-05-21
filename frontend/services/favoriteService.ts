import { api } from "./api";
import { Doctor } from "@/types";

// Le backend retourne les favoris avec les données du médecin imbriquées
// sous doctors: { id, specialty, users: { full_name, avatar_url } }
const normalizeFavorite = (raw: any): Doctor => ({
  id: raw.doctors.id,
  user_id: raw.doctors.user_id ?? "",
  full_name: raw.doctors.users?.full_name ?? "",
  avatar_url: raw.doctors.users?.avatar_url ?? "",
  specialty: raw.doctors.specialty ?? "",
  experience_years: raw.doctors.experience_years ?? 0,
  rating: raw.doctors.rating ?? 0,
  bio: raw.doctors.bio ?? "",
  packages: raw.doctors.doctor_packages ?? [],
});

// GET /favorites → liste des médecins favoris du patient connecté
export const getFavorites = async (): Promise<Doctor[]> => {
  const response = await api.get("/favorites");
  const raw: any[] = response.data.data.favorites ?? [];
  return raw.map(normalizeFavorite);
};

// POST /favorites → ajouter un médecin aux favoris
export const addFavorite = async (doctorId: string): Promise<void> => {
  await api.post("/favorites", { doctor_id: doctorId });
};

// DELETE /favorites/:doctorId → retirer un médecin des favoris
export const removeFavorite = async (doctorId: string): Promise<void> => {
  await api.delete(`/favorites/${doctorId}`);
};
