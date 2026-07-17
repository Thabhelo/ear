# API authorization

The Next.js API verifies Firebase ID tokens server-side. The browser sends the
token as `Authorization: Bearer <firebase-id-token>`.

## Roles

Firebase custom claims define staff access:

- No role (or `role: "user"`): customer access only.
- `role: "host"`: host console, queue operations, calls, and moderation.
- `role: "admin"`: all host permissions plus reserved administrative access.

Assign or revoke a role from `apps/web` using Application Default Credentials
or the Firebase service-account env vars:

```bash
npm run auth:set-role -- FIREBASE_UID_OR_EMAIL host
npm run auth:set-role -- FIREBASE_UID_OR_EMAIL admin
npm run auth:set-role -- FIREBASE_UID_OR_EMAIL user
```

The user must sign out and back in (or otherwise refresh their ID token) after
a role changes. The `/host` UI checks the same claims as the API, but the
server-side checks are authoritative.

## Access policy

- Public: `GET /api/health`, `GET /api/catalog`.
- Signed-in customer: checkout, owned queue status/join, owned call lifecycle,
  owned reports, messages, and eligible ban appeals belonging to that user.
- Host or admin: queue list, host room/status/end-call routes, and bans.
- Stripe webhook: verified with `STRIPE_WEBHOOK_SECRET`.
- Recording webhook: verified with a dedicated shared bearer secret.

User identity always comes from the verified Firebase token. Message senders
cannot supply or impersonate another `sender_id`. Customer call/report actions
also verify session ownership.

## Recording worker authentication

Create a random production secret once:

```bash
openssl rand -hex 32 | \
  gcloud secrets create recording-webhook-secret \
    --project=ear-thabhelo \
    --replication-policy=automatic \
    --data-file=-
```

If the secret already exists, add a new version instead:

```bash
openssl rand -hex 32 | \
  gcloud secrets versions add recording-webhook-secret \
    --project=ear-thabhelo \
    --data-file=-
```

Configure the recording worker with the same value and send:

```text
Authorization: Bearer <recording-webhook-secret>
```

to `POST /api/recordings/webhook`. The endpoint fails closed with `503` if the
server secret is absent and returns `401` for invalid credentials.
