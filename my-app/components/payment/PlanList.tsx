import { ScrollView, View, Text } from "react-native";
import { PlanCard } from "./PlanCard";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import type { Plan, Subscription } from "@/backend/api/payment/types";
import { getProvider } from "@/backend/api/payment";

interface PlanListProps {
  plans: Plan[];
  subscription: Subscription | null;
  userCountry: string;
  isPaymentLoading: boolean;
  onSelectPlan: (plan: Plan) => void;
}

export function PlanList({
  plans,
  subscription,
  userCountry,
  isPaymentLoading,
  onSelectPlan,
}: PlanListProps) {
  const provider = getProvider(userCountry);
  const isIndia = provider === "razorpay";
  const currentPlanId =
    subscription?.status === "active" ? subscription.planId : "free";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-10"
    >
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-[#8B8A9B] text-sm">Payment via</Text>
        <PaymentMethodBadge provider={provider} />
      </View>

      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isCurrentPlan={currentPlanId === plan.id}
          isIndia={isIndia}
          isLoading={isPaymentLoading}
          onSelect={onSelectPlan}
        />
      ))}
    </ScrollView>
  );
}
