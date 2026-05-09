import { router } from "expo-router";
import { Image, Text, View } from "react-native";

import { ContinueButton } from "@/components/onboarding/ContinueButton";

export default function OnboardingIndex() {
  return (
    <View className="flex-1 px-6 pb-6 pt-2">
      <View className="flex-1 items-center justify-center gap-6">
        <Image source={require("../../../assets/images/kribb.png")} className="h-56 w-56 rounded-3xl" resizeMode="cover" />
        <Text className="text-3xl font-bold text-gray-900">Welcome to LookAI</Text>
        <Text className="text-center text-base text-gray-500">Let&apos;s personalize your experience in a few quick steps.</Text>
      </View>
      <ContinueButton onPress={() => router.push("/(root)/onboarding/age")} />
    </View>
  );
}
