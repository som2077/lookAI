import { ReactNode } from "react";
import { View } from "react-native";

export function AppGradientBackground({ children }: { children: ReactNode }) {
  return <View className="flex-1 bg-[#FFFFFF]">{children}</View>;
}
