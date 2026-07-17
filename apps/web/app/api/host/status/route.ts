import { NextResponse } from "next/server";
import { requireHost } from "@server/auth";
import { apiRoute, parseBody } from "@server/http";
import { hostStatusRequest } from "@server/schemas";
import { settings } from "@server/settings";
import { store } from "@server/store";

export const POST = apiRoute(async (request) => {
  await requireHost(request);
  const payload = await parseBody(request, hostStatusRequest);
  const document = await store.set("host_status", settings.hostUserId, payload);
  return NextResponse.json(document, { status: 201 });
});
