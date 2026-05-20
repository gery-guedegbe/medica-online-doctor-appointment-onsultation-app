import React from "react";
import { s, vs } from "@/utils/styling";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  date: string;
  isNew?: boolean;
  icon: ImageSourcePropType;
  iconBackgroundColor: string;
}

const NotificationItem = ({
  title,
  description,
  time,
  date,
  isNew,
  icon,
  iconBackgroundColor,
}: NotificationItemProps) => {
  return (
    <View style={{ height: vs(140), gap: vs(20) }} className="">
      <View
        style={{ gap: vs(20) }}
        className="flex flex-row items-center justify-between"
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: vs(20) }}
        >
          <View
            style={{
              width: s(60),
              height: s(60),
              borderRadius: s(50),
              paddingHorizontal: s(16),
              paddingVertical: s(16),
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: iconBackgroundColor,
            }}
          >
            <Image
              source={icon}
              resizeMode="contain"
              style={{ width: s(28), height: s(28) }}
            />
          </View>

          <View style={{ gap: vs(6) }}>
            <Text
              style={{ fontSize: s(20) }}
              className="font-urbanist-bold text-greyscale-900"
            >
              {title}
            </Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: vs(8) }}
            >
              <Text
                style={{ fontSize: s(14), letterSpacing: s(0.2), gap: vs(8) }}
                className="font-urbanist-medium text-greyscale-700"
              >
                {date}
              </Text>

              <Text
                style={{ fontSize: s(14), letterSpacing: s(0.2), gap: vs(8) }}
                className="font-urbanist-medium text-greyscale-700"
              >
                {"|"}
              </Text>

              <Text
                style={{ fontSize: s(14), letterSpacing: s(0.2), gap: vs(8) }}
                className="font-urbanist-medium text-greyscale-700"
              >
                {time}
              </Text>
            </View>
          </View>
        </View>

        {isNew && (
          <View
            style={{
              paddingHorizontal: s(10),
              paddingVertical: s(6),
              borderRadius: s(6),
              alignItems: "center",
              justifyContent: "center",
            }}
            className="bg-primary-500"
          >
            <Text
              style={{ fontSize: s(10), letterSpacing: s(0.2) }}
              className="font-urbanist-semibold text-white"
            >
              {"New"}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={{ fontSize: s(14), letterSpacing: s(0.2) }}
        className="font-urbanist-regular text-greyscale-800"
      >
        {description}
      </Text>
    </View>
  );
};

export default NotificationItem;
