import { NextResponse } from "next/server";
import { apiRoute } from "@server/http";
import { store } from "@server/store";

export const GET = apiRoute(async () => {
  return NextResponse.json({ entries: await store.listQueue(50) });
});
