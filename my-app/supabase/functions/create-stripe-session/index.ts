import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { planId, userId, successUrl, cancelUrl } = await req.json();

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      throw new Error("Stripe credentials not configured");
    }

    const STRIPE_PRICE_IDS: Record<string, string> = {
      pro: Deno.env.get("STRIPE_PRO_PRICE_ID") ?? "",
      premium: Deno.env.get("STRIPE_PREMIUM_PRICE_ID") ?? "",
    };

    const priceId = STRIPE_PRICE_IDS[planId];
    if (!priceId) {
      throw new Error(`Invalid plan or missing Stripe price ID: ${planId}`);
    }

    const params = new URLSearchParams({
      "mode": "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "success_url": successUrl ?? "lookai://payment/success",
      "cancel_url": cancelUrl ?? "lookai://payment/cancel",
      "metadata[userId]": userId,
      "metadata[planId]": planId,
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${stripeSecretKey}`,
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Stripe session creation failed");
    }

    const session = await response.json();

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        sessionUrl: session.url,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
