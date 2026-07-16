import { NextResponse } from "next/server";
import { ONE_OFF_PRODUCTS, SUBSCRIPTION_PRODUCTS } from "@server/integrations";

export function GET() {
  return NextResponse.json({
    modes: [
      { id: "just_listen", name: "Just Listen" },
      { id: "conversation", name: "Conversation" },
      { id: "deep_talk", name: "Deep Talk" },
      { id: "silent_company", name: "Silent Company" },
      { id: "study_buddy", name: "Study Buddy" },
      { id: "game_mode", name: "Game Mode" }
    ],
    one_offs: ONE_OFF_PRODUCTS,
    subscriptions: SUBSCRIPTION_PRODUCTS
  });
}
