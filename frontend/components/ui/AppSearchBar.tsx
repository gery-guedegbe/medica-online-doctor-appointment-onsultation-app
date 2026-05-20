import React from "react";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import { IMAGES } from "@/constants/images";
import { Image, Pressable, TextInput, View } from "react-native";

interface AppSearchBarProps {
  value?: string;
  isFocused?: boolean;
  onPress?: () => void;
  isPressable: boolean;
  onChangeText?: (text: string) => void;
}

const AppSearchBar = ({
  value,
  isFocused,
  onPress,
  isPressable,
  onChangeText,
}: AppSearchBarProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (isPressable) {
      router.push("/(home)/search");
    }
  };

  return (
    <View
      style={{
        height: vs(56),
        borderRadius: s(16),
        paddingHorizontal: s(20),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: s(12),
      }}
      className={`bg-greyscale-100 ${isFocused ? "border border-primary-500" : "border-transparent"}`}
    >
      <Image
        resizeMode="contain"
        source={IMAGES.search_icon}
        style={{ width: s(20), height: s(20) }}
        tintColor={isFocused ? "#246BFD" : "#BDBDBD"}
      />

      <TextInput
        value={value}
        placeholder="Search"
        onPress={handlePress}
        onChangeText={onChangeText}
        placeholderTextColor="#BDBDBD"
        className="font-urbanist-regular text-greyscale-400"
        style={{ flex: 1, fontSize: s(14), letterSpacing: s(0.2) }}
      />

      <Pressable hitSlop={18} style={{ width: s(20), height: s(20) }}>
        <Image
          source={IMAGES.filter_icon}
          resizeMode="contain"
          style={{ flex: 1 }}
        />
      </Pressable>
    </View>
  );
};

export default AppSearchBar;
