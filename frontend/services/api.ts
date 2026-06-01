import axios from "axios";
import { supabase } from "@config/supabase";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.79:5000/api",
  timeout: 10000,
});

// Attache automatiquement le token Supabase à chaque requête
api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

// Gestion centralisée des erreurs HTTP
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;

    if (status === 401) {
      console.error("[API] Session expirée ou token invalide", { code });
    } else if (status === 403) {
      console.error("[API] Accès interdit", { code });
    } else if (status >= 500) {
      console.error("[API] Erreur serveur", { status, code });
    }

    return Promise.reject(error);
  },
);
