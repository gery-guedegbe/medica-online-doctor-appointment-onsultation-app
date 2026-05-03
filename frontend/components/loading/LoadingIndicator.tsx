import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { s } from "@utils/styling";

const TOTAL_DOTS = 8;

interface LoadingIndicatorProps {
  size?: number;
  color?: string;
}

const LoadingIndicator = ({
  size = 60,
  color = "#246BFD",
}: LoadingIndicatorProps) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const containerSize = s(size);
  const dotSize = Math.round(containerSize / 5.5);
  const radius = containerSize / 2 - dotSize;

  return (
    <Animated.View
      style={[{ width: containerSize, height: containerSize }, animatedStyle]}
    >
      {Array.from({ length: TOTAL_DOTS }).map((_, i) => {
        const angleRad = ((i * 360) / TOTAL_DOTS - 90) * (Math.PI / 180);
        const x = Math.cos(angleRad) * radius + containerSize / 2 - dotSize / 2;
        const y = Math.sin(angleRad) * radius + containerSize / 2 - dotSize / 2;
        const opacity = Number(((i + 1) / TOTAL_DOTS).toFixed(2));

        return (
          <View
            key={i}
            style={{
              position: "absolute",
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
              opacity,
              left: x,
              top: y,
            }}
          />
        );
      })}
    </Animated.View>
  );
};

export default LoadingIndicator;
