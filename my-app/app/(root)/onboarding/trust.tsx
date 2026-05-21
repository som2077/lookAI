// import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { Image, Text, View } from "react-native";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { useOnboardingState } from "@/store/onboarding-store";
import { useSupabase } from "@/hooks/useSupabase";

export default function TrustScreen() {
  const { userId } = useAuth();
  const { supabase } = useSupabase();
  const { completeOnboarding, isSaving } = useOnboardingState();

  const handleContinue = async () => {
    if (!userId) return;
    await completeOnboarding(userId, supabase);
  };

  return (
    // <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 px-6 pb-6 pt-2">
      <OnboardingHeader step={8} />

      {/* Top image */}
      <View className="mt-8 items-center">
        <Image
          source={require("@/assets/images/trust1.png")}
          className="h-80 w-80"
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text className="mt-3 text-center text-5xl py-4 font-bold text-[#1D1A27]">
        Thanks you for{"\n"}trusting us
      </Text>
      <Text className="mt-6 text-center font-medium text-2xl text-[#000000]">
        Now let&apos;s personalize Look AI for you...
      </Text>

      {/* Privacy badge */}
      <View className="mt-10 items-center">
        <Image
          source={require("@/assets/images/trust2.png")}
          className="w-[400px] h-40"
          resizeMode="cover"
        />
      </View>

      {/* Continue button */}
      <View className="mt-auto w-full">
        <ContinueButton onPress={handleContinue} disabled={isSaving} />
      </View>
    </View>
    // </SafeAreaView>
  );
}
