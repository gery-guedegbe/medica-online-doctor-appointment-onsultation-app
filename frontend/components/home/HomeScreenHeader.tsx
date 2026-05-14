import { IMAGES } from "@/constants/images";
import { useAuthStore } from "@/stores/auth.store";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const HomeScreenHeader = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { width } = useWindowDimensions();

  return (
    <View
      style={{ height: vs(52), gap: s(16) }}
      className="flex flex-row items-center justify-between"
    >
      <View style={{ gap: s(16) }} className="flex flex-row items-center">
        <Image
          style={{ width: s(52), height: s(52) }}
          borderRadius={s(50)}
          resizeMode="contain"
          source={
            user?.avatar_url
              ? { uri: user.avatar_url }
              : IMAGES.default_user_profil
          }
        />

        <View style={{ gap: s(6) }} className="flex flex-col items-start">
          <Text
            style={{ fontSize: s(16), letterSpacing: s(0.2) }}
            className="font-urbanist-regular text-greyscale-600"
          >
            {"Good Morning 👋"}
          </Text>

          <Text
            style={{ fontSize: s(20) }}
            className="font-urbanist-bold text-greyscale-900"
          >
            {user?.full_name}
          </Text>
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: s(16),
        }}
      >
        <Pressable
          hitSlop={16}
          onPress={() => router.push("/(home)/notification")}
        >
          <Image
            resizeMode="contain"
            source={IMAGES.notification_icon}
            style={{ width: s(28), height: s(28) }}
          />
        </Pressable>

        <Pressable hitSlop={16} onPress={() => router.push("/(home)/favorite")}>
          <Image
            resizeMode="contain"
            source={IMAGES.heart_icon}
            style={{ width: s(28), height: s(28) }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreenHeader;
