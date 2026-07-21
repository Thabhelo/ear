import { describe, expect, it, vi } from "vitest";

import { auditPaymentWebHookReceived } from "./audit";

describe("auditPaymentWebhookReceived", () => {
  it("returns the expected structured audit fields", () => {
    const consoleSpy = vi
      .spyOn(console, "info")
      .mockImplementation(() => undefined);

    const result = auditPaymentWebHookReceived({
      sessionId: "session-123",
      stripeEventId: "evt-456",
      stripeEventType: "checkout.session.completed",
    });

    expect(result.level).toBe("info");
    expect(result.component).toBe("payment-webhook");
    expect(result.audit_event_type).toBe(
      "payment_webhook_received",
    );

    expect(result.session_id).toBe("session-123");
    expect(result.stripe_event_id).toBe("evt-456");
    expect(result.stripe_event_type).toBe(
      "checkout.session.completed",
    );

    expect(result.timestamp).toBeTruthy();
    expect(result.correlationId).toBeTruthy();

    expect(consoleSpy).toHaveBeenCalledOnce();

    consoleSpy.mockRestore();
  });

  it("does not include the full webhook payload or secrets", () => {
    const consoleSpy = vi
      .spyOn(console, "info")
      .mockImplementation(() => undefined);

    const result = auditPaymentWebHookReceived({
      sessionId: "session-123",
      stripeEventId: "evt-456",
      stripeEventType: "checkout.session.completed",
    });

    expect(result).not.toHaveProperty("payload");
    expect(result).not.toHaveProperty("stripe_signature");
    expect(result).not.toHaveProperty("webhook_secret");

    consoleSpy.mockRestore();
  });
});
