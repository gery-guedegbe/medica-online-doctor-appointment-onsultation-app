import { COLORS } from "@/constants/colors";
import { IMAGES } from "@/constants/images";
import { s, vs } from "@/utils/styling";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  KeyboardTypeOptions,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface AppInputProps {
  value: string | undefined;
  error?: string;
  hasIcon?: boolean;
  desIcon?: boolean;
  icon?: ImageSourcePropType;
  keyboardType?: KeyboardTypeOptions;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
}

const AppInput = ({
  value,
  error,
  hasIcon = false,
  desIcon = false,
  icon,
  keyboardType = "default",
  placeholder,
  secureTextEntry = false,
  onChangeText,
  onFocus,
}: AppInputProps) => {
  const [isSecured, setIsSecured] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setIsSecured(!isSecured);
  };

  return (
    <View style={{ width: s(380), gap: vs(6) }}>
      <View
        style={{
          width: s(380),
          height: vs(60),
          paddingHorizontal: vs(20),
          backgroundColor: COLORS.greyscale[50],
          borderRadius: s(16),
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: s(12),
        }}
        className=""
      >
        {hasIcon && (
          <Image
            source={icon}
            resizeMode="contain"
            style={{ width: s(20), height: vs(20) }}
          />
        )}

        <TextInput
          value={value}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder={placeholder}
          secureTextEntry={isSecured}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          accessibilityLabel={placeholder}
          style={{
            flex: 1,
            fontSize: s(14),
          }}
          className="font-urbanist-regular text-greyscale-500"
        />

        {secureTextEntry && (
          <Pressable
            hitSlop={16}
            onPress={toggleSecureEntry}
            style={{ width: s(20), height: vs(20) }}
          >
            <Image
              source={isSecured ? IMAGES.hide_eye_icon : IMAGES.open_eye_icon}
              resizeMode="contain"
              style={{ width: s(20), height: vs(20) }}
            />
          </Pressable>
        )}

        {desIcon && (
          <Image
            source={icon}
            resizeMode="contain"
            style={{ width: s(20), height: vs(20) }}
          />
        )}
      </View>

      {error && (
        <Text
          style={{ fontSize: s(14), letterSpacing: s(0.2) }}
          className="font-urbanist-regular text-status-error"
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default AppInput;
