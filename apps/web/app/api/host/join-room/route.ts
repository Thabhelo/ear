import { NextResponse } from "next/server";
import { apiRoute, parseBody } from "@server/http";
import { callsClient } from "@server/integrations";
import { hostJoinRoomRequest } from "@server/schemas";
import { getSession } from "@server/sessions";
import { settings } from "@server/settings";
import { store, utcNow } from "@server/store";

export const POST = apiRoute(async (request) => {
  const payload = await parseBody(request, hostJoinRoomRequest);
  const session = await getSession(payload.session_id);

  const room = await callsClient.createRoom({
    sessionId: payload.session_id,
    userId: settings.hostUserId,
    role: "host"
  });
  if (!["active", "consent_pending"].includes(session.status as string)) {
    await store.update("sessions", payload.session_id, {
      status: "active",
      started_at: utcNow()
    });
  }
  return NextResponse.json({ session, room }, { status: 201 });
});
