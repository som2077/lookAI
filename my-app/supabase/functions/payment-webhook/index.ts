import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature, stripe-signature",
};

async function verifyRazorpaySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computedSig = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computedSig === signature;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const provider = new URL(req.url).searchParams.get("provider");
  const rawBody = await req.text();

  try {
    if (provider === "razorpay") {
      const signature = req.headers.get("x-razorpay-signature") ?? "";
      const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") ?? "";

      const isValid = await verifyRazorpaySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
      }

      const event = JSON.parse(rawBody);
      const eventType = event.event;
      const userId = event.payload?.payment?.entity?.notes?.userId;
      const planId = event.payload?.payment?.entity?.notes?.planId;

      await supabase.from("payment_events").insert({
        user_id: userId,
        provider: "razorpay",
        event_type: eventType,
        provider_event_id: event.payload?.payment?.entity?.id,
        payload: event,
      });

      if (eventType === "payment.captured" && userId && planId) {
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan_id: planId,
            provider: "razorpay",
            status: "active",
            provider_subscription_id: event.payload?.payment?.entity?.id,
            current_period_end: periodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      }

      if (eventType === "payment.failed" && userId) {
        await supabase
          .from("subscriptions")
          .update({ status: "inactive", updated_at: new Date().toISOString() })
          .eq("user_id", userId);
      }
    } else if (provider === "stripe") {
      const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
      const stripeSignature = req.headers.get("stripe-signature") ?? "";

      // Stripe signature verification using HMAC SHA-256
      const parts = stripeSignature.split(",");
      const timestamp = parts.find((p) => p.startsWith("t="))?.split("=")[1];
      const sigHash = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

      if (!timestamp || !sigHash) {
        return new Response(JSON.stringify({ error: "Missing Stripe signature" }), { status: 401 });
      }

      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(stripeWebhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signedPayload = `${timestamp}.${rawBody}`;
      const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
      const computedSig = Array.from(new Uint8Array(sigBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (computedSig !== sigHash) {
        return new Response(JSON.stringify({ error: "Invalid Stripe signature" }), { status: 401 });
      }

      const event = JSON.parse(rawBody);
      const eventType = event.type;
      const session = event.data?.object;
      const userId = session?.metadata?.userId;
      const planId = session?.metadata?.planId;

      await supabase.from("payment_events").insert({
        user_id: userId,
        provider: "stripe",
        event_type: eventType,
        provider_event_id: event.id,
        payload: event,
      });

      if (eventType === "checkout.session.completed" && userId && planId) {
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan_id: planId,
            provider: "stripe",
            status: "active",
            provider_subscription_id: session?.subscription ?? session?.id,
            current_period_end: periodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      }

      if (
        (eventType === "customer.subscription.deleted" ||
          eventType === "invoice.payment_failed") &&
        userId
      ) {
        await supabase
          .from("subscriptions")
          .update({ status: "inactive", updated_at: new Date().toISOString() })
          .eq("user_id", userId);
      }
    } else {
      return new Response(JSON.stringify({ error: "Unknown provider" }), { status: 400 });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
