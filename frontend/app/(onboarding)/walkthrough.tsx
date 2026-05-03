import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { WALKTHROUT_ITEMS } from "@constants/data";
import { s, vs } from "@utils/styling";
import AppButton from "@/components/ui/AppButton";

const WalkthroughScreen = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = WALKTHROUT_ITEMS[currentIndex];
  const isLast = currentIndex === WALKTHROUT_ITEMS.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.replace("/(auth)/let_you_in");
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white dark:bg-dark-1">
        {/* Image du docteur */}
        <Image
          source={currentItem.img}
          resizeMode="contain"
          style={{
            width: "100%",
            height: vs(628),
            flex: 0.8,
          }}
        />

        {/* Carte du bas */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: vs(402),
            paddingHorizontal: s(24),
            paddingVertical: vs(48),
            borderTopRightRadius: s(50),
            borderTopLeftRadius: s(50),
            alignItems: "center",
            gap: vs(48),
          }}
          className="bg-white dark:bg-dark-1"
        >
          {/* Texte dynamique */}
          <Text
            style={{ fontSize: s(40) }}
            className="text-center font-urbanist-bold text-main-primary"
          >
            {currentItem.text}
          </Text>

          {/* Pagination dots */}
          <View
            style={{
              flexDirection: "row",
              height: vs(8),
              gap: s(6),
              alignItems: "center",
            }}
          >
            {WALKTHROUT_ITEMS.map((_, index) => (
              <View
                key={index}
                style={{
                  width: index === currentIndex ? s(32) : s(8),
                  height: "100%",
                  borderRadius: 50,
                }}
                className={
                  index === currentIndex
                    ? "bg-main-primary"
                    : "bg-greyscale-300"
                }
              />
            ))}
          </View>

          {/* Bouton Next / Get Started */}
          {/* <Pressable
            hitSlop={16}
            onPress={handleNext}
            style={{
              width: s(380),
              height: vs(58),
              borderRadius: 50,
              paddingHorizontal: s(16),
              paddingVertical: vs(18),
              alignItems: "center",
              justifyContent: "center",
            }}
            className="bg-main-primary shadow-md"
          >
            <Text
              style={{ fontSize: s(16), letterSpacing: s(0.2) }}
              className="text-center font-urbanist-bold text-white"
            >
              {isLast ? "Get Started" : "Next"}
            </Text>
          </Pressable> */}

          <AppButton
            onPress={handleNext}
            className="bg-main-primary shadow-md"
            title={isLast ? "Get Started" : "Next"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WalkthroughScreen;
