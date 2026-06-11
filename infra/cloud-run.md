# Cloud Run Deployment

Project: `ear-thabhelo` (region: `us-central1`)

## Services

| Service      | Image source                                      | LiveKit env |
| ------------ | ------------------------------------------------- | ----------- |
| `callsomeone-api` | Artifact Registry `cloud-run-source-deploy`  | Yes         |
| `callsomeone-web` | Artifact Registry `cloud-run-source-deploy`  | No          |

## Secret Manager

Production credentials are **not** stored in git. Create or update secrets with:

```bash
export LIVEKIT_URL=wss://your-subdomain.livekit.cloud
export LIVEKIT_API_KEY=...
export LIVEKIT_API_SECRET=...
./infra/scripts/set-livekit-secrets.sh ear-thabhelo
```

| GCP secret name        | Cloud Run env (`callsomeone-api`) |
| ---------------------- | ---------------------------- |
| `livekit-url`          | `LIVEKIT_URL`                |
| `livekit-api-key`      | `LIVEKIT_API_KEY`            |
| `livekit-api-secret`   | `LIVEKIT_API_SECRET`         |
| `stripe-secret-key`    | `STRIPE_SECRET_KEY`          |
| `stripe-webhook-secret`| `STRIPE_WEBHOOK_SECRET`      |

The API reads these via Pydantic settings in `apps/api/app/settings.py` (`livekit_url`, `livekit_api_key`, `livekit_api_secret`). `CallsClient` in `integrations.py` treats all three as required for `configured=True`.

After updating secrets, roll a new revision so instances pick up `latest`:

```bash
gcloud run services update callsomeone-api \
  --project=ear-thabhelo \
  --region=us-central1
```

## Local development

Copy root `.env.example` values into `apps/api/.env` (gitignored). LiveKit vars are only required on the API service for room/token provisioning.

## LiveKit agents

There is no `agents/` directory or `lk agent create` setup in this repo yet. Voice/call rooms are provisioned from the FastAPI backend only.
