import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { Image, Text, View } from "react-native";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
// import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center px-6 pb-6 pt-2">
        {/* <ProgressIndicator step={8} /> */}

        {/* Top image */}
        <View className="mt-12">
          <Image
            source={require("@/assets/images/trust1.png")}
            className="h-48 w-48"
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text className="mt-8 text-center text-3xl font-bold text-[#1D1A27]">
          Thanks you for{"\n"}trusting us
        </Text>
        <Text className="mt-3 text-center text-base text-[#5A5566]">
          Now let&apos;s personalize Look AI for you...
        </Text>

        {/* Privacy badge */}
        <View className="mt-12">
          <Image
            source={require("@/assets/images/trust2.png")}
            className="h-24 w-72"
            resizeMode="contain"
          />
        </View>

        {/* Continue button */}
        <View className="mt-auto w-full">
          <ContinueButton onPress={handleContinue} disabled={isSaving} />
        </View>
      </View>
    </SafeAreaView>
  );
}
