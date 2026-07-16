import { NextResponse } from "next/server";
import { HttpError, apiRoute } from "@server/http";
import { stripeClient } from "@server/integrations";
import { store } from "@server/store";

export const POST = apiRoute(async (request) => {
  const rawBody = await request.text();

  let payload: Record<string, unknown>;
  if (stripeClient.webhookConfigured) {
    try {
      payload = (await stripeClient.verifyWebhook(
        rawBody,
        request.headers.get("stripe-signature")
      )) as unknown as Record<string, unknown>;
    } catch {
      throw new HttpError(400, "Invalid Stripe webhook signature.");
    }
  } else {
    // Preview mode: no webhook secret configured (e.g. local dev).
    try {
      payload = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      throw new HttpError(400, "Invalid JSON payload.");
    }
  }

  const event = await store.create("stripe_events", { payload, status: "received" });

  const data = payload.data as { object?: { client_reference_id?: string } } | undefined;
  const sessionId = data?.object?.client_reference_id;
  if (sessionId) {
    await store.update("sessions", sessionId, { status: "paid" });
  }
  return NextResponse.json({ status: "received", event_id: event.id });
});
