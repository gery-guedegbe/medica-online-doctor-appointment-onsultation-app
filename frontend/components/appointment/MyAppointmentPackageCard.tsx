import { Image, ImageURISource, Text, View } from "react-native";
import React from "react";
import { s } from "@/utils/styling";

interface MyAppointmentPackageCardProps {
  label: string;
  icon: ImageURISource;
  price?: number;
  desc?: string;
  duration?: number;
}

const MyAppointmentPackageCard = ({
  label,
  icon,
  price,
  desc,
  duration,
}: MyAppointmentPackageCardProps) => {
  return (
    <View
      style={{
        gap: s(20),
        padding: s(20),
        borderRadius: s(24),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 60px 0 rgba(4, 6, 15, 0.05)",
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: s(16),
        }}
      >
        <View
          style={{
            gap: s(10),
            width: s(60),
            height: s(60),
            padding: s(16),
            borderRadius: s(50),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(36, 107, 253, 0.08)",
          }}
        >
          <Image
            source={icon}
            resizeMode="contain"
            style={{ width: s(28), height: s(28) }}
          />
        </View>

        <View
          style={{
            gap: s(8),
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: s(16), letterSpacing: s(0.2) }}
            className="font-urbanist-bold text-greyscale-900"
          >
            {label}
          </Text>

          <Text
            style={{ fontSize: s(12), letterSpacing: s(0.2) }}
            className="font-urbanist-medium text-greyscale-700"
          >
            {desc}
          </Text>
        </View>
      </View>

      <View style={{ gap: s(8), alignItems: "flex-end" }}>
        <Text
          style={{ fontSize: s(18), letterSpacing: s(0.2) }}
          className="font-urbanist-bold text-primary-500"
        >
          ${`${price?.toFixed(2)}`}
        </Text>

        <Text
          style={{ fontSize: s(10), letterSpacing: s(0.2) }}
          className="font-urbanist-medium text-greyscale-700"
        >
          {`/ ${duration} mins`}
        </Text>
      </View>
    </View>
  );
};

export default MyAppointmentPackageCard;
