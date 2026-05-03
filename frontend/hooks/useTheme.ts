import { useThemeStore } from "../stores/theme.store";

/**
 * Hook personnalisé pour utiliser le thème facilement dans les composants
 *
 * Utilisation:
 * const { theme, toggleTheme, isDark } = useTheme();
 */
export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleTheme,
    setTheme,
    // Classes d'aide rapides
    colors: {
      bg: theme === "dark" ? "bg-gray-900" : "bg-white",
      bgSecondary: theme === "dark" ? "bg-gray-800" : "bg-gray-50",
      text: theme === "dark" ? "text-white" : "text-gray-900",
      textSecondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
      border: theme === "dark" ? "border-gray-700" : "border-gray-200",
    },
  };
};
