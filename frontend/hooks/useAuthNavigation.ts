import { useRouter } from "expo-router";

/**
 * Hook de navigation post-authentification.
 * Centralise la logique de redirection selon l'état du profil.
 *
 * Utilisé dans: sign-in, sign-up, let_you_in (après Google OAuth)
 * Non utilisé dans: index.tsx (splash — gère son propre flux de démarrage)
 */
export const useAuthNavigation = () => {
  const router = useRouter();

  /**
   * Redirige vers la bonne page selon l'état du profil.
   * @param profileComplete - false → fill_your_profile, true → home
   */
  const navigateAfterAuth = (profileComplete: boolean) => {
    if (profileComplete) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(auth)/fill_your_profile");
    }
  };

  return { navigateAfterAuth };
};
