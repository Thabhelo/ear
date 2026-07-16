import { NextResponse } from "next/server";
import { currentUserId } from "@server/auth";
import { apiRoute, parseBody } from "@server/http";
import { stripeClient } from "@server/integrations";
import { checkoutSubscriptionRequest } from "@server/schemas";
import { store } from "@server/store";

export const POST = apiRoute(async (request) => {
  const userId = await currentUserId(request);
  const payload = await parseBody(request, checkoutSubscriptionRequest);

  const checkout = await stripeClient.createSubscriptionCheckout({
    userId,
    planKey: payload.plan
  });

  const subscription = await store.create("subscriptions", {
    user_id: userId,
    plan: payload.plan,
    stripe_checkout_session_id: checkout.stripe_session_id,
    status: checkout.configured ? "checkout_created" : "preview_checkout"
  });

  return NextResponse.json(
    {
      checkout_url: checkout.checkout_url,
      session_id: subscription.id,
      provider: "stripe",
      configured: checkout.configured
    },
    { status: 201 }
  );
});
