import { NextResponse } from "next/server";
import { settings } from "@server/settings";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "callsomeone-api",
    environment: settings.environment
  });
}
