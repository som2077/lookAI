import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { View } from "react-native";

export function AppGradientBackground({ children }: { children: ReactNode }) {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#FFFFFF", "#F5EBE7", "#CACAD7"]}
        locations={[0.01, 0.35, 1]}
        start={{ x: 0.94, y: 0.15 }}
        end={{ x: 0.18, y: 1 }}
        className="absolute inset-0"
      />
      {children}
    </View>
  );
}
