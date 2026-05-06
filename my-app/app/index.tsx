import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Get Started
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/sign-in")}
          className="w-full bg-blue-600 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
