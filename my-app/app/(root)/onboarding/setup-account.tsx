import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useOnboardingState } from "@/store/onboarding-store";

export default function SetupAccountScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { saveToSupabase, isSaving, error } = useOnboardingState();

  useEffect(() => {
    const run = async () => {
      if (!user?.id) return;
      const token = await getToken();
      if (!token) return;
      const ok = await saveToSupabase(user.id, token);
      if (ok) router.replace("/(root)/(tabs)");
    };

    run();
  }, [getToken, saveToSupabase, user?.id]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-2xl font-semibold text-gray-900">Setting up your account...</Text>
        {isSaving && <ActivityIndicator size="large" color="#2563EB" />}
        {!!error && <Text className="text-center text-sm text-red-500">{error}</Text>}
      </View>
    </SafeAreaView>
  );
}
