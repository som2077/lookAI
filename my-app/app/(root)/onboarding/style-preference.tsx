import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Pressable, Text, View } from "react-native";
import { BackButton } from "@/components/onboarding/BackButton";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { useOnboardingState } from "@/store/onboarding-store";
import { useSupabase } from "@/hooks/useSupabase";

const styles = [
  "Casual",
  "Streetwear",
  "Minimal",
  "Sporty",
  "Formal",
  "Vintage",
  "Bohemian",
  "Smart Casual",
];

export default function StylePreferenceScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { supabase } = useSupabase();
  const { stylePreferences, toggleStyle, completeOnboarding, isSaving } =
    useOnboardingState();

  const handleContinue = async () => {
    if (!userId) return;

    await completeOnboarding(userId, supabase);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 gap-5 px-6 pb-6 pt-2">
        <BackButton onPress={() => router.back()} />
        <ProgressIndicator step={7} />
        <Text className="text-3xl font-bold text-gray-900">
          Style preferences
        </Text>
        <Text className="text-sm text-gray-500">Choose exactly 3 styles</Text>
        <View className="flex-row flex-wrap gap-3">
          {styles.map((style) => {
            const selected = stylePreferences.includes(style);
            return (
              <Pressable
                key={style}
                onPress={() => toggleStyle(style)}
                className={`rounded-full border px-4 py-3 ${selected ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
              >
                <Text className="text-base text-gray-800">{style}</Text>
              </Pressable>
            );
          })}
        </View>
        <ContinueButton
          onPress={handleContinue}
          disabled={stylePreferences.length !== 3 || isSaving}
        />
      </View>
    </SafeAreaView>
  );
}
