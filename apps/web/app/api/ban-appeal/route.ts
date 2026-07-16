import { NextResponse } from "next/server";
import { HttpError, apiRoute, parseBody } from "@server/http";
import { banAppealRequest } from "@server/schemas";
import { store } from "@server/store";

export const POST = apiRoute(async (request) => {
  const payload = await parseBody(request, banAppealRequest);

  const ban = await store.get("bans", payload.ban_id);
  if (!ban) {
    throw new HttpError(404, "Ban not found.");
  }
  if (!ban.appeal_eligible) {
    throw new HttpError(403, "This ban is not appeal eligible.");
  }
  const appeal = await store.create("ban_appeals", {
    user_id: payload.user_id,
    ban_id: payload.ban_id,
    statement: payload.statement,
    review_fee_cents: 5000,
    status: "payment_required"
  });
  return NextResponse.json(appeal, { status: 201 });
});
