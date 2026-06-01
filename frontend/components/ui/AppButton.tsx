import { Pressable, Text, ViewStyle } from "react-native";
import React from "react";
import { s, vs } from "@/utils/styling";

interface AppButtonProps {
  title?: string;
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

const AppButton = ({
  title,
  style,
  loading,
  disabled,
  children,
  className,
  onPress,
}: AppButtonProps) => {
  return (
    <Pressable
      hitSlop={16}
      accessible={true}
      accessibilityRole="button"
      onPress={onPress}
      disabled={loading || disabled}
      style={[
        style,
        {
          width: s(380),
          height: vs(58),
          borderRadius: s(50),
          paddingHorizontal: s(16),
          paddingVertical: vs(18),
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
      className={`shadow-md ${className}`}
    >
      <Text
        style={{ fontSize: s(16), letterSpacing: s(0.2) }}
        className="text-center font-urbanist-bold text-white"
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default AppButton;
