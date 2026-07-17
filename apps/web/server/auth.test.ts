import type { DecodedIdToken } from "firebase-admin/auth";
import { describe, expect, it } from "vitest";
import {
  requireSelfOrStaff,
  roleFromToken,
  webhookSecretMatches,
  type CurrentUser
} from "./auth";

function token(claims: Record<string, unknown> = {}): DecodedIdToken {
  return { uid: "user-1", ...claims } as DecodedIdToken;
}

function user(role: CurrentUser["role"], uid = "user-1"): CurrentUser {
  return { uid, role, token: token({ uid }) };
}

describe("roleFromToken", () => {
  it("defaults to the customer role", () => {
    expect(roleFromToken(token())).toBe("user");
  });

  it("accepts canonical and legacy host claims", () => {
    expect(roleFromToken(token({ role: "host" }))).toBe("host");
    expect(roleFromToken(token({ host: true }))).toBe("host");
    expect(roleFromToken(token({ roles: ["host"] }))).toBe("host");
  });

  it("gives admin precedence over host claims", () => {
    expect(roleFromToken(token({ role: "host", admin: true }))).toBe("admin");
    expect(roleFromToken(token({ roles: ["host", "admin"] }))).toBe("admin");
  });
});

describe("requireSelfOrStaff", () => {
  it("allows users to act for themselves", () => {
    expect(() => requireSelfOrStaff(user("user"), "user-1")).not.toThrow();
  });

  it("rejects a customer acting for another user", () => {
    expect(() => requireSelfOrStaff(user("user"), "user-2")).toThrow(
      "You cannot act on behalf of another user."
    );
  });

  it("allows hosts and admins to act for another user", () => {
    expect(() => requireSelfOrStaff(user("host"), "user-2")).not.toThrow();
    expect(() => requireSelfOrStaff(user("admin"), "user-2")).not.toThrow();
  });
});

describe("webhookSecretMatches", () => {
  it("requires a configured secret and bearer scheme", () => {
    expect(webhookSecretMatches("Bearer secret", undefined)).toBe(false);
    expect(webhookSecretMatches("secret", "secret")).toBe(false);
  });

  it("accepts only an exact constant-time secret match", () => {
    expect(webhookSecretMatches("Bearer secret", "secret")).toBe(true);
    expect(webhookSecretMatches("Bearer wrong!", "secret")).toBe(false);
  });
});
