/**
 * Server-side settings, read from environment variables.
 * Mirrors the former FastAPI `app/settings.py` (pydantic-settings) names:
 * every field maps to the same UPPER_SNAKE_CASE env var as before.
 */
export const settings = {
  appName: process.env.APP_NAME ?? "Ear API",
  environment: process.env.ENVIRONMENT ?? "development",

  googleCloudProject: process.env.GOOGLE_CLOUD_PROJECT,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:3000",
  livekitUrl: process.env.LIVEKIT_URL,
  livekitApiKey: process.env.LIVEKIT_API_KEY,
  livekitApiSecret: process.env.LIVEKIT_API_SECRET,
  googleCloudStorageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
  cloudTasksLocation: process.env.CLOUD_TASKS_LOCATION ?? "us-central1",
  cloudTasksQueue: process.env.CLOUD_TASKS_QUEUE ?? "callsomeone-session-jobs",
  hostUserId: process.env.HOST_USER_ID ?? "callsomeone-host"
};
