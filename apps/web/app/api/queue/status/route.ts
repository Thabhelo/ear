import { NextResponse } from "next/server";
import { currentUserId } from "@server/auth";
import { HttpError, apiRoute } from "@server/http";
import { getOwnedSession } from "@server/sessions";
import { store } from "@server/store";

export const GET = apiRoute(async (request) => {
  const userId = await currentUserId(request);
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    throw new HttpError(422, "session_id query parameter is required.");
  }
  const session = await getOwnedSession(sessionId, userId);

  const entries = await store.listQueue(100);
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (entry.session_id === sessionId) {
      return NextResponse.json({
        session_id: sessionId,
        status: (entry.status as string) ?? "queued",
        position: index + 1,
        priority_score: (entry.priority_score as number) ?? null
      });
    }
  }
  return NextResponse.json({
    session_id: sessionId,
    status: (session.status as string) ?? "unknown",
    position: null,
    priority_score: null
  });
});
