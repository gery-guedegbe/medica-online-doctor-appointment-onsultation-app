import { Image, ImageSourcePropType, Text, View } from "react-native";
import React from "react";
import { s, vs } from "@/utils/styling";

interface DoctorStatsCardProps {
  title: string;
  icon: ImageSourcePropType;
  value: string | number;
}

const DoctorStatsCard = ({ title, icon, value }: DoctorStatsCardProps) => {
  return (
    <View
      style={{
        gap: vs(8),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
      className=""
    >
      <View
        style={{
          paddingHorizontal: s(16),
          paddingVertical: vs(16),
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#246BFD14",
          borderRadius: s(50),
        }}
      >
        <Image source={icon} style={{ width: s(28), height: s(28) }} />
      </View>

      <Text
        style={{ fontSize: s(16), letterSpacing: s(0.2) }}
        className="font-urbanist-bold text-primary-500"
      >
        {value}
      </Text>

      <Text
        numberOfLines={1}
        style={{ fontSize: s(12), letterSpacing: s(0.2) }}
        className="font-urbanist-medium text-greyscale-800"
      >
        {title}
      </Text>
    </View>
  );
};

export default DoctorStatsCard;
