import { useEffect, useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "@utils/styling";
import { IMAGES } from "@constants/images";
import LoadingIndicator from "@components/loading/LoadingIndicator";
import { useAuthStore } from "@stores/auth.store";
import { useTheme } from "@/hooks/useTheme";

/**
 * Splash screen — affiché au démarrage.
 *
 * Logique de navigation:
 * - Vérifie la session Supabase en parallèle de l'affichage du logo
 * - Attend minimum 2s pour le branding, puis:
 *   • Session valide + profil complet  → /(tabs)/home
 *   • Session valide + profil incomplet → /(onboarding)/fill_your_profile
 *   • Pas de session                    → /(onboarding)/welcome
 */
export default function Index() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { checkSession, isAuthenticated, profileComplete, isLoading } =
    useAuthStore();

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Vérification session + timer minimum en parallèle
  useEffect(() => {
    checkSession();
    const timer = setTimeout(() => setMinTimeElapsed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Navigation dès que les deux conditions sont remplies
  useEffect(() => {
    if (!minTimeElapsed || isLoading) return;

    if (isAuthenticated) {
      if (profileComplete) {
        router.replace("/(tabs)" as any);
      } else {
        router.replace("/(auth)/fill_your_profile");
      }
    } else {
      router.replace("/(onboarding)/welcome");
    }
  }, [minTimeElapsed, isLoading, isAuthenticated, profileComplete]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center bg-white dark:bg-dark-1">
        <Image
          source={isDark ? IMAGES.app_logo_dark : IMAGES.app_logo}
          contentFit="contain"
          style={{ width: s(242), height: s(60) }}
        />

        <View
          style={{
            position: "absolute",
            bottom: vs(100),
            alignItems: "center",
          }}
        >
          <LoadingIndicator size={60} color="#246BFD" />
        </View>
      </View>
    </SafeAreaView>
  );
}
