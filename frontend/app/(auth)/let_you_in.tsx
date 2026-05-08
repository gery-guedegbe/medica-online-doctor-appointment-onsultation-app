import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "@utils/styling";
import { IMAGES } from "@constants/images";
import { COLORS } from "@constants/colors";
import AppButton from "@components/ui/AppButton";
import { useRouter } from "expo-router";
import { useAuthStore } from "@stores/auth.store";

const LetYouInScreen = () => {
  const router = useRouter();
  const { signInWithGoogle } = useAuthStore();

  const onGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigation gérée par index.tsx via l'état du store
    } catch (error: any) {
      if (error?.message !== "GOOGLE_OAUTH_CANCELLED") {
        console.error("[LetYouIn] Google sign-in error:", error?.message);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View
        style={{
          paddingHorizontal: s(24),
          paddingTop: vs(24),
          // paddingBottom: vs(48),
          gap: vs(32),
        }}
        className="flex-1 items-center justify-center bg-white dark:bg-dark-1"
      >
        {/* Illustration */}
        <Image
          source={IMAGES.let_you_in_icon}
          style={{ width: s(380), height: vs(200) }}
          resizeMode="contain"
        />

        {/* Titre */}
        <Text
          style={{ fontSize: s(48) }}
          className="font-urbanist-bold text-greyscale-900"
        >
          {"Let's you in"}
        </Text>

        {/* Bouton Google */}
        <Pressable
          onPress={onGoogleSignIn}
          style={{
            width: s(380),
            height: vs(60),
            paddingHorizontal: s(32),
            borderRadius: s(16),
            borderWidth: 1,
            borderColor: COLORS.greyscale[200],
            gap: s(10),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={IMAGES.google_icon}
            style={{ width: s(24), height: s(24) }}
            resizeMode="contain"
          />

          <Text
            style={{ fontSize: s(16), letterSpacing: s(0.2) }}
            className="font-urbanist-semibold text-greyscale-900"
          >
            Continue with Google
          </Text>
        </Pressable>

        {/* Séparateur "or" */}
        <View
          style={{
            width: s(380),
            flexDirection: "row",
            alignItems: "center",
            gap: s(16),
          }}
        >
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: COLORS.greyscale[200],
            }}
          />

          <Text
            style={{ fontSize: s(18), letterSpacing: s(0.2) }}
            className="font-urbanist-semibold text-greyscale-500"
          >
            or
          </Text>

          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: COLORS.greyscale[200],
            }}
          />
        </View>

        <AppButton
          title="Sign in with password"
          className="bg-main-primary shadow-md"
          onPress={() => router.push("/(auth)/sign-in")}
        />

        <View
          style={{
            width: s(380),
            height: vs(20),
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: s(8),
          }}
          className=""
        >
          <Text
            style={{ fontSize: s(14), letterSpacing: s(0.2) }}
            className="text-center font-urbanist-regular text-greyscale-500"
          >
            Don’t have an account?
          </Text>

          <Pressable
            hitSlop={18}
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text
              style={{ fontSize: s(14), letterSpacing: s(0.2) }}
              className="text-center font-urbanist-bold text-main-primary"
            >
              Sign up
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LetYouInScreen;
