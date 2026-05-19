export type PaymentProvider = "razorpay" | "stripe";

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

export type PaymentStatus = "created" | "pending" | "paid" | "failed" | "refunded";

export type PaymentStatusResponse = {
  localOrderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
};

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

export async function verifyRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ ok: true; status: "paid" }> {
  const baseUrl = requireApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/payments/verify-razorpay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonOrThrow(response);
}

export async function getPaymentStatus(localOrderId: string): Promise<PaymentStatusResponse> {
  const baseUrl = requireApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/payments/${localOrderId}/status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return parseJsonOrThrow(response);
}

export function resolveProvider(country: string, currency: string): PaymentProvider {
  const normalizedCountry = country.trim().toUpperCase();
  const normalizedCurrency = currency.trim().toUpperCase();

  if (normalizedCountry === "IN" && normalizedCurrency === "INR") {
    return "razorpay";
  }

  return "stripe";
}
