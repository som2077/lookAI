import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useOnboardingState } from "@/store/onboarding-store";
import { useSupabase } from "@/hooks/useSupabase";

export default function SetupAccountScreen() {
  const { user } = useUser();
  const { supabase, isInitializing } = useSupabase();
  const { completeOnboarding, isSaving, error } = useOnboardingState();

  useEffect(() => {
    if (isInitializing || !user?.id) return;

    void completeOnboarding(user.id, supabase);
  }, [isInitializing, supabase, completeOnboarding, user?.id]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-2xl font-semibold text-gray-900">
          Setting up your account...
        </Text>
        {(isSaving || isInitializing) && (
          <ActivityIndicator size="large" color="#2563EB" />
        )}
        {!!error && (
          <Text className="text-center text-sm text-red-500">{error}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
