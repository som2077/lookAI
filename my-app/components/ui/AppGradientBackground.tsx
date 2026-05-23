import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { View } from "react-native";

const GRADIENT_COLORS = ["#CACAD7", "#F5EBE7", "#FFFFFF"] as const;
const GRADIENT_LOCATIONS = [0.01, 0.35, 1] as const;
const GRADIENT_START = { x: 0.06, y: 0.15 };
const GRADIENT_END = { x: 0.82, y: 1 };

export const AppGradientBackground = React.memo(function AppGradientBackground({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        start={GRADIENT_START}
        end={GRADIENT_END}
        className="absolute inset-0"
      />
      {children}
    </View>
  );
});
