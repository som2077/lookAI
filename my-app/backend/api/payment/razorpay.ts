import * as WebBrowser from "expo-web-browser";
import type { RazorpayOrder, PaymentResult } from "./types";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export async function createRazorpayOrder(
  planId: string,
  userId: string,
  clerkToken: string,
): Promise<RazorpayOrder> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/create-razorpay-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clerkToken}`,
        apikey: SUPABASE_ANON_KEY ?? "",
      },
      body: JSON.stringify({ planId, userId, currency: "INR" }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create Razorpay order");
  }

  return response.json();
}

export async function openRazorpayCheckout(
  order: RazorpayOrder,
  planId: string,
  userEmail: string,
): Promise<PaymentResult> {
  const checkoutUrl = buildRazorpayCheckoutUrl(order, planId, userEmail);

  const result = await WebBrowser.openAuthSessionAsync(
    checkoutUrl,
    "lookai://payment",
  );

  if (result.type === "success") {
    const successUrl = (result as { type: "success"; url: string }).url;
    if (successUrl?.includes("lookai://payment/success")) {
      return { success: true, provider: "razorpay" };
    }
    if (successUrl?.includes("lookai://payment/cancel")) {
      return {
        success: false,
        provider: "razorpay",
        errorMessage: "Payment cancelled",
      };
    }
  }

  if (result.type === "cancel") {
    return {
      success: false,
      provider: "razorpay",
      errorMessage: "Payment cancelled",
    };
  }

  return {
    success: false,
    provider: "razorpay",
    errorMessage: "Payment failed or closed",
  };
}

function buildRazorpayCheckoutUrl(
  order: RazorpayOrder,
  planId: string,
  email: string,
): string {
  const params = new URLSearchParams({
    key: order.keyId,
    order_id: order.orderId,
    amount: String(order.amount),
    currency: order.currency,
    name: "LookAI",
    description: `${planId} Plan Subscription`,
    prefill_email: email,
    callback_url: "lookai://payment/success",
    cancel_url: "lookai://payment/cancel",
  });

  return `https://api.razorpay.com/v1/checkout/embedded?${params.toString()}`;
}
