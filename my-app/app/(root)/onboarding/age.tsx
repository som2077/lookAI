import { router } from "expo-router";
import { Text, View } from "react-native";

import { AgePicker } from "@/components/onboarding/AgePicker";
import { BackButton } from "@/components/onboarding/BackButton";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { useOnboardingState } from "@/store/onboarding-store";

export default function AgeScreen() {
  const { age, setAge } = useOnboardingState();
  return (
    <View className="flex-1 px-6 pb-6 pt-2">
      <BackButton onPress={() => router.back()} />
      <ProgressIndicator step={2} />
      <Text className="text-center text-5xl font-semibold tracking-tight text-[#1D1A27]">
        How old are you?
      </Text>
      <AgePicker age={age} onChange={setAge} />
      <ContinueButton
        onPress={() => router.push("/(root)/onboarding/height")}
      />
    </View>
  );
}
