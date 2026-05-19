import * as WebBrowser from "expo-web-browser";
import type { StripeSession, PaymentResult } from "./types";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export async function createStripeSession(
  planId: string,
  userId: string,
  clerkToken: string
): Promise<StripeSession> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/create-stripe-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clerkToken}`,
      apikey: SUPABASE_ANON_KEY ?? "",
    },
    body: JSON.stringify({
      planId,
      userId,
      successUrl: "lookai://payment/success",
      cancelUrl: "lookai://payment/cancel",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create Stripe session");
  }

  return response.json();
}

export async function openStripeCheckout(session: StripeSession): Promise<PaymentResult> {
  const result = await WebBrowser.openAuthSessionAsync(
    session.sessionUrl,
    "lookai://payment"
  );

  if (result.type === "success") {
    const successUrl = (result as { type: "success"; url: string }).url;
    if (successUrl?.includes("lookai://payment/success")) {
      return { success: true, provider: "stripe" };
    }
    if (successUrl?.includes("lookai://payment/cancel")) {
      return { success: false, provider: "stripe", errorMessage: "Payment cancelled" };
    }
  }

  if (result.type === "cancel") {
    return { success: false, provider: "stripe", errorMessage: "Payment cancelled" };
  }

  return { success: false, provider: "stripe", errorMessage: "Payment failed or closed" };
}
