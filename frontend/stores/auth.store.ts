import { create } from "zustand";
import { authService, AuthUser } from "@services/auth.service";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  profileComplete: boolean;
  isLoading: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    needsVerification: boolean;
    user?: AuthUser;
    profile_complete?: boolean;
  }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  setUser: (user: AuthUser, profileComplete: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  profileComplete: false,
  isLoading: true, // true au démarrage — on vérifie la session

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user, profile_complete } = await authService.signIn(
        email,
        password,
      );
      set({
        user,
        isAuthenticated: true,
        profileComplete: profile_complete,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error; // relancé pour être géré dans le screen
    }
  },

  signUp: async (email, password) => {
    set({ isLoading: true });
    try {
      const result = await authService.signUp(email, password);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { user, profile_complete } = await authService.signInWithGoogle();
      set({
        user,
        isAuthenticated: true,
        profileComplete: profile_complete,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    await authService.signOut();
    set({
      user: null,
      isAuthenticated: false,
      profileComplete: false,
      isLoading: false,
    });
  },

  /**
   * Vérifie et restaure la session au démarrage de l'app.
   * Appelé depuis le splash screen (index.tsx).
   */
  checkSession: async () => {
    set({ isLoading: true });
    try {
      const session = await authService.getSession();

      if (session?.access_token) {
        const { user, profile_complete } = await authService.restoreSession(
          session.access_token,
        );
        set({
          user,
          isAuthenticated: true,
          profileComplete: profile_complete,
          isLoading: false,
        });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error("[AuthStore] checkSession failed:", error);
      // Session invalide ou backend indisponible → on déconnecte proprement
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user, profileComplete) => {
    set({ user, profileComplete, isAuthenticated: true });
  },
}));
