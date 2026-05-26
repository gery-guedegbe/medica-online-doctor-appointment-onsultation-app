import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { s, vs } from "@/utils/styling";
import { IMAGES } from "@/constants/images";

const TIMING_CONFIG = {
  duration: 350,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export interface DropDownOption {
  label: string;
  value: string;
}

interface AppDropDownProps {
  options: DropDownOption[];
  selectedValue: string | null;
  onSelect: (option: DropDownOption) => void;
  placeholder?: string;
  title?: string;
}

const AppDropDown = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select...",
  title,
}: AppDropDownProps) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);

  const selected = options.find((o) => o.value === selectedValue) ?? null;

  const openSheet = () => {
    setModalVisible(true);
    requestAnimationFrame(() => {
      translateY.value = withTiming(0, TIMING_CONFIG);
      overlayOpacity.value = withTiming(1, { duration: 300 });
    });
  };

  const closeSheet = () => {
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      TIMING_CONFIG,
      (finished) => {
        if (finished) runOnJS(setModalVisible)(false);
      },
    );
    overlayOpacity.value = withTiming(0, { duration: 280 });
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <>
      {/* ── Trigger ── */}
      <Pressable
        onPress={openSheet}
        style={{
          height: vs(56),
          borderRadius: s(16),
          paddingHorizontal: s(20),
          backgroundColor: "#FAFAFA",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{ fontSize: s(14), letterSpacing: s(0.2) }}
          className={
            selected
              ? "font-urbanist-semibold text-greyscale-900"
              : "font-urbanist-regular text-greyscale-400"
          }
        >
          {selected ? selected.label : placeholder}
        </Text>

        <Image
          source={IMAGES.arrow_down_icon}
          style={{ width: s(18), height: s(18) }}
          resizeMode="contain"
        />
      </Pressable>

      {/* ── Bottom sheet ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeSheet}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* Overlay */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.45)",
              },
              overlayStyle,
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={closeSheet} />
          </Animated.View>

          {/* Sheet */}
          <Animated.View
            style={[
              {
                paddingHorizontal: s(24),
                paddingTop: vs(16),
                paddingBottom: vs(40),
                gap: vs(4),
                borderTopLeftRadius: s(32),
                borderTopRightRadius: s(32),
                backgroundColor: "white",
                maxHeight: SCREEN_HEIGHT * 0.6,
              },
              sheetStyle,
            ]}
          >
            {/* Handle */}
            <View
              style={{
                width: s(40),
                height: vs(4),
                borderRadius: s(4),
                alignSelf: "center",
                backgroundColor: "#E0E0E0",
                marginBottom: vs(8),
              }}
            />

            {title && (
              <Text
                style={{ fontSize: s(20), marginBottom: vs(8) }}
                className="text-center font-urbanist-bold text-greyscale-900"
              >
                {title}
              </Text>
            )}

            {/* Options list */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: vs(4) }}
            >
              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onSelect(option);
                      closeSheet();
                    }}
                    style={{
                      height: vs(56),
                      borderRadius: s(16),
                      paddingHorizontal: s(20),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: isSelected
                        ? "rgba(36, 107, 253, 0.08)"
                        : "transparent",
                    }}
                  >
                    <Text
                      style={{ fontSize: s(16), letterSpacing: s(0.2) }}
                      className={
                        isSelected
                          ? "font-urbanist-bold text-primary-500"
                          : "font-urbanist-medium text-greyscale-900"
                      }
                    >
                      {option.label}
                    </Text>

                    {/* Radio indicator — même style que SelectItem */}
                    <View
                      style={{
                        width: s(22),
                        height: s(22),
                        borderWidth: s(3),
                        borderRadius: s(50),
                        borderColor: "#246BFD",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && (
                        <View
                          style={{
                            width: s(11),
                            height: s(11),
                            borderRadius: s(50),
                            backgroundColor: "#246BFD",
                          }}
                        />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default AppDropDown;
