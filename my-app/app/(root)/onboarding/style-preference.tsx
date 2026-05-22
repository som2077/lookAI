import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { useOnboardingState } from "@/backend/store/onboarding-store";

const styles = [
  "Casual",
  "Streetwear",
  "Y2k",
  "Preppy",
  "Scandinavian",
  "Oversized",
  "Glam",
  "Minimal",
  "Smart casual",
  "Business Casual",
  "Quiet Luxury",
  "Old Money",
  "Luxury",
  "Vintage",
  "Bohemian",
  "Soft",
  "Athleisure",
  "Formal",
  "Edgy",
  "Dark",
  "Party",
  "Light",
  "Techwear",
  "Sporty",
  "Grunge",
  "Vacation",
  "Not sure",
];

export default function StylePreferenceScreen() {
  const router = useRouter();
  const { stylePreferences, toggleStyle } = useOnboardingState();

  const handleContinue = () => {
    router.push("/(root)/onboarding/full-length-pics");
  };

  return (
    // <SafeAreaView className="flex-1">
    <View className="flex-1 px-5 pb-6 pt-2">
      <OnboardingHeader step={5} />
      <Text className="text-4xl font-semibold tracking-tight text-center text-[#1D1A27]">
        Style preferences
      </Text>
      <Text className="mt-2 text-xl text-center text-[#000000]">
        Select fashion styles you like most.
      </Text>
      <View className="flex-row flex-wrap gap-3 mt-8 items-center justify-center">
        {styles.map((style) => {
          const selected = stylePreferences.includes(style);
          return (
            <Pressable
              key={style}
              onPress={() => toggleStyle(style)}
              className={`rounded-full border px-4 py-3 ${
                selected
                  ? "border-black bg-black"
                  : "border-transparent bg-[#ECEDF9]"
              }`}
            >
              <Text
                className={`text-base ${
                  selected ? "font-medium text-white" : "text-[#1D1A27]"
                }`}
              >
                {style}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text className="mt-10  text-sm font-medium text-center text-[#000000]">
        Choose up to 5 styles that feel most like you.
      </Text>
      <ContinueButton
        onPress={handleContinue}
        disabled={stylePreferences.length > 5}
      />
    </View>
    // </SafeAreaView>
  );
}
