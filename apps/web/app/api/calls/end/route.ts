import { NextResponse } from "next/server";
import { currentUserId } from "@server/auth";
import { apiRoute, parseBody } from "@server/http";
import { endCallRequest } from "@server/schemas";
import { getOwnedSession } from "@server/sessions";
import { store, utcNow } from "@server/store";

export const POST = apiRoute(async (request) => {
  const userId = await currentUserId(request);
  const payload = await parseBody(request, endCallRequest);

  await getOwnedSession(payload.session_id, userId);
  await store.update("sessions", payload.session_id, {
    status: "ended",
    ended_at: utcNow(),
    ended_by: payload.ended_by,
    end_reason: payload.reason,
    refund_requested: payload.refund_requested
  });
  return NextResponse.json({ status: "ended", session_id: payload.session_id });
});
