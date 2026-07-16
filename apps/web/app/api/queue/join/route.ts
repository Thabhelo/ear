import { NextResponse } from "next/server";
import { currentUserId } from "@server/auth";
import { apiRoute, parseBody } from "@server/http";
import { queueJoinRequest } from "@server/schemas";
import { getOwnedSession } from "@server/sessions";
import { store } from "@server/store";

export const POST = apiRoute(async (request) => {
  const userId = await currentUserId(request);
  const payload = await parseBody(request, queueJoinRequest);
  const session = await getOwnedSession(payload.session_id, userId);

  const waitingTimeBonus = 0;
  const priorityScore = payload.priority_bid_cents / 100 + waitingTimeBonus;
  const queueEntry = await store.create("queue_entries", {
    user_id: userId,
    session_id: payload.session_id,
    mode: session.mode,
    priority_bid_cents: payload.priority_bid_cents,
    waiting_time_bonus: waitingTimeBonus,
    priority_score: priorityScore,
    status: "queued"
  });
  await store.update("sessions", payload.session_id, { status: "queued" });
  return NextResponse.json({ status: "queued", queue_entry: queueEntry }, { status: 201 });
});
