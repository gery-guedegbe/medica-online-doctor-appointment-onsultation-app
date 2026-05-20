// components/home/DoctorCard.tsx
import { Image, Pressable, Text, View } from "react-native";
import React from "react";
import { s, vs } from "@/utils/styling";
import { IMAGES } from "@/constants/images";
import { Doctor } from "@/types";

interface DoctorCardProps {
  doctor: Doctor;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

const DoctorCard = ({ doctor, onPress, onFavoritePress }: DoctorCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        gap: s(16),
        height: s(142),
        padding: s(16),
        borderRadius: s(24),
        flexDirection: "row",
        alignItems: "center",
        boxShadow: "0 4px 60px 0 rgba(4, 6, 15, 0.05)",
      }}
      className="bg-white shadow-sm dark:bg-dark-2"
    >
      {/* Photo */}
      <Image
        source={doctor.image}
        style={{
          width: s(110),
          height: s(110),
          borderRadius: s(16),
        }}
        resizeMode="cover"
      />

      {/* Infos */}
      <View style={{ flex: 1, gap: vs(14) }}>
        <View className="flex-row items-center justify-between">
          <Text
            style={{ fontSize: s(18) }}
            className="font-urbanist-bold text-greyscale-900 dark:text-white"
          >
            {doctor.name}
          </Text>

          {/* Bouton favoris */}
          <Pressable
            hitSlop={16}
            onPress={onFavoritePress}
            style={{
              width: s(20),
              height: s(20),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={
                doctor.isFavorite ? IMAGES.bold_heart_icon : IMAGES.heart_icon
              }
              style={{ flex: 1 }}
              resizeMode="contain"
              tintColor={doctor.isFavorite ? undefined : "#246BFD"}
            />
          </Pressable>
        </View>

        <View style={{ height: vs(1), backgroundColor: "#EEEEEE" }} />

        {/* Spécialité | Hôpital */}
        <Text
          style={{ fontSize: s(12), letterSpacing: s(0.2), gap: s(8) }}
          className="font-urbanist-medium text-greyscale-800"
        >
          {doctor.specialty}
          {"  |  "}
          {doctor.hospital}
        </Text>

        {/* Rating */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: s(8) }}>
          <Image
            resizeMode="contain"
            source={IMAGES.star_icon}
            style={{ width: s(16), height: s(16) }}
          />

          <Text
            style={{ fontSize: s(13), letterSpacing: s(0.2) }}
            className="font-urbanist-medium text-greyscale-800 dark:text-white"
          >
            {doctor.rating.toFixed(1)}
          </Text>

          <Text
            style={{ fontSize: s(12), letterSpacing: s(0.2) }}
            className="font-urbanist-medium text-greyscale-800"
          >
            ({doctor.reviews.toLocaleString()} reviews)
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default DoctorCard;
