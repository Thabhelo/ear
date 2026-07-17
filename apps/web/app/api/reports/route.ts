import { NextResponse } from "next/server";
import { currentUserId } from "@server/auth";
import { apiRoute, parseBody } from "@server/http";
import { reportRequest } from "@server/schemas";
import { getOwnedSession } from "@server/sessions";
import { store } from "@server/store";

export const POST = apiRoute(async (request) => {
  const userId = await currentUserId(request);
  const payload = await parseBody(request, reportRequest);
  await getOwnedSession(payload.session_id, userId);
  const report = await store.create("reports", {
    ...payload,
    user_id: userId,
    status: "open"
  });
  await store.update("sessions", payload.session_id, { status: "reported" });
  return NextResponse.json(report, { status: 201 });
});
