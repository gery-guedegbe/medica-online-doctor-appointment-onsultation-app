import "../styles/global.css";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
    "Urbanist-Thin": require("../assets/fonts/Urbanist-Thin.ttf"),
    "Urbanist-Thin-Italic": require("../assets/fonts/Urbanist-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
