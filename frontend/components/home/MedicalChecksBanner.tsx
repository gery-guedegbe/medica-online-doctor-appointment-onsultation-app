// components/home/MedicalChecksBanner.tsx

import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { s, vs } from "@/utils/styling";
import { IMAGES } from "@/constants/images";
import { LinearGradient } from "expo-linear-gradient";

interface MedicalChecksBannerProps {
  title?: string;
  ctaLabel?: string;
  onPress?: () => void;
  description?: string;
}

const MedicalChecksBanner = ({
  onPress,
  ctaLabel = "Check Now",
  title = "Medical Checks!",
  description = "Check your health condition regularly to minimize the incidence of disease in the future.",
}: MedicalChecksBannerProps) => {
  return (
    <LinearGradient
      colors={["#5089FF", "#246BFD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        height: vs(181),
        overflow: "hidden",
        borderRadius: s(32),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: s(20),
        paddingVertical: vs(20),
        boxShadow: "4px 12px 32px 0 rgba(36, 107, 253, 0.20)",
      }}
      className=""
    >
      {/* Hexagon background decorations */}
      <View
        style={{
          position: "absolute",
          top: -vs(20),
          right: s(100),
          width: s(120),
          height: s(120),
          borderRadius: s(20),
          backgroundColor: "rgba(255,255,255,0.1)",
          transform: [{ rotate: "30deg" }],
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: -vs(30),
          right: s(60),
          width: s(100),
          height: s(100),
          borderRadius: s(16),
          backgroundColor: "rgba(255,255,255,0.08)",
          transform: [{ rotate: "15deg" }],
        }}
      />

      {/* Left content */}
      <View style={{ flex: 1, gap: vs(10) }}>
        <Text
          style={{ fontSize: s(24) }}
          className="font-urbanist-bold text-others-white"
        >
          {title}
        </Text>

        <Text
          style={{ fontSize: s(12), letterSpacing: s(0.2), width: s(212) }}
          className="font-urbanist-regular text-others-white"
        >
          {description}
        </Text>

        {/* CTA Button */}
        <Pressable
          onPress={onPress}
          style={{
            marginTop: vs(4),
            overflow: "hidden",
            borderRadius: s(50),
            alignItems: "center",
            alignSelf: "flex-start",
            backgroundColor: "#FFFFFF",
            paddingHorizontal: s(16),
            paddingVertical: vs(6),
          }}
        >
          <Text
            style={{ fontSize: s(14), letterSpacing: s(0.2) }}
            className="text-center font-urbanist-semibold text-primary-500"
          >
            {ctaLabel}
          </Text>
        </Pressable>
      </View>

      {/* Doctor image */}
      <Image
        style={{
          width: s(200),
          height: vs(284),
          position: "absolute",
          bottom: -vs(110),
          right: -s(20),
        }}
        resizeMode="contain"
        source={IMAGES.walkthrought_image_2}
      />
    </LinearGradient>
  );
};

export default MedicalChecksBanner;
