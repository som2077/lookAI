import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { useOnboardingState } from "@/backend/store/onboarding-store";

export default function TrustScreen() {
  const router = useRouter();
  const { error } = useOnboardingState();

  const handleContinue = () => {
    router.push("/(root)/onboarding/setup-account" as never);
  };

  return (
    <View className="flex-1 px-6 pb-6 pt-2">
      <OnboardingHeader step={8} />

      <View className="mt-8 items-center">
        <Image
          source={require("@/assets/images/trust1.png")}
          className="h-80 w-80"
          resizeMode="contain"
        />
      </View>

      <Text className="mt-3 text-center text-5xl py-4 font-bold text-[#1D1A27]">
        Thanks you for{"\n"}trusting us
      </Text>
      <Text className="mt-6 text-center font-medium text-2xl text-[#000000]">
        Now let&apos;s personalize Look AI for you...
      </Text>

      <View className="mt-10 items-center">
        <Image
          source={require("@/assets/images/trust2.png")}
          className="w-[400px] h-40"
          resizeMode="cover"
        />
      </View>

      {!!error && (
        <Text className="mt-4 text-center text-sm text-red-500">{error}</Text>
      )}

      <View className="mt-auto w-full">
        <ContinueButton onPress={handleContinue} />
      </View>
    </View>
  );
}
