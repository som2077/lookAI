import { router } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

import { AgePicker } from "./components/AgePicker";
import { BackButton } from "./components/BackButton";
import { ContinueButton } from "./components/ContinueButton";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { useOnboardingState } from "./state";

export default function AgeScreen() {
  const { age, setAge } = useOnboardingState();
  return <SafeAreaView className="flex-1"><View className="flex-1 px-6 pb-6 pt-2"><BackButton onPress={() => router.back()} /><ProgressIndicator step={2} /><Text className="text-center text-5xl font-semibold tracking-tight text-[#1D1A27]">How old are you?</Text><AgePicker age={age} onChange={setAge} /><ContinueButton onPress={() => router.push("/(root)/onboarding/height")} /></View></SafeAreaView>;
}
