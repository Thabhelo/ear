# GitHub Actions deploy

Pushes to `main` run [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml), which redeploys:

- `callsomeone-api` from `apps/api`
- `callsomeone-web` from `apps/web`

Both services deploy to Cloud Run in `ear-thabhelo` / `us-central1`.

## One-time setup

Run from the repo root:

```bash
chmod +x infra/scripts/setup-github-deploy.sh
./infra/scripts/setup-github-deploy.sh ear-thabhelo Thabhelo/ear
```

Then add GitHub secrets (the script prints the exact values):

| Secret | Purpose |
| ------ | ------- |
| `GCP_SERVICE_ACCOUNT` | Deployer service account email |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Workload Identity Federation provider resource name |

Using the GitHub CLI:

```bash
gh secret set GCP_SERVICE_ACCOUNT -R Thabhelo/ear -b "github-actions-deploy@ear-thabhelo.iam.gserviceaccount.com"
gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER -R Thabhelo/ear -b "projects/963565155466/locations/global/workloadIdentityPools/github/providers/github"
```

No long-lived JSON keys are stored in GitHub. Authentication uses OIDC + Workload Identity Federation.

## What gets deployed

**API** uses `apps/api/.cloudrun.env.yaml` for plain env vars and Secret Manager for Stripe + LiveKit secrets (already configured on the service).

**Web** uses `apps/web/.cloudrun.env.yaml` for runtime and build-time `NEXT_PUBLIC_*` Firebase/API URLs.

## Manual deploy (same as CI)

```bash
gcloud run deploy callsomeone-api --project=ear-thabhelo --region=us-central1 --source=apps/api ...
gcloud run deploy callsomeone-web --project=ear-thabhelo --region=us-central1 --source=apps/web ...
```

See [cloud-run.md](./cloud-run.md) for Secret Manager details.
