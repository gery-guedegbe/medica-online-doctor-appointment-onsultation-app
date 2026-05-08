import "../styles/global.css";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { supabase } from "@config/supabase";
import { useAuthStore } from "@stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { useTheme } from "@/hooks/useTheme";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Urbanist-Black": require("../assets/fonts/Urbanist-Black.ttf"),
    "Urbanist-Black-Italic": require("../assets/fonts/Urbanist-BlackItalic.ttf"),
    "Urbanist-Bold": require("../assets/fonts/Urbanist-Bold.ttf"),
    "Urbanist-Bold-Italic": require("../assets/fonts/Urbanist-BoldItalic.ttf"),
    "Urbanist-Extra-Bold": require("../assets/fonts/Urbanist-ExtraBold.ttf"),
    "Urbanist-Extra-Bold-Italic": require("../assets/fonts/Urbanist-ExtraBoldItalic.ttf"),
    "Urbanist-Extra-Light": require("../assets/fonts/Urbanist-ExtraLight.ttf"),
    "Urbanist-Extra-Light-Italic": require("../assets/fonts/Urbanist-ExtraLightItalic.ttf"),
    "Urbanist-Italic": require("../assets/fonts/Urbanist-Italic.ttf"),
    "Urbanist-Light": require("../assets/fonts/Urbanist-Light.ttf"),
    "Urbanist-Medium": require("../assets/fonts/Urbanist-Medium.ttf"),
    "Urbanist-Medium-Italic": require("../assets/fonts/Urbanist-MediumItalic.ttf"),
    "Urbanist-Regular": require("../assets/fonts/Urbanist-Regular.ttf"),
    "Urbanist-Semi-Bold": require("../assets/fonts/Urbanist-SemiBold.ttf"),
    "Urbanist-Semi-Bold-Italic": require("../assets/fonts/Urbanist-SemiBoldItalic.ttf"),
    "Urbanist-Thin": require("../assets/fonts/Urbanist-ThinItalic.ttf"),
    "Urbanist-Thin-Italic": require("../assets/fonts/Urbanist-ThinItalic.ttf"),
  });

  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const isInitialized = useThemeStore((state) => state.isInitialized);
  const { isDark } = useTheme();
  const { setUser, signOut } = useAuthStore();

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  /**
   * Listener Supabase Auth — réagit aux changements de session en temps réel.
   * Gère: connexion, déconnexion, refresh de token, verification email.
   */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          // Session terminée → effacer l'état local
          await signOut();
        }
        // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED sont gérés
        // par les actions du store (signIn, checkSession)
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (!fontsLoaded || !isInitialized) return null;

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        className="bg-white dark:bg-dark-1"
      />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
