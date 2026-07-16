import { Storage } from "@google-cloud/storage";
import { CloudTasksClient } from "@google-cloud/tasks";
import { AccessToken, TrackSource, type VideoGrant } from "livekit-server-sdk";
import Stripe from "stripe";
import { settings } from "./settings";
import { utcNow } from "./store";

export const ONE_OFF_PRODUCTS = {
  text_once: { name: "Text once", amount_cents: 699, duration_minutes: 0, type: "text" },
  quick_call: { name: "Quick Call", amount_cents: 299, duration_minutes: 3, type: "call" },
  standard_call: { name: "Standard Call", amount_cents: 699, duration_minutes: 25, type: "call" },
  long_call: { name: "Long Call", amount_cents: 1499, duration_minutes: 60, type: "call" }
} as const;

export const SUBSCRIPTION_PRODUCTS = {
  text_friend: { name: "Text Friend", amount_cents: 499 },
  friend: { name: "Friend", amount_cents: 1900 },
  close_friend: { name: "Close Friend", amount_cents: 2999 },
  always_there: { name: "Always There", amount_cents: 4900 }
} as const;

export type OneOffProductKey = keyof typeof ONE_OFF_PRODUCTS;
export type SubscriptionPlanKey = keyof typeof SUBSCRIPTION_PRODUCTS;

function providerConfigured(value: string | undefined): boolean {
  return Boolean(value && value.trim() && !value.startsWith("replace-me"));
}

export type CheckoutResult = {
  configured: boolean;
  checkout_url: string;
  stripe_session_id: string;
};

export const stripeClient = {
  get configured(): boolean {
    return providerConfigured(settings.stripeSecretKey);
  },

  client(): Stripe {
    return new Stripe(settings.stripeSecretKey!);
  },

  async createOneOffCheckout(options: {
    sessionId: string;
    productKey: OneOffProductKey;
    priorityBidCents: number;
  }): Promise<CheckoutResult> {
    const { sessionId, productKey, priorityBidCents } = options;
    const product = ONE_OFF_PRODUCTS[productKey];
    const totalCents = product.amount_cents + priorityBidCents;
    if (!this.configured) {
      return {
        configured: false,
        checkout_url: `${settings.appBaseUrl}/book?session=${sessionId}&preview=1`,
        stripe_session_id: `preview_${sessionId}`
      };
    }

    const checkout = await this.client().checkout.sessions.create({
      mode: "payment",
      success_url: `${settings.appBaseUrl}/book?session=${sessionId}`,
      cancel_url: `${settings.appBaseUrl}/start?cancelled=1`,
      client_reference_id: sessionId,
      metadata: { session_id: sessionId, product: productKey },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: totalCents,
            product_data: { name: product.name }
          }
        }
      ]
    });
    return {
      configured: true,
      checkout_url: checkout.url ?? "",
      stripe_session_id: checkout.id
    };
  },

  async createSubscriptionCheckout(options: {
    userId: string;
    planKey: SubscriptionPlanKey;
  }): Promise<CheckoutResult> {
    const { userId, planKey } = options;
    const product = SUBSCRIPTION_PRODUCTS[planKey];
    if (!this.configured) {
      return {
        configured: false,
        checkout_url: `${settings.appBaseUrl}/start?plan=${planKey}&activated=1`,
        stripe_session_id: `preview_subscription_${userId}_${planKey}`
      };
    }

    const checkout = await this.client().checkout.sessions.create({
      mode: "subscription",
      success_url: `${settings.appBaseUrl}/account?subscription=success`,
      cancel_url: `${settings.appBaseUrl}/start?cancelled=1`,
      client_reference_id: userId,
      metadata: { user_id: userId, plan: planKey },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: product.amount_cents,
            recurring: { interval: "month" },
            product_data: { name: product.name }
          }
        }
      ]
    });
    return {
      configured: true,
      checkout_url: checkout.url ?? "",
      stripe_session_id: checkout.id
    };
  }
};

export type CallRole = "caller" | "host";

export type RoomResult = {
  configured: boolean;
  provider: "livekit";
  livekit_url: string | null;
  room_name: string;
  join_url: string;
  token: string | null;
};

export const callsClient = {
  get configured(): boolean {
    return (
      providerConfigured(settings.livekitUrl) &&
      providerConfigured(settings.livekitApiKey) &&
      providerConfigured(settings.livekitApiSecret)
    );
  },

  roomName(sessionId: string): string {
    return `callsomeone-${sessionId}`;
  },

  async accessToken(options: {
    sessionId: string;
    identity: string;
    displayName: string;
    role: CallRole;
  }): Promise<string> {
    const { sessionId, identity, displayName, role } = options;
    const grants: VideoGrant = {
      roomJoin: true,
      room: this.roomName(sessionId),
      canPublish: true,
      canSubscribe: true,
      canPublishSources: [TrackSource.MICROPHONE],
      roomAdmin: role === "host"
    };
    const token = new AccessToken(settings.livekitApiKey, settings.livekitApiSecret, {
      identity,
      name: displayName
    });
    token.addGrant(grants);
    return token.toJwt();
  },

  async createRoom(options: {
    sessionId: string;
    userId: string;
    role?: CallRole;
  }): Promise<RoomResult> {
    const { sessionId, userId, role = "caller" } = options;
    const roomName = this.roomName(sessionId);
    let token: string | null = null;
    if (this.configured) {
      const identity = role === "host" ? settings.hostUserId : userId;
      const displayName = role === "host" ? "Host" : "Guest";
      token = await this.accessToken({ sessionId, identity, displayName, role });
    }

    return {
      configured: this.configured,
      provider: "livekit",
      livekit_url: settings.livekitUrl ?? null,
      room_name: roomName,
      join_url: `${settings.appBaseUrl}/call?session=${sessionId}`,
      token
    };
  }
};

export const storageClient = {
  get configured(): boolean {
    return providerConfigured(settings.googleCloudStorageBucket);
  },

  async signedRecordingUrl(objectName: string): Promise<string | null> {
    if (!this.configured) return null;
    const storage = new Storage({ projectId: settings.googleCloudProject });
    const [url] = await storage
      .bucket(settings.googleCloudStorageBucket!)
      .file(objectName)
      .getSignedUrl({
        version: "v4",
        expires: Date.now() + 15 * 60 * 1000,
        action: "write",
        contentType: "application/octet-stream"
      });
    return url;
  }
};

export const tasksClient = {
  get configured(): boolean {
    return Boolean(settings.googleCloudProject && settings.cloudTasksQueue);
  },

  async enqueueSessionTimeout(options: {
    sessionId: string;
    delaySeconds: number;
  }): Promise<{ configured: boolean; task_name: string | null }> {
    const { sessionId, delaySeconds } = options;
    if (!this.configured) return { configured: false, task_name: null };
    const client = new CloudTasksClient();
    const parent = client.queuePath(
      settings.googleCloudProject!,
      settings.cloudTasksLocation,
      settings.cloudTasksQueue
    );
    const scheduleTime = new Date(utcNow().getTime() + delaySeconds * 1000);
    const [created] = await client.createTask({
      parent,
      task: {
        scheduleTime: { seconds: Math.floor(scheduleTime.getTime() / 1000) },
        httpRequest: {
          httpMethod: "POST",
          url: `${settings.appBaseUrl}/api/internal/session-timeout/${sessionId}`
        }
      }
    });
    return { configured: true, task_name: created.name ?? null };
  }
};
