import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
    </SafeAreaView>
  );
}
