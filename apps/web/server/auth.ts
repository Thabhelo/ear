import type { DecodedIdToken } from "firebase-admin/auth";
import { timingSafeEqual } from "node:crypto";
import { adminAuth } from "./firebase";
import { HttpError } from "./http";
import { settings } from "./settings";

export type AppRole = "user" | "host" | "admin";

export type CurrentUser = {
  uid: string;
  role: AppRole;
  token: DecodedIdToken;
};

export function roleFromToken(token: DecodedIdToken): AppRole {
  if (token.admin === true || token.role === "admin") return "admin";
  if (token.host === true || token.role === "host") return "host";

  const roles = Array.isArray(token.roles) ? token.roles : [];
  if (roles.includes("admin")) return "admin";
  if (roles.includes("host")) return "host";
  return "user";
}

/** Verifies the Firebase bearer token and returns the authenticated principal. */
export async function currentUser(request: Request): Promise<CurrentUser> {
  const authorization = request.headers.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new HttpError(401, "Firebase sign-in is required.");
  }

  const token = authorization.slice("Bearer ".length).trim();
  let decoded: DecodedIdToken;
  try {
    decoded = await adminAuth().verifyIdToken(token);
  } catch {
    throw new HttpError(401, "Invalid Firebase token.");
  }

  if (!decoded.uid) {
    throw new HttpError(401, "Invalid Firebase token.");
  }
  return { uid: decoded.uid, role: roleFromToken(decoded), token: decoded };
}

/** Verifies the Firebase bearer token on a request and returns the user id. */
export async function currentUserId(request: Request): Promise<string> {
  return (await currentUser(request)).uid;
}

/** Requires a Firebase user with a host or admin custom claim. */
export async function requireHost(request: Request): Promise<CurrentUser> {
  const user = await currentUser(request);
  if (user.role !== "host" && user.role !== "admin") {
    throw new HttpError(403, "Host access is required.");
  }
  return user;
}

/** Requires a Firebase user with an admin custom claim. */
export async function requireAdmin(request: Request): Promise<CurrentUser> {
  const user = await currentUser(request);
  if (user.role !== "admin") {
    throw new HttpError(403, "Administrator access is required.");
  }
  return user;
}

/** Allows an owner to act for themselves, or a host/admin to act for them. */
export function requireSelfOrStaff(user: CurrentUser, userId: string): void {
  if (user.uid !== userId && user.role !== "host" && user.role !== "admin") {
    throw new HttpError(403, "You cannot act on behalf of another user.");
  }
}

export function webhookSecretMatches(
  authorization: string | null,
  expected: string | undefined
): boolean {
  if (!expected) return false;
  const supplied = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
  const suppliedBytes = Buffer.from(supplied);
  const expectedBytes = Buffer.from(expected);

  return (
    suppliedBytes.length === expectedBytes.length &&
    timingSafeEqual(suppliedBytes, expectedBytes)
  );
}

/**
 * Authenticates the recording worker with a shared bearer secret.
 * Fails closed when the secret is not configured.
 */
export function requireRecordingWebhook(request: Request): void {
  if (!settings.recordingWebhookSecret) {
    throw new HttpError(503, "Recording webhook authentication is not configured.");
  }

  const authorization = request.headers.get("authorization");
  if (!webhookSecretMatches(authorization, settings.recordingWebhookSecret)) {
    throw new HttpError(401, "Invalid recording webhook credentials.");
  }
}
