import { useEffect } from "react";
import { Image } from "expo-image";
import { View } from "react-native";
import { s, vs } from "@utils/styling";
import { useRouter } from "expo-router";
import { IMAGES } from "@constants/images";
import LoadingIndicator from "@components/loading/LoadingIndicator";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const { isDark } = useTheme();

  useEffect(() => {
    setTimeout(() => router.replace("/welcome"), 2000);
  }, []);

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
