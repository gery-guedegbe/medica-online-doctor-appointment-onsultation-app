import { s } from "@/utils/styling";
import React from "react";
import { Image, ImageURISource, Pressable, Text, View } from "react-native";

interface SelectItemProps {
  id: string;
  label: string;
  icon: ImageURISource;
  price?: number;
  desc?: string;
  duration?: number;
  isSelected: boolean;
  onPress: () => void;
}

const SelectItem = ({
  label,
  icon,
  desc,
  price,
  duration,
  isSelected,
  onPress,
}: SelectItemProps) => {
  return (
    <Pressable
      onPress={onPress}
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

      <View
        style={{
          width: s(22),
          height: s(22),
          borderWidth: s(3),
          borderRadius: s(50),
          borderColor: "#246BFD",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {isSelected && (
          <View
            style={{
              width: s(11),
              height: s(11),
              borderRadius: s(50),
              alignSelf: "center",
              alignItems: "center",
              backgroundColor: "#246BFD",
            }}
          />
        )}
      </View>
    </Pressable>
  );
};

export default SelectItem;
