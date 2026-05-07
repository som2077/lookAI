import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getStartedLogo = require("../assets/images/kribb.png");

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F5EBE7", "#CACAD7"]}
      locations={[0.01, 0.35, 1]}
      start={{ x: 0.94, y: 0.15 }}
      end={{ x: 0.18, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-4 pb-6">
          <View className="flex-1 items-center justify-center">
            <Image source={getStartedLogo} className="h-14 w-56" resizeMode="contain" />

            <Text className="mt-3 text-[52px] font-semibold tracking-tight text-[#1D1A27]">Look AI</Text>

            <Text className="mt-28 text-center text-[52px] font-semibold leading-[56px] tracking-tight text-[#8A8791]">
              Not trends. Your style.
            </Text>

            <Text className="mt-4 text-center text-[38px] font-semibold tracking-tight text-[#1D1A27]">
              Your perfect look, every time.
            </Text>
          </View>

          <View className="gap-6">
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-in")}
              activeOpacity={0.9}
              className="w-full items-center rounded-2xl bg-[#1A1827] py-5 shadow-sm"
            >
              <Text className="text-2xl font-semibold text-white">Get Started</Text>
            </TouchableOpacity>

            <Text className="text-center text-sm leading-5 text-[#4A4754]">
              By continuing, you accept our <Text className="font-semibold">Terms of Service</Text> and acknowledge our <Text className="font-semibold">Privacy Policy</Text>. You can tap them to view details.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
