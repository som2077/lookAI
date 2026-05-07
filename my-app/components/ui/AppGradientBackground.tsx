import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { View } from "react-native";

export function AppGradientBackground({ children }: { children: ReactNode }) {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#CACAD7", "#F5EBE7", "#FFFFFF"]}
        locations={[0.01, 0.35, 1]}
        start={{ x: 0.06, y: 0.15 }}
        end={{ x: 0.82, y: 1 }}
        className="absolute inset-0"
      />
      {children}
    </View>
  );
}
