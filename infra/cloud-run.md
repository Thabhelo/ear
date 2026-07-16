# Cloud Run Deployment

Project: `ear-thabhelo` (region: `us-central1`)

## Services

| Service      | Image source                                      | LiveKit env |
| ------------ | ------------------------------------------------- | ----------- |
| `callsomeone-web` | Artifact Registry `cloud-run-source-deploy`  | Yes         |

The Next.js app serves both the site and the API (route handlers under `/api`), so all secrets live on `callsomeone-web`.

## Secret Manager

Production credentials are **not** stored in git. Create or update secrets with:

```bash
export LIVEKIT_URL=wss://your-subdomain.livekit.cloud
export LIVEKIT_API_KEY=...
export LIVEKIT_API_SECRET=...
./infra/scripts/set-livekit-secrets.sh ear-thabhelo
```

| GCP secret name        | Cloud Run env (`callsomeone-web`) |
| ---------------------- | ---------------------------- |
| `livekit-url`          | `LIVEKIT_URL`                |
| `livekit-api-key`      | `LIVEKIT_API_KEY`            |
| `livekit-api-secret`   | `LIVEKIT_API_SECRET`         |
| `stripe-secret-key`    | `STRIPE_SECRET_KEY`          |
| `stripe-webhook-secret`| `STRIPE_WEBHOOK_SECRET`      |

The API reads these via `apps/web/server/settings.ts`. `callsClient` in `apps/web/server/integrations.ts` treats all three LiveKit values as required for `configured: true`.

After updating secrets, roll a new revision so instances pick up `latest`:

```bash
gcloud run services update callsomeone-web \
  --project=ear-thabhelo \
  --region=us-central1
```

## Local development

Copy root `.env.example` values into `apps/web/.env.local` (gitignored). LiveKit vars are only required for room/token provisioning.

## LiveKit agents

There is no `agents/` directory or `lk agent create` setup in this repo yet. Voice/call rooms are provisioned from the Next.js API route handlers only.
