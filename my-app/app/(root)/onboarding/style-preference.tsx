import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { useOnboardingState } from "@/store/onboarding-store";

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
  const { stylePreferences, toggleStyle } = useOnboardingState();

  const handleContinue = () => {
    router.push("/(root)/onboarding/full-length-pics");
  };

  return (
    // <SafeAreaView className="flex-1">
    <View className="flex-1 gap-5 px-6 pb-6 pt-2">
      <OnboardingHeader step={5} />
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
        disabled={stylePreferences.length !== 3}
      />
    </View>
    // </SafeAreaView>
  );
}
