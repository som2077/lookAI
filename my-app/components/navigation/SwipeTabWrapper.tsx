import React, { ReactNode } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector, Directions } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const TAB_ROUTES = [
  "/(root)/(tabs)/",
  "/(root)/(tabs)/wardrobe",
  "/(root)/(tabs)/outfit",
  "/(root)/(tabs)/saved",
  "/(root)/(tabs)/profile",
] as const;

interface SwipeTabWrapperProps {
  tabIndex: number;
  children: ReactNode;
}

export function SwipeTabWrapper({ tabIndex, children }: SwipeTabWrapperProps) {
  const router = useRouter();

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => {
      if (tabIndex < TAB_ROUTES.length - 1) {
        router.navigate(TAB_ROUTES[tabIndex + 1] as never);
      }
    });

  const swipeRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(() => {
      if (tabIndex > 0) {
        router.navigate(TAB_ROUTES[tabIndex - 1] as never);
      }
    });

  const composed = Gesture.Simultaneous(swipeLeft, swipeRight);

  return (
    <GestureDetector gesture={composed}>
      <View className="flex-1">{children}</View>
    </GestureDetector>
  );
}
