import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, TouchableOpacity } from "react-native";
import { useOnboardingState } from "@/store/onboarding-store";

export default function SetupAccountScreen() {
  const { user } = useUser();
  const { saveToSupabase, isSaving, error, clearError } = useOnboardingState();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const run = async () => {
      if (!user?.id) return;

      const ok = await saveToSupabase(user.id);
      if (ok) {
        // Navigate only on success
        router.replace("/(root)/(tabs)");
      } else if (retryCount < MAX_RETRIES) {
        // Auto-retry on failure
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, 2000); // Wait 2 seconds before retry
      }
    };

    run();
  }, [saveToSupabase, user?.id, retryCount]);

  const handleManualRetry = async () => {
    if (!user?.id) return;
    setRetryCount(0);
    clearError();
    await saveToSupabase(user.id);
  };

  const showRetryButton = !!error && retryCount >= MAX_RETRIES;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <Text className="text-2xl font-semibold text-gray-900">Setting up your account...</Text>

        {isSaving && <ActivityIndicator size="large" color="#2563EB" />}

        {!isSaving && error && (
          <View className="gap-3 w-full">
            <Text className="text-center text-sm text-red-600 font-medium">
              {error}
            </Text>
            {showRetryButton ? (
              <TouchableOpacity
                onPress={handleManualRetry}
                className="bg-blue-600 rounded-lg py-3 px-6 active:bg-blue-700"
              >
                <Text className="text-white text-center font-semibold">Try Again</Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-center text-xs text-gray-500">
                Retrying... (Attempt {retryCount + 1}/{MAX_RETRIES})
              </Text>
            )}
          </View>
        )}

        {retryCount > 0 && !error && (
          <Text className="text-center text-xs text-gray-600">
            Retry attempt {retryCount}/{MAX_RETRIES}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
