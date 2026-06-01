import React from "react";
import { Doctor } from "@/types";
import { s, vs } from "@/utils/styling";
import { Image, Text, View } from "react-native";

interface ReviewSummaryCardProps {
  doctor: Doctor | undefined;
}

const ReviewSummaryCard = ({ doctor }: ReviewSummaryCardProps) => {
  return (
    <View
      style={{
        height: s(142),
        borderRadius: s(24),
        flexDirection: "row",
        alignItems: "center",
        gap: s(16),
        padding: s(16),
        boxShadow: "0 4px 60px 0 rgba(4, 6, 15, 0.05)",
      }}
      className="bg-white dark:bg-dark-2"
    >
      <Image
        source={{ uri: doctor?.avatar_url }}
        style={{ width: s(110), height: s(110), borderRadius: s(16) }}
        resizeMode="cover"
      />

      {/* Infos */}
      <View style={{ flex: 1, gap: vs(14) }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: s(8) }}>
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontSize: s(18) }}
            className="font-urbanist-bold text-greyscale-900 dark:text-white"
          >
            {doctor?.full_name}
          </Text>
        </View>

        <View style={{ height: vs(1), backgroundColor: "#EEEEEE" }} />

        <Text
          numberOfLines={1}
          style={{ fontSize: s(12), letterSpacing: s(0.2) }}
          className="font-urbanist-medium text-greyscale-800"
        >
          {doctor?.specialty}
        </Text>

        <Text
          numberOfLines={2}
          style={{ fontSize: s(12), letterSpacing: s(0.2) }}
          className="font-urbanist-medium text-greyscale-800"
        >
          {`${doctor?.hospital_name}, ${doctor?.hospital_address}, ${doctor?.hospital_country}`}
        </Text>
      </View>
    </View>
  );
};

export default ReviewSummaryCard;
