import { s } from "@/utils/styling";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

interface SelectPaiementOptionProps {
  id: string;
  label: string;
  icon: ImageSourcePropType;
  isSelected: boolean;
  onPress: () => void;
}

const SelectPaiementOption = ({
  id,
  label,
  icon,
  isSelected,
  onPress,
}: SelectPaiementOptionProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        gap: s(16),
        padding: s(24),
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
        <Image
          source={icon}
          resizeMode="contain"
          style={{ width: s(32), height: s(32) }}
        />

        <Text
          style={{ fontSize: s(18) }}
          className="font-urbanist-bold text-greyscale-900"
        >
          {label}
        </Text>
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

export default SelectPaiementOption;
