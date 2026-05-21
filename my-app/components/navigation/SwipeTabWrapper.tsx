import React, { ReactNode } from "react";
import {
  Gesture,
  GestureDetector,
  Directions,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

const TAB_ROUTES = [
  "/(root)/(tabs)/",
  "/(root)/(tabs)/wardrobe",
  "/(root)/(tabs)/outfit",
  "/(root)/(tabs)/saved",
  "/(root)/(tabs)/profile",
] as const;

const SLIDE_DISTANCE = 80;
const ANIM_DURATION = 100;

interface SwipeTabWrapperProps {
  tabIndex: number;
  children: ReactNode;
}

export function SwipeTabWrapper({ tabIndex, children }: SwipeTabWrapperProps) {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
    flex: 1,
  }));

  const navigate = (route: string) => {
    router.navigate(route as never);
    translateX.value = 0;
    opacity.value = 1;
  };

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      if (tabIndex < TAB_ROUTES.length - 1) {
        translateX.value = withTiming(-SLIDE_DISTANCE, {
          duration: ANIM_DURATION,
          easing: Easing.out(Easing.quad),
        });
        opacity.value = withTiming(0, { duration: ANIM_DURATION }, () => {
          runOnJS(navigate)(TAB_ROUTES[tabIndex + 1]);
        });
      }
    });

  const swipeRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      if (tabIndex > 0) {
        translateX.value = withTiming(SLIDE_DISTANCE, {
          duration: ANIM_DURATION,
          easing: Easing.out(Easing.quad),
        });
        opacity.value = withTiming(0, { duration: ANIM_DURATION }, () => {
          runOnJS(navigate)(TAB_ROUTES[tabIndex - 1]);
        });
      }
    });

  const composed = Gesture.Exclusive(swipeLeft, swipeRight);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
}
