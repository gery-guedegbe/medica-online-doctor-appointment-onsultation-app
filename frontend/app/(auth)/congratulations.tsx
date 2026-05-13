import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "@utils/styling";
import AppButton from "@components/ui/AppButton";
import LoadingIndicator from "@components/loading/LoadingIndicator";
import { useAuthNavigation } from "@hooks/useAuthNavigation";
import { useAuthStore } from "@stores/auth.store";
import { IMAGES } from "@/constants/images";

const CongratulationsScreen = () => {
  const { navigateAfterAuth } = useAuthNavigation();

  // Auto-redirect vers home après 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      const { profileComplete } = useAuthStore.getState();
      navigateAfterAuth(profileComplete);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // const handleContinue = () => {
  //   const { profileComplete } = useAuthStore.getState();
  //   navigateAfterAuth(profileComplete);
  // };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-1">
      <View
        style={{
          flex: 1,
          paddingHorizontal: s(24),
          paddingBottom: vs(48),
          alignItems: "center",
          justifyContent: "center",
          gap: vs(32),
        }}
      >
        {/* Icône de succès */}
        <Image
          source={IMAGES.congratulation_image}
          resizeMode="contain"
          style={{ width: s(185), height: s(180), alignSelf: "center" }}
        />

        <View style={{ gap: s(32) }}>
          {/* Texte */}
          <Text
            style={{ fontSize: s(32) }}
            className="text-center font-urbanist-bold text-primary-500"
          >
            Congratulations!
          </Text>

          <Text
            style={{ fontSize: s(18), letterSpacing: s(0.2) }}
            className="text-center font-urbanist-regular text-greyscale-900"
          >
            {
              "Your account is ready to use.\nYou will be redirected to the\nHome page in a few seconds."
            }
          </Text>
        </View>

        {/* Spinner */}
        <LoadingIndicator size={48} color="#246BFD" />
      </View>
    </SafeAreaView>
  );
};

export default CongratulationsScreen;
