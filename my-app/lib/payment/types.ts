export type PaymentProvider = "razorpay" | "stripe";

export type SubscriptionStatus = "active" | "inactive" | "expired" | "cancelled" | "pending";

export type PlanId = "free" | "pro" | "premium";

export type Currency = "INR" | "USD";

export interface PlanPrice {
  inr: number;
  usd: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: PlanPrice;
  billingCycle: "monthly" | "yearly";
  features: string[];
  isPopular?: boolean;
  razorpayPlanId?: string;
  stripePriceId?: string;
}

export interface PaymentIntent {
  provider: PaymentProvider;
  planId: PlanId;
  currency: Currency;
  amount: number;
  userId: string;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface StripeSession {
  sessionId: string;
  sessionUrl: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanId;
  provider: PaymentProvider;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  createdAt: string;
}

export interface PaymentEvent {
  id: string;
  userId: string;
  provider: PaymentProvider;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface PaymentResult {
  success: boolean;
  provider: PaymentProvider;
  subscriptionId?: string;
  errorMessage?: string;
}
