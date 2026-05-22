import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { PlanList } from "@/components/payment/PlanList";
import {
  usePaymentStore,
  isSubscriptionActive,
} from "@/backend/store/payment-store";
import { PLANS } from "@/backend/config/plans";
import type { Plan } from "@/backend/api/payment/types";

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();

  const {
    subscription,
    isLoading,
    isPaymentInProgress,
    error,
    fetchSubscription,
    clearError,
  } = usePaymentStore();

  const userId = user?.id ?? "";
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const userCountry =
    (user?.unsafeMetadata?.country as string) ??
    Intl.DateTimeFormat().resolvedOptions().locale;

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const token = await getToken();
      if (token) await fetchSubscription(userId, token);
    })();
  }, [userId]);

  useEffect(() => {
    if (error) {
      Alert.alert("Payment Error", error, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error]);

  const handleSelectPlan = async (plan: Plan) => {
    if (!userId) return;
    router.push({
      pathname: "/(root)/payment/checkout" as never,
      params: {
        planId: plan.id,
        planName: plan.name,
        userCountry,
        userEmail,
      },
    });
  };

  const isActive = isSubscriptionActive(subscription);

  return (
    <SafeAreaView className="flex-1 bg-[#0F0C1A]">
      <View className="flex-1 px-5 pt-4">
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold">
            Choose Your Plan
          </Text>
          <Text className="text-[#8B8A9B] text-sm mt-1">
            {isActive
              ? `Active plan: ${subscription?.planId?.toUpperCase()}`
              : "Upgrade to unlock premium features"}
          </Text>
        </View>

        <PlanList
          plans={PLANS}
          subscription={subscription}
          userCountry={userCountry}
          isPaymentLoading={isPaymentInProgress || isLoading}
          onSelectPlan={handleSelectPlan}
        />
      </View>
    </SafeAreaView>
  );
}
