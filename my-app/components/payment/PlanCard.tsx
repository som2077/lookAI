import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Check, Star } from "lucide-react-native";
import type { Plan } from "@/lib/payment/types";

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan: boolean;
  isIndia: boolean;
  isLoading: boolean;
  onSelect: (plan: Plan) => void;
}

export function PlanCard({ plan, isCurrentPlan, isIndia, isLoading, onSelect }: PlanCardProps) {
  const isFree = plan.id === "free";
  const price = isIndia ? plan.price.inr : plan.price.usd;
  const currencySymbol = isIndia ? "₹" : "$";

  return (
    <View
      className={`rounded-2xl p-5 mb-4 border ${
        plan.isPopular
          ? "border-[#A78BFA] bg-[#1D1A27]"
          : "border-[#2E2A3B] bg-[#161322]"
      }`}
    >
      {plan.isPopular && (
        <View className="flex-row items-center mb-3">
          <Star size={14} color="#A78BFA" fill="#A78BFA" />
          <Text className="text-[#A78BFA] text-xs font-semibold ml-1">Most Popular</Text>
        </View>
      )}

      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white text-xl font-bold">{plan.name}</Text>
        {isCurrentPlan && (
          <View className="bg-[#22C55E]/20 px-2 py-1 rounded-full">
            <Text className="text-[#22C55E] text-xs font-semibold">Current</Text>
          </View>
        )}
      </View>

      <Text className="text-[#8B8A9B] text-sm mb-4">{plan.description}</Text>

      <View className="flex-row items-baseline mb-5">
        {isFree ? (
          <Text className="text-white text-3xl font-bold">Free</Text>
        ) : (
          <>
            <Text className="text-white text-3xl font-bold">
              {currencySymbol}{price}
            </Text>
            <Text className="text-[#8B8A9B] text-sm ml-1">/month</Text>
          </>
        )}
      </View>

      <View className="mb-5 gap-y-2">
        {plan.features.map((feature) => (
          <View key={feature} className="flex-row items-center">
            <Check size={16} color="#A78BFA" />
            <Text className="text-[#C4C0D4] text-sm ml-2 flex-1">{feature}</Text>
          </View>
        ))}
      </View>

      {!isFree && (
        <TouchableOpacity
          onPress={() => onSelect(plan)}
          disabled={isCurrentPlan || isLoading}
          className={`py-3 rounded-xl items-center justify-center ${
            isCurrentPlan
              ? "bg-[#2E2A3B]"
              : plan.isPopular
              ? "bg-[#A78BFA]"
              : "bg-[#2E2A3B] border border-[#A78BFA]"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text
              className={`text-sm font-semibold ${
                isCurrentPlan
                  ? "text-[#8B8A9B]"
                  : plan.isPopular
                  ? "text-white"
                  : "text-[#A78BFA]"
              }`}
            >
              {isCurrentPlan ? "Current Plan" : `Get ${plan.name}`}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
