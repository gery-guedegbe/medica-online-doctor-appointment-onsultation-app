import { View, Text, Pressable } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

/**
 * Exemple d'utilisation du hook useTheme
 *
 * Ce composant montre comment utiliser facilement le thème
 * sans avoir à gérer les ternaires partout.
 */
export const ExampleThemeCard = () => {
  const { isDark, colors, toggleTheme } = useTheme();

  return (
    <View className={`rounded-lg p-4 ${colors.bgSecondary}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className={`text-lg font-semibold ${colors.text}`}>
            Mode sombre
          </Text>
          <Text className={`text-sm ${colors.textSecondary}`}>
            {isDark ? "Activé" : "Désactivé"}
          </Text>
        </View>

        <Pressable
          onPress={toggleTheme}
          className="flex-row items-center gap-2 rounded-lg bg-blue-500 px-4 py-2"
        >
          <Ionicons name={isDark ? "sunny" : "moon"} size={18} color="white" />
          <Text className="text-white font-semibold">
            {isDark ? "Clair" : "Sombre"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

/**
 * Autre exemple : Card adaptée au thème
 */
export const ThemedCard = ({ title, description }) => {
  const { colors } = useTheme();

  return (
    <View
      className={`rounded-lg p-4 ${colors.bgSecondary} border ${colors.border}`}
    >
      <Text className={`text-lg font-semibold ${colors.text}`}>{title}</Text>
      <Text className={`mt-2 text-sm ${colors.textSecondary}`}>
        {description}
      </Text>
    </View>
  );
};
