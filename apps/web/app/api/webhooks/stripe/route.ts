import { NextResponse } from "next/server";
import { apiRoute } from "@server/http";
import { store } from "@server/store";

export const POST = apiRoute(async (request) => {
  const payload = (await request.json()) as Record<string, unknown>;
  const event = await store.create("stripe_events", { payload, status: "received" });

  const data = payload.data as { object?: { client_reference_id?: string } } | undefined;
  const sessionId = data?.object?.client_reference_id;
  if (sessionId) {
    await store.update("sessions", sessionId, { status: "paid" });
  }
  return NextResponse.json({ status: "received", event_id: event.id });
});
