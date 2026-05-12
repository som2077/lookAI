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
    <View className="flex-1 px-5 pb-6 pt-2">
      <OnboardingHeader step={6} />

      <Text className="text-4xl font-semibold tracking-tight px-3 text-[#1D1A27]">
        Full length pics
      </Text>
      <Text className="mt-2 text-xl px-3 text-[#000000]">
        This helps AI understand your body shape and styling needs.
      </Text>

      {/* Example images */}
      <View className="mt-5 flex-1 items-center   justify-center">
        <Image
          source={require("@/assets/images/full-lenght.png")}
          className="h-[370px] w-[370px] "
          resizeMode="cover"
        />
      </View>

      {/* Tips */}
      <View className="mt-3 items-center gap-2">
        <Text className="text-sm font-medium text-center text-[#000000]">
          Please upload a clear full-length photo with no close-ups, glasses,
          hats, AirPods, bags, pets, or phones.
        </Text>
      </View>

      {/* Buttons */}
      <View className="mt-14 gap-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          className="items-center rounded-2xl bg-[#ECEDF9] py-5"
        >
          <Text className="text-lg font-bold text-[#000000]">Skip now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleUpload}
          className="items-center rounded-2xl bg-[#000000] py-5"
        >
          <Text className="text-base font-semibold text-white">
            Upload Image
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    // </SafeAreaView>
  );
}
