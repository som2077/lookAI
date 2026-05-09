import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const onboardingKey = (userId: string) => `onboarding_completed_${userId}`;

export default function SetupAccountScreen() {
  const { user } = useUser();

  useEffect(() => {
    const run = async () => {
      if (user?.id) await SecureStore.setItemAsync(onboardingKey(user.id), "true");
      router.replace("/(root)/(tabs)");
    };
    run();
  }, [user?.id]);

  return <SafeAreaView className="flex-1"><View className="flex-1 items-center justify-center gap-4"><Text className="text-2xl font-semibold text-gray-900">Setting up your account...</Text><ActivityIndicator size="large" color="#2563EB" /></View></SafeAreaView>;
}
