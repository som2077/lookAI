import { router } from "expo-router";
import { Text, View } from "react-native";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { HeightPicker } from "@/components/onboarding/HeightPicker";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { useOnboardingState } from "@/store/onboarding-store";

export default function HeightScreen() {
  const { height, setHeight } = useOnboardingState();
  return (
    // <SafeAreaView className="flex-1">
    <View className="flex-1 px-6 pb-6 pt-2">
      <OnboardingHeader step={3} />
      <Text className="text-5xl font-semibold tracking-tight text-[#1D1A27]">
        What is your height?
      </Text>
      <HeightPicker height={height} onChange={setHeight} />
      <ContinueButton
        onPress={() => router.push("/(root)/onboarding/body-type")}
      />
    </View>
    // </SafeAreaView>
  );
}
