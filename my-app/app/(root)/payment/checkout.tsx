import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { ArrowLeft, CreditCard, Smartphone } from "lucide-react-native";
import { usePaymentStore } from "@/backend/store/payment-store";
import { getProvider } from "@/backend/api/payment";
import { PLAN_MAP } from "@/backend/config/plans";
import { PaymentMethodBadge } from "@/components/payment/PaymentMethodBadge";
import type { PlanId } from "@/backend/api/payment/types";

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { planId, planName, userCountry, userEmail } = useLocalSearchParams<{
    planId: PlanId;
    planName: string;
    userCountry: string;
    userEmail: string;
  }>();

  const { isPaymentInProgress, startPayment } = usePaymentStore();

  const provider = getProvider(userCountry ?? "");
  const isIndia = provider === "razorpay";
  const plan = planId ? PLAN_MAP[planId] : null;
  const price = plan
    ? isIndia
      ? `₹${plan.price.inr}`
      : `$${plan.price.usd}`
    : "";

  const handlePay = async () => {
    if (!user?.id || !planId) return;
    const token = await getToken();
    if (!token) return;

    const result = await startPayment(
      planId,
      user.id,
      userCountry ?? "",
      token,
      userEmail ?? user.primaryEmailAddress?.emailAddress,
    );

    if (result.success) {
      router.replace("/(root)/payment/success" as never);
    } else if (result.errorMessage !== "Payment cancelled") {
      router.replace("/(root)/payment/cancel" as never);
    }
  };

  useEffect(() => {
    handlePay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#0F0C1A]">
      <View className="flex-1 px-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 mb-8 w-10 h-10 items-center justify-center rounded-full bg-[#1D1A27]"
        >
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold mb-2">
          Confirm Payment
        </Text>
        <Text className="text-[#8B8A9B] text-sm mb-8">
          {`You're upgrading to the ${planName} plan`}
        </Text>

        <View className="bg-[#1D1A27] rounded-2xl p-5 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[#8B8A9B] text-sm">Plan</Text>
            <Text className="text-white font-semibold">{planName}</Text>
          </View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[#8B8A9B] text-sm">Amount</Text>
            <Text className="text-white font-semibold">{price}/month</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-[#8B8A9B] text-sm">Payment Method</Text>
            <PaymentMethodBadge provider={provider} />
          </View>
        </View>

        <View className="bg-[#1D1A27] rounded-2xl p-5 mb-8 flex-row items-center">
          {isIndia ? (
            <Smartphone size={20} color="#3395FF" />
          ) : (
            <CreditCard size={20} color="#635BFF" />
          )}
          <View className="ml-3 flex-1">
            <Text className="text-white text-sm font-semibold">
              {isIndia ? "Razorpay Checkout" : "Stripe Checkout"}
            </Text>
            <Text className="text-[#8B8A9B] text-xs mt-0.5">
              {isIndia
                ? "UPI, Net Banking, Cards & Wallets"
                : "Visa, Mastercard, Apple Pay & Google Pay"}
            </Text>
          </View>
        </View>

        {isPaymentInProgress ? (
          <View className="items-center py-6">
            <ActivityIndicator color="#A78BFA" size="large" />
            <Text className="text-[#8B8A9B] text-sm mt-4">
              Opening payment gateway...
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handlePay}
            className="bg-[#A78BFA] py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-base">Pay {price}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
