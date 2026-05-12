import { useRouter } from "expo-router";
import { Text, TextInput, View } from "react-native";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { useOnboardingState } from "@/store/onboarding-store";

const MAX_LENGTH = 15;

export default function NicknameScreen() {
  const router = useRouter();
  const { nickname, setNickname } = useOnboardingState();

  const handleContinue = () => {
    if (!nickname.trim()) return;
    router.push("/(root)/onboarding/trust" as any);
  };

  return (
    // <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 px-6 pb-6 pt-2">
      <OnboardingHeader step={7} />

      <Text className="mt-6 text-3xl font-bold text-[#1D1A27]">
        Create nickname
      </Text>
      <Text className="mt-3 text-base leading-6 text-[#5A5566]">
        This can be anything you like and can be changed later.
      </Text>

      <TextInput
        value={nickname}
        onChangeText={(text) => {
          if (text.length <= MAX_LENGTH) setNickname(text);
        }}
        placeholder="Add your nickname"
        placeholderTextColor="#9CA3AF"
        maxLength={MAX_LENGTH}
        className="mt-8 rounded-xl border border-gray-200 px-4 py-4 text-base text-[#1D1A27]"
      />

      <Text className="mt-2 text-sm text-[#5A5566]">
        {nickname.length}/{MAX_LENGTH}
      </Text>

      <View className="mt-auto">
        <ContinueButton onPress={handleContinue} disabled={!nickname.trim()} />
      </View>
    </View>
    // </SafeAreaView>
  );
}
