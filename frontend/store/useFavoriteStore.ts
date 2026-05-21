import { create } from "zustand";
import { Doctor } from "@/types";
import { supabase } from "@/config/supabase";
import * as favoriteService from "@/services/favoriteService";

interface FavoriteStore {
  // STATE
  favorites: Doctor[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  error: string | null;

  // ACTIONS
  fetchFavorites: () => Promise<void>;
  toggle: (doctor: Doctor) => Promise<void>;
  reset: () => void;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  favoriteIds: new Set(),
  isLoading: false,
  error: null,

  // Charge les favoris depuis l'API (appelé au montage des écrans concernés).
  // Les favoris sont réservés aux patients — on vérifie le rôle avant l'appel
  // pour ne pas déclencher un 403 inutile quand un médecin utilise l'app.
  fetchFavorites: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const role = session?.user?.user_metadata?.role;
    if (role !== "patient") return; // silencieux : les médecins n'ont pas de favoris

    set({ isLoading: true, error: null });
    try {
      const favorites = await favoriteService.getFavorites();
      set({
        favorites,
        favoriteIds: new Set(favorites.map((f) => f.id)),
        isLoading: false,
      });
    } catch {
      set({ error: "Impossible de charger les favoris.", isLoading: false });
    }
  },

  // Ajoute ou retire un médecin des favoris avec mise à jour optimiste :
  //  1. On capture l'état actuel (pour pouvoir l'annuler si l'API échoue)
  //  2. On met à jour l'UI immédiatement
  //  3. On appelle l'API en arrière-plan
  //  4. Si l'API échoue, on restaure l'état précédent
  toggle: async (doctor: Doctor) => {
    const { favorites, favoriteIds } = get();
    const wasFav = favoriteIds.has(doctor.id);

    // 1. Mise à jour optimiste immédiate
    const newIds = new Set(favoriteIds);
    if (wasFav) {
      newIds.delete(doctor.id);
      set({
        favorites: favorites.filter((f) => f.id !== doctor.id),
        favoriteIds: newIds,
      });
    } else {
      newIds.add(doctor.id);
      set({
        favorites: [doctor, ...favorites],
        favoriteIds: newIds,
      });
    }

    // 2. Appel API en arrière-plan
    try {
      if (wasFav) {
        await favoriteService.removeFavorite(doctor.id);
      } else {
        await favoriteService.addFavorite(doctor.id);
      }
    } catch {
      // 3. Annulation de l'optimistic update si l'API échoue
      set({ favorites, favoriteIds });
    }
  },

  reset: () => set({ favorites: [], favoriteIds: new Set(), error: null }),
}));
