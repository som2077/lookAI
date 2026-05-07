import { Href, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppGradientBackground } from "../components/ui/AppGradientBackground";

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <AppGradientBackground>
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-3xl font-bold text-gray-800 mb-6">Get Started</Text>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/sign-in" as Href)}
            className="w-full bg-[#1E1A24] py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-base">Get Started</Text>
          </TouchableOpacity>

          <Text>
            By continuing, you accept our Terms of Service and acknowledge our Privacy Policy. You can tap
            them to view details.
          </Text>
        </View>
      </SafeAreaView>
    </AppGradientBackground>
  );
}
