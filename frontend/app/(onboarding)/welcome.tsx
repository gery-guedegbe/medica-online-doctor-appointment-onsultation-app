import { IMAGES } from "@/constants/images";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomeScreen = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.replace("/walkthrough"), 3000);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center bg-white dark:bg-dark-1">
        <Image
          source={IMAGES.welcom_screen_image}
          resizeMode="contain"
          style={{ width: "100%", height: vs(429), flex: 1 }}
        />

        <View
          style={{
            paddingHorizontal: vs(24),
            paddingTop: vs(32),
            paddingBottom: vs(80),
            alignItems: "center",
            gap: vs(32),
          }}
        >
          <Text
            style={{ fontSize: s(48) }}
            className="text-center font-urbanist-bold text-main-primary dark:text-white"
          >
            Welcome to Medica! 👋
          </Text>

          <Text
            style={{
              fontSize: s(18),
              letterSpacing: s(0.2),
            }}
            className="dark: text-center font-urbanist-medium text-greyscale-900 dark:text-white"
          >
            The best online doctor appointment & consultation app of the century
            for your health and medical needs!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
