import { adminAuth } from "./firebase";
import { HttpError } from "./http";

/** Verifies the Firebase bearer token on a request and returns the user id. */
export async function currentUserId(request: Request): Promise<string> {
  const authorization = request.headers.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new HttpError(401, "Firebase sign-in is required.");
  }

  const token = authorization.slice("Bearer ".length).trim();
  let uid: string | undefined;
  try {
    const decoded = await adminAuth().verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    throw new HttpError(401, "Invalid Firebase token.");
  }

  if (!uid) {
    throw new HttpError(401, "Invalid Firebase token.");
  }
  return uid;
}
