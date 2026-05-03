import { create } from "zustand";
import { colorScheme } from "nativewind";

interface ThemeStore {
  theme: "light" | "dark";
  isInitialized: boolean;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "light",
  isInitialized: false,

  setTheme: (newTheme: "light" | "dark") => {
    try {
      // Appliquer le thème à nativewind
      colorScheme.set(newTheme);

      // Mettre à jour le store
      set({ theme: newTheme });
    } catch (error) {
      console.error("Erreur lors du changement de thème:", error);
    }
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    get().setTheme(newTheme);
  },

  initializeTheme: () => {
    try {
      // Initialiser avec le thème clair par défaut
      colorScheme.set("light");

      // Mettre à jour le store
      set({ theme: "light", isInitialized: true });
    } catch (error) {
      console.error("Erreur lors de l'initialisation du thème:", error);
      set({ isInitialized: true });
    }
  },
}));
