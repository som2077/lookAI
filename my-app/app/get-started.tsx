import { Href, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { AppGradientBackground } from "../components/ui/AppGradientBackground";
const getStartedLogo = require("../assets/images/getStartedLogo.png");

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pb-6 pt-2">
        <View className="flex-1 items-center justify-center">
          <Image
            source={getStartedLogo}
            className="h-16 w-56"
            resizeMode="contain"
          />

          <Text className="mt-3 text-4xl font-semibold tracking-tight text-[#1D1A27]">
            Look AI
          </Text>

          <Text className="mt-10 text-center text-[44px] font-semibold leading-[52px] tracking-tight text-[#1D1A27]">
            Not trends. Your style.
          </Text>

          <Text className="mt-4 text-center text-lg font-medium text-[#5A5566]">
            Your perfect look, every time.
          </Text>
        </View>

        <View className="w-full">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/sign-in" as Href)}
            activeOpacity={0.9}
            className="w-full items-center rounded-2xl bg-[#1E1A24] py-4 shadow-sm"
          >
            <Text className="text-base font-semibold text-white">
              Get Started
            </Text>
          </TouchableOpacity>

          <Text className="mt-4 px-3 text-center text-xs leading-5 text-[#6A6574]">
            By continuing, you accept our Terms of Service and acknowledge our
            Privacy Policy.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
