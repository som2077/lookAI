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

// Legacy payment API functions (used by outfit.tsx sandbox)
const API_BASE_URL = process.env.EXPO_PUBLIC_PAYMENTS_API_BASE_URL;

function requireApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      "Missing EXPO_PUBLIC_PAYMENTS_API_BASE_URL environment variable. Set it to your backend base URL.",
    );
  }
  return API_BASE_URL;
}

async function parseJsonOrThrow(response: Response) {
  if (response.ok) return response.json();
  const payload = await response.text();
  throw new Error(`Payment API error (${response.status}): ${payload}`);
}

export type CreatePaymentRequest = {
  userId: string;
  amount: number;
  currency: string;
  country: string;
  orderType: "one_time" | "subscription";
  metadata?: Record<string, string>;
};

export type CreatePaymentResponse =
  | {
      provider: "razorpay";
      localOrderId: string;
      amount: number;
      currency: string;
      orderId: string;
      keyId: string;
    }
  | {
      provider: "stripe";
      localOrderId: string;
      amount: number;
      currency: string;
      paymentIntentId: string;
      paymentIntentClientSecret: string;
    };

export type PaymentStatus =
  | "created"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type PaymentStatusResponse = {
  localOrderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
};

export async function createPaymentIntent(
  payload: CreatePaymentRequest,
): Promise<CreatePaymentResponse> {
  const baseUrl = requireApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/payments/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response);
}

export async function getPaymentStatus(
  localOrderId: string,
): Promise<PaymentStatusResponse> {
  const baseUrl = requireApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/payments/${localOrderId}/status`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return parseJsonOrThrow(response);
}

export function resolveProvider(
  country: string,
  currency: string,
): PaymentProvider {
  const normalizedCountry = country.trim().toUpperCase();
  const normalizedCurrency = currency.trim().toUpperCase();
  if (normalizedCountry === "IN" && normalizedCurrency === "INR") {
    return "razorpay";
  }
  return "stripe";
}
