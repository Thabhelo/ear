import { NextResponse } from "next/server";
import { apiRoute, parseBody } from "@server/http";
import { messageCreate } from "@server/schemas";
import { store } from "@server/store";

export const POST = apiRoute(async (request) => {
  const message = await parseBody(request, messageCreate);
  const document = await store.create("messages", {
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    session_id: message.session_id,
    content: message.content,
    status: "sent"
  });
  return NextResponse.json(
    { status: "accepted", message_id: document.id },
    { status: 201 }
  );
});
