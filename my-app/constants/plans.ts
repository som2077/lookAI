import type { Plan } from "@/lib/payment/types";

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Get started with basic features",
    price: { inr: 0, usd: 0 },
    billingCycle: "monthly",
    features: [
      "Up to 10 wardrobe items",
      "Basic outfit suggestions",
      "3 AI outfit generations/month",
      "Standard filters",
    ],
    razorpayPlanId: undefined,
    stripePriceId: undefined,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Perfect for fashion enthusiasts",
    price: { inr: 299, usd: 4 },
    billingCycle: "monthly",
    isPopular: true,
    features: [
      "Unlimited wardrobe items",
      "AI-powered outfit suggestions",
      "50 AI outfit generations/month",
      "Advanced style filters",
      "Save & organize outfits",
      "Priority support",
    ],
    razorpayPlanId: process.env.EXPO_PUBLIC_RAZORPAY_PRO_PLAN_ID,
    stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
  {
    id: "premium",
    name: "Premium",
    description: "For the ultimate style experience",
    price: { inr: 699, usd: 9 },
    billingCycle: "monthly",
    features: [
      "Everything in Pro",
      "Unlimited AI outfit generations",
      "Personal style profile",
      "Exclusive seasonal lookbooks",
      "Early access to new features",
      "Dedicated support",
    ],
    razorpayPlanId: process.env.EXPO_PUBLIC_RAZORPAY_PREMIUM_PLAN_ID,
    stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
  },
];

export const FREE_PLAN = PLANS[0];
export const PRO_PLAN = PLANS[1];
export const PREMIUM_PLAN = PLANS[2];

export const PLAN_MAP: Record<string, Plan> = Object.fromEntries(
  PLANS.map((plan) => [plan.id, plan])
);
