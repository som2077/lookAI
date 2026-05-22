import { View, Text } from "react-native";
import type { PaymentProvider } from "@/backend/api/payment/types";

interface PaymentMethodBadgeProps {
  provider: PaymentProvider;
}

export function PaymentMethodBadge({ provider }: PaymentMethodBadgeProps) {
  const isRazorpay = provider === "razorpay";

  return (
    <View
      className={`flex-row items-center px-3 py-1 rounded-full ${
        isRazorpay ? "bg-[#3395FF]/15" : "bg-[#635BFF]/15"
      }`}
    >
      <Text
        className={`text-xs font-semibold ${
          isRazorpay ? "text-[#3395FF]" : "text-[#635BFF]"
        }`}
      >
        {isRazorpay ? "UPI / Cards (India)" : "International Card"}
      </Text>
    </View>
  );
}
