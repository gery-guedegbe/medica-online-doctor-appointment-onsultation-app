import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

/**
 * Adaptateur SecureStore pour Supabase Auth.
 * Les tokens JWT sont stockés de façon chiffrée sur le device.
 * Note: Le changement du flux de sign-up (appel backend) réduit la taille du token.
 */
const SecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter, // tokens chiffrés sur le device
    autoRefreshToken: true, // refresh automatique avant expiration
    persistSession: true, // session conservée entre les lancements
    detectSessionInUrl: false, // désactivé — React Native n'a pas d'URL
  },
});
