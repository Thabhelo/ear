import { NextResponse } from "next/server";
import { requireHost } from "@server/auth";
import { apiRoute } from "@server/http";
import { store } from "@server/store";

export const GET = apiRoute(async (request) => {
  await requireHost(request);
  return NextResponse.json({ entries: await store.listQueue(50) });
});
