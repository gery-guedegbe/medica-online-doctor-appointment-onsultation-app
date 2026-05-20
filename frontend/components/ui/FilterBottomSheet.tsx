// components/ui/FilterBottomSheet.tsx
import React, { useEffect, useState } from "react";
import {
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

const TIMING_CONFIG = {
  duration: 350,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

const SPECIALITIES = ["All", "General", "Dentist", "Nutritionist"];
const RATINGS = [5, 4, 3, 2];

export interface FilterState {
  speciality: string;
  rating: number | null;
}

interface FilterBottomSheetProps {
  visible: boolean;
  initialFilter: FilterState;
  onApply: (filter: FilterState) => void;
  onClose: () => void;
}

const FilterBottomSheet = ({
  visible,
  initialFilter,
  onApply,
  onClose,
}: FilterBottomSheetProps) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const [localFilter, setLocalFilter] = useState<FilterState>(initialFilter);

  // true = le composant est monté dans le DOM (pour le unmount différé)
  const [isMounted, setIsMounted] = useState(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);

  // Sync localFilter si initialFilter change depuis le parent
  useEffect(() => {
    setLocalFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    if (visible) {
      // 1. Monte le composant
      setIsMounted(true);
      // 2. Anime l'entrée au prochain tick
      requestAnimationFrame(() => {
        translateY.value = withTiming(0, TIMING_CONFIG);
        overlayOpacity.value = withTiming(1, { duration: 300 });
      });
    } else {
      // Anime la sortie, puis démonte
      translateY.value = withTiming(
        SCREEN_HEIGHT,
        TIMING_CONFIG,
        (finished) => {
          if (finished) runOnJS(setIsMounted)(false);
        },
      );
      overlayOpacity.value = withTiming(0, { duration: 280 });
    }
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleApply = () => {
    onApply(localFilter);
    onClose();
  };

  const handleReset = () => {
    const reset: FilterState = { speciality: "All", rating: null };
    setLocalFilter(reset);
    onApply(reset);
    onClose();
  };

  if (!isMounted) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        justifyContent: "flex-end",
      }}
    >
      {/* Overlay animé */}
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
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sheet animée */}
      <Animated.View
        style={[
          {
            paddingHorizontal: s(24),
            paddingTop: vs(16),
            paddingBottom: vs(40),
            gap: vs(24),
            borderTopLeftRadius: s(32),
            borderTopRightRadius: s(32),
          },
          sheetStyle,
        ]}
        className="bg-white dark:bg-dark-2"
      >
        {/* Handle */}
        <View
          style={{
            width: s(40),
            height: vs(4),
            borderRadius: s(4),
            alignSelf: "center",
          }}
          className="bg-greyscale-300"
        />

        <Text
          style={{ fontSize: s(20) }}
          className="text-center font-urbanist-bold text-greyscale-900 dark:text-white"
        >
          Filter
        </Text>

        {/* Speciality */}
        <View style={{ gap: vs(12) }}>
          <Text
            style={{ fontSize: s(16) }}
            className="font-urbanist-semibold text-greyscale-900 dark:text-white"
          >
            Speciality
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: s(10) }}
          >
            {SPECIALITIES.map((sp) => {
              const isActive = localFilter.speciality === sp;
              return (
                <Pressable
                  key={sp}
                  onPress={() =>
                    setLocalFilter((prev) => ({ ...prev, speciality: sp }))
                  }
                  style={{
                    paddingHorizontal: s(18),
                    paddingVertical: vs(8),
                    borderRadius: s(50),
                    borderWidth: 1.5,
                    borderColor: isActive ? "#246BFD" : "#E0E0E0",
                    backgroundColor: isActive ? "#246BFD" : "transparent",
                  }}
                >
                  <Text
                    style={{ fontSize: s(13) }}
                    className={
                      isActive
                        ? "font-urbanist-semibold text-white"
                        : "font-urbanist-semibold text-greyscale-700"
                    }
                  >
                    {sp}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Rating */}
        <View style={{ gap: vs(12) }}>
          <Text
            style={{ fontSize: s(16) }}
            className="font-urbanist-semibold text-greyscale-900 dark:text-white"
          >
            Rating
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: s(10) }}
          >
            {RATINGS.map((r) => {
              const isActive = localFilter.rating === r;
              return (
                <Pressable
                  key={r}
                  onPress={() =>
                    setLocalFilter((prev) => ({
                      ...prev,
                      rating: prev.rating === r ? null : r,
                    }))
                  }
                  style={{
                    paddingHorizontal: s(14),
                    paddingVertical: vs(8),
                    borderRadius: s(50),
                    borderWidth: 1.5,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: s(4),
                    borderColor: isActive ? "#246BFD" : "#E0E0E0",
                    backgroundColor: isActive ? "#246BFD" : "transparent",
                  }}
                >
                  <Text style={{ fontSize: s(13) }}>{"⭐"}</Text>
                  <Text
                    style={{ fontSize: s(13) }}
                    className={
                      isActive
                        ? "font-urbanist-semibold text-white"
                        : "font-urbanist-semibold text-greyscale-700"
                    }
                  >
                    {r}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: s(16), marginTop: vs(8) }}>
          <Pressable
            onPress={handleReset}
            style={{
              flex: 1,
              height: vs(52),
              borderRadius: s(50),
              borderWidth: 1.5,
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#246BFD",
            }}
          >
            <Text
              style={{ fontSize: s(16) }}
              className="font-urbanist-semibold text-primary-500"
            >
              Reset
            </Text>
          </Pressable>

          <Pressable
            onPress={handleApply}
            style={{
              flex: 1,
              height: vs(52),
              borderRadius: s(50),
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#246BFD",
            }}
          >
            <Text
              style={{ fontSize: s(16) }}
              className="font-urbanist-semibold text-white"
            >
              Apply
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default FilterBottomSheet;
