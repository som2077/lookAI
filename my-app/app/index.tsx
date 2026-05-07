import { useAuth } from "@clerk/clerk-expo";
import { Href, Redirect, useRouter } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppGradientBackground } from "../components/ui/AppGradientBackground";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#2563EB" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)" />;
  }

  return (
    <AppGradientBackground>
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Get Started
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-in" as Href)}
          className="w-full bg-[#1E1A24] py-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">Get Started</Text>
        </TouchableOpacity>

        <Text>
        By continuing, you accept our Terms of Service and acknowledge our Privacy Policy. You can tap them to view details.
        </Text>
      </View>
    </SafeAreaView>
    </AppGradientBackground>
  );
}
