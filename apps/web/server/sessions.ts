import { HttpError } from "./http";
import { store, type Doc } from "./store";

/** Loads a session or raises 404, mirroring the FastAPI handlers. */
export async function getSession(sessionId: string): Promise<Doc> {
  const session = await store.get("sessions", sessionId);
  if (!session) {
    throw new HttpError(404, "Session not found.");
  }
  return session;
}

/** Loads a session and enforces that it belongs to the given user. */
export async function getOwnedSession(sessionId: string, userId: string): Promise<Doc> {
  const session = await getSession(sessionId);
  if (session.user_id !== userId) {
    throw new HttpError(403, "This session belongs to another user.");
  }
  return session;
}
