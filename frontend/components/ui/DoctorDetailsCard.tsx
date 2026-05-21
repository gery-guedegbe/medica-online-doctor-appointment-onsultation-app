import React from "react";
import { Doctor } from "@/types";
import { s, vs } from "@/utils/styling";
import { IMAGES } from "@/constants/images";
import { Image, Pressable, Text, View } from "react-native";

interface DoctorDetailsCardProps {
  doctor: Doctor;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

const DoctorDetailsCard = ({
  doctor,
  isFavorite = false,
  onPress,
  onFavoritePress,
}: DoctorDetailsCardProps) => {
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
      {/* Photo — seule zone de tap pour la navigation */}
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={{ width: s(110), height: s(110) }}
      >
        <Image
          source={{ uri: doctor.avatar_url }}
          style={{ flex: 1, borderRadius: s(16) }}
          resizeMode="cover"
        />
      </Pressable>

      {/* Infos */}
      <View style={{ flex: 1, gap: vs(14) }}>
        {/* Ligne nom + cœur — deux Pressable frères, jamais imbriqués */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: s(8) }}>
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontSize: s(18) }}
            className="font-urbanist-bold text-greyscale-900 dark:text-white"
          >
            {doctor.full_name}
          </Text>

          <Pressable
            onPress={onFavoritePress}
            hitSlop={16}
            style={{
              width: s(24),
              height: s(24),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={isFavorite ? IMAGES.bold_heart_icon : IMAGES.heart_icon}
              style={{ width: s(20), height: s(20) }}
              resizeMode="contain"
              tintColor={isFavorite ? undefined : "#246BFD"}
            />
          </Pressable>
        </View>

        <View style={{ height: vs(1), backgroundColor: "#EEEEEE" }} />

        <Text
          numberOfLines={1}
          style={{ fontSize: s(12), letterSpacing: s(0.2) }}
          className="font-urbanist-medium text-greyscale-800"
        >
          {doctor.specialty}
        </Text>

        <Text
          numberOfLines={2}
          style={{ fontSize: s(12), letterSpacing: s(0.2) }}
          className="font-urbanist-medium text-greyscale-800"
        >
          {`${doctor.hospital_name}, ${doctor.hospital_address}, ${doctor.hospital_country}`}
        </Text>
      </View>
    </View>
  );
};

export default DoctorDetailsCard;
