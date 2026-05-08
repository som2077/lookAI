import { Stack } from "expo-router";
import { OnboardingProvider } from "./state";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </OnboardingProvider>
  );
}
