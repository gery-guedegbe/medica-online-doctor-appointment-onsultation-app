import React from "react";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import { IMAGES } from "@/constants/images";
import { NOTIFICATIONS } from "@/constants/data";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationItem from "@/components/home/NotificationItem";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const NotificationScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: s(24),
          paddingTop: vs(24),
          paddingBottom: vs(48),
          gap: vs(32),
        }}
        className="flex-1 bg-white dark:bg-dark-1"
      >
        <View className="flexf flex-row items-center justify-between">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: vs(12),
            }}
          >
            <Pressable
              hitSlop={18}
              onPress={() => router.back()}
              style={{ width: s(28), height: s(28) }}
            >
              <Image
                source={IMAGES.arrow_left_icon}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
            </Pressable>

            <Text
              style={{ fontSize: s(24) }}
              className="font-urbanist-bold text-greyscale-900"
            >
              {"Notifications"}
            </Text>
          </View>

          <Pressable
            hitSlop={18}
            onPress={() => router.push("/(home)/search")}
            style={{ width: s(28), height: s(28) }}
          >
            <Image
              source={IMAGES.black_more_icon}
              style={{ flex: 1 }}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ gap: vs(24) }}>
            {NOTIFICATIONS.map((notif) => (
              <NotificationItem
                key={notif.id}
                title={notif.title}
                description={notif.description}
                date={notif.date}
                time={notif.time}
                isNew={notif.isNew}
                icon={notif.icon}
                iconBackgroundColor={notif.iconBackgroundColor}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
