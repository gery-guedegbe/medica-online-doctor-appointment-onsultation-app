import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  ViewStyle,
} from "react-native";
import React from "react";
import { s, vs } from "@/utils/styling";

interface MyAppointmentButtonProps {
  title?: string;
  time: string;
  icon?: ImageSourcePropType;
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

const formatDateTime = (iso: string | null): string => {
  if (!iso) return "";

  const date = new Date(iso);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const MyAppointmentButton = ({
  title,
  style,
  time,
  icon,
  loading,
  disabled,
  children,
  className,
  onPress,
}: MyAppointmentButtonProps) => {
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
          gap: s(10),
          width: s(380),
          height: vs(58),
          borderRadius: s(50),
          paddingHorizontal: s(16),
          paddingVertical: vs(18),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
      className={`shadow-md ${className}`}
    >
      <Image
        source={icon}
        tintColor="#FFFFFF"
        resizeMode="contain"
        style={{ width: s(20), height: s(20) }}
      />

      <Text
        style={{ fontSize: s(16), letterSpacing: s(0.2) }}
        className="text-center font-urbanist-bold text-white"
      >
        {`${title} (Start at ${formatDateTime(time)})`}
      </Text>
    </Pressable>
  );
};

export default MyAppointmentButton;
