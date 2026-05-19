import type {
  PaymentProvider,
  PaymentIntent,
  PaymentResult,
  PlanId,
} from "./types";
import { createRazorpayOrder, openRazorpayCheckout } from "./razorpay";
import { createStripeSession, openStripeCheckout } from "./stripe";

export type { PaymentProvider, PaymentIntent, PaymentResult, PlanId };
export type { Plan, Subscription, SubscriptionStatus, Currency } from "./types";

export function getProvider(userCountry: string): PaymentProvider {
  const indiaCountryCodes = ["IN", "IND", "india"];
  const isIndia = indiaCountryCodes.some((code) =>
    userCountry.toLowerCase().includes(code.toLowerCase()),
  );
  return isIndia ? "razorpay" : "stripe";
}

export async function initiatePayment(
  intent: PaymentIntent,
): Promise<PaymentResult> {
  const { provider, planId, userId } = intent;

  const clerkToken = intent.userId;

  try {
    if (provider === "razorpay") {
      const order = await createRazorpayOrder(planId, userId, clerkToken);
      return await openRazorpayCheckout(order, planId, "");
    }

    if (provider === "stripe") {
      const session = await createStripeSession(planId, userId, clerkToken);
      return await openStripeCheckout(session);
    }

    return {
      success: false,
      provider,
      errorMessage: "Unknown payment provider",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment failed";
    return { success: false, provider, errorMessage: message };
  }
}

export async function initiatePaymentWithToken(
  intent: PaymentIntent,
  clerkToken: string,
  userEmail?: string,
): Promise<PaymentResult> {
  const { provider, planId, userId } = intent;

  try {
    if (provider === "razorpay") {
      const order = await createRazorpayOrder(planId, userId, clerkToken);
      return await openRazorpayCheckout(order, planId, userEmail ?? "");
    }

    if (provider === "stripe") {
      const session = await createStripeSession(planId, userId, clerkToken);
      return await openStripeCheckout(session);
    }

    return {
      success: false,
      provider,
      errorMessage: "Unknown payment provider",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment failed";
    return { success: false, provider, errorMessage: message };
  }
}
