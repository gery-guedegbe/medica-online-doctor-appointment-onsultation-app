import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@config/supabase";
import { api } from "@services/api";

// Nécessaire pour fermer proprement le navigateur OAuth sur Android
WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
  nickname: string | null;
  date_of_birth: string | null;
  gender: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  created_at: string;
};

type AuthResult = {
  user: AuthUser;
  profile_complete: boolean;
};

/**
 * Appelle le backend pour créer/récupérer l'utilisateur en DB
 * et obtenir les données de profil complètes.
 */
const syncWithBackend = async (accessToken: string): Promise<AuthResult> => {
  const response = await api.post("/auth/login", { token: accessToken });
  return {
    user: response.data.data.user,
    profile_complete: response.data.data.profile_complete,
  };
};

export const authService = {
  /**
   * Inscription email/password.
   * Retourne needsVerification=true si un email de confirmation est envoyé.
   * Si email verification est désactivé et session disponible, synchronise avec le backend.
   */
  signUp: async (
    email: string,
    password: string,
  ): Promise<{
    needsVerification: boolean;
    user?: AuthUser;
    profile_complete?: boolean;
  }> => {
    const redirectUrl = Linking.createURL("/auth/verify");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });

    if (error) {
      console.error("[authService] signUp error:", error.message);
      throw error;
    }

    // Si identities est vide → email déjà enregistré
    const emailAlreadyExists =
      data.user?.identities && data.user.identities.length === 0;

    if (emailAlreadyExists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // Pas de session → email de vérification envoyé (compte non confirmé)
    const needsVerification = !!data.user && !data.session;

    // Si pas de verification requise et il y a une session, synchroniser avec le backend
    if (!needsVerification && data.session?.access_token) {
      try {
        const result = await syncWithBackend(data.session.access_token);
        return {
          needsVerification,
          user: result.user,
          profile_complete: result.profile_complete,
        };
      } catch (err) {
        console.error("[authService] signUp — syncWithBackend failed:", err);
        // Fallback: retourner juste le needsVerification
        return { needsVerification };
      }
    }

    return { needsVerification };
  },

  /**
   * Connexion email/password.
   * Synchronise avec le backend après connexion Supabase.
   */
  signIn: async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[authService] signIn error:", error.message);
      throw error;
    }

    return syncWithBackend(data.session.access_token);
  },

  /**
   * Connexion Google OAuth via navigateur système.
   * Nécessite: scheme 'medica' dans app.json + config Google dans Supabase.
   */
  signInWithGoogle: async (): Promise<AuthResult> => {
    const redirectUrl = Linking.createURL("/auth/callback");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
    });

    if (error || !data?.url) {
      console.error("[authService] signInWithGoogle error:", error?.message);
      throw error ?? new Error("No OAuth URL");
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type !== "success") {
      throw new Error("GOOGLE_OAUTH_CANCELLED");
    }

    // Échange le code contre une session
    await supabase.auth.exchangeCodeForSession(result.url);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error("SESSION_NOT_FOUND");
    }

    return syncWithBackend(session.access_token);
  },

  /**
   * Récupère la session courante depuis SecureStore.
   * Retourne null si aucune session valide.
   */
  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) console.error("[authService] getSession error:", error.message);
    return session;
  },

  /**
   * Restaure une session existante en synchronisant avec le backend.
   */
  restoreSession: async (accessToken: string): Promise<AuthResult> => {
    return syncWithBackend(accessToken);
  },

  /**
   * Déconnexion — efface la session de SecureStore.
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("[authService] signOut error:", error.message);
  },
};
