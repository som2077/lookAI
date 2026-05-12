import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";

export default function FullLengthPicsScreen() {
  const router = useRouter();

  const handleUpload = () => {
    // TODO: Implement image picker logic
    router.push("/(root)/onboarding/nickname" as any);
  };

  const handleSkip = () => {
    router.push("/(root)/onboarding/nickname" as any);
  };

  return (
    // <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 px-6 pb-6 pt-2">
      <OnboardingHeader step={6} />

      <Text className="mt-4 text-center text-3xl font-bold text-[#1D1A27]">
        2 full-lenght pics
      </Text>
      <Text className="mt-3 text-center text-base leading-6 text-[#5A5566]">
        In order to understand your body shape, we need two full-lenght photos
        of you.
      </Text>

      {/* Example images */}
      <View className="mt-8 flex-row items-center justify-center gap-4">
        <Image
          source={require("@/assets/images/two-full-lenght1.png")}
          className="h-48 w-36 rounded-2xl"
          resizeMode="cover"
        />
        <Image
          source={require("@/assets/images/two-full-lenght2.png")}
          className="h-48 w-36 rounded-2xl"
          resizeMode="cover"
        />
      </View>

      {/* Tips */}
      <View className="mt-10 items-center gap-2">
        <Text className="text-base font-semibold text-[#1D1A27]">
          For Best Results
        </Text>
        <Text className="text-sm text-[#5A5566]">Just you, no friends</Text>
        <Text className="text-sm text-[#5A5566]">
          Full-length, but close-up
        </Text>
        <Text className="text-sm text-[#5A5566]">No bags, pets or phones</Text>
        <Text className="text-sm text-[#5A5566]">
          No glasses, hats, or airpods
        </Text>
      </View>

      {/* Buttons */}
      <View className="mt-auto gap-4">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleUpload}
          className="items-center rounded-2xl bg-[#1B1623] py-4"
        >
          <Text className="text-base font-semibold text-white">
            Upload Image
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          className="items-center py-2"
        >
          <Text className="text-sm font-medium text-[#5A5566]">Skip now →</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </SafeAreaView>
  );
}
