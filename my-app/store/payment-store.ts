import { create } from "zustand";
import type { Subscription, SubscriptionStatus, PlanId, PaymentIntent, PaymentResult } from "@/lib/payment/types";
import { initiatePaymentWithToken, getProvider } from "@/lib/payment";
import { createSupabaseClient } from "@/lib/supabase";

interface PaymentState {
  subscription: Subscription | null;
  isLoading: boolean;
  isPaymentInProgress: boolean;
  error: string | null;

  fetchSubscription: (userId: string, clerkToken: string) => Promise<void>;
  startPayment: (
    planId: PlanId,
    userId: string,
    userCountry: string,
    clerkToken: string,
    userEmail?: string
  ) => Promise<PaymentResult>;
  clearError: () => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  subscription: null,
  isLoading: false,
  isPaymentInProgress: false,
  error: null,

  fetchSubscription: async (userId: string, clerkToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createSupabaseClient(clerkToken);
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(error.message);
      }

      set({ subscription: data ?? null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch subscription";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  startPayment: async (
    planId: PlanId,
    userId: string,
    userCountry: string,
    clerkToken: string,
    userEmail?: string
  ): Promise<PaymentResult> => {
    set({ isPaymentInProgress: true, error: null });

    try {
      const provider = getProvider(userCountry);
      const intent: PaymentIntent = {
        provider,
        planId,
        userId,
        currency: provider === "razorpay" ? "INR" : "USD",
        amount: 0,
      };

      const result = await initiatePaymentWithToken(intent, clerkToken, userEmail);

      if (result.success) {
        await get().fetchSubscription(userId, clerkToken);
      } else {
        set({ error: result.errorMessage ?? "Payment failed" });
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment failed";
      set({ error: message });
      const provider = getProvider(userCountry);
      return { success: false, provider, errorMessage: message };
    } finally {
      set({ isPaymentInProgress: false });
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      subscription: null,
      isLoading: false,
      isPaymentInProgress: false,
      error: null,
    }),
}));

export function getSubscriptionStatus(subscription: Subscription | null): SubscriptionStatus {
  if (!subscription) return "inactive";
  if (subscription.status !== "active") return subscription.status;
  if (subscription.currentPeriodEnd) {
    const isExpired = new Date(subscription.currentPeriodEnd) < new Date();
    if (isExpired) return "expired";
  }
  return "active";
}

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  return getSubscriptionStatus(subscription) === "active";
}
