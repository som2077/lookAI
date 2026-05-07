import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { AppGradientBackground } from "@/components/ui/AppGradientBackground";

export default function GetStartedScreen() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const onGetStartedPress = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    router.replace("/(root)/(tabs)");
  };

  return (
    // <AppGradientBackground>
    <SafeAreaView className="flex-1 ">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Get Started
        </Text>

        <TouchableOpacity
          onPress={onGetStartedPress}
          disabled={isSaving}
          className="w-full bg-red-900 py-4 rounded-xl items-center"
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Get Started</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    // </AppGradientBackground>
  );
}
