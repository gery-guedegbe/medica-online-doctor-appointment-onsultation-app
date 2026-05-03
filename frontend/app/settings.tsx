import { View, Text, Pressable, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "../stores/theme.store";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <View
        className={`flex-row items-center justify-between px-4 py-4 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme === "dark" ? "#fff" : "#000"}
          />
        </Pressable>
        <Text
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Paramètres
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Theme Toggle Section */}
      <View className="px-4 py-6">
        <Text
          className={`mb-4 text-lg font-semibold ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Apparence
        </Text>

        <View
          className={`flex-row items-center justify-between rounded-lg px-4 py-4 ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <View className="flex-row items-center">
            <Ionicons
              name={theme === "dark" ? "moon" : "sunny"}
              size={24}
              color={theme === "dark" ? "#fbbf24" : "#f59e0b"}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text
                className={`text-base font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Mode sombre
              </Text>
              <Text
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {theme === "dark"
                  ? "Actuellement activé"
                  : "Actuellement désactivé"}
              </Text>
            </View>
          </View>

          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: "#e5e7eb", true: "#4b5563" }}
            thumbColor={theme === "dark" ? "#3b82f6" : "#9ca3af"}
          />
        </View>

        {/* Info */}
        <Text
          className={`mt-4 text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Le thème sera appliqué à l'ensemble de l'application et votre choix
          sera sauvegardé automatiquement.
        </Text>
      </View>
    </View>
  );
}
