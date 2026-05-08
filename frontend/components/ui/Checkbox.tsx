import React from "react";
import { s, vs } from "@/utils/styling";
import { IMAGES } from "@/constants/images";
import { Image, Pressable, Text } from "react-native";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={{ gap: vs(10) }}
      className="flex flex-row items-center justify-center"
    >
      <Image
        source={checked ? IMAGES.check_icon : IMAGES.not_check_icon}
        resizeMode="contain"
        style={{ width: s(24), height: s(24) }}
      />

      <Text
        style={{ letterSpacing: s(0.2), fontSize: s(14) }}
        className="font-urbanist-semibold text-greyscale-900"
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default Checkbox;
