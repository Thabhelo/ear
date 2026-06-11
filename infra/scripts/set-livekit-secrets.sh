#!/usr/bin/env bash
# Push LiveKit Cloud credentials to GCP Secret Manager for callsomeone-api.
# Usage (do not commit these values):
#   export LIVEKIT_URL=...
#   export LIVEKIT_API_KEY=...
#   export LIVEKIT_API_SECRET=...
#   ./infra/scripts/set-livekit-secrets.sh [GCP_PROJECT_ID]

set -euo pipefail

PROJECT_ID="${1:-${GOOGLE_CLOUD_PROJECT:-ear-thabhelo}}"

for var in LIVEKIT_URL LIVEKIT_API_KEY LIVEKIT_API_SECRET; do
  if [[ -z "${!var:-}" ]]; then
    echo "Missing required env var: $var" >&2
    exit 1
  fi
done

ensure_secret() {
  local name="$1"
  if ! gcloud secrets describe "$name" --project="$PROJECT_ID" >/dev/null 2>&1; then
    gcloud secrets create "$name" --project="$PROJECT_ID" --replication-policy=automatic
  fi
}

ensure_secret livekit-url
ensure_secret livekit-api-key
ensure_secret livekit-api-secret

printf '%s' "$LIVEKIT_URL" | gcloud secrets versions add livekit-url --data-file=- --project="$PROJECT_ID"
printf '%s' "$LIVEKIT_API_KEY" | gcloud secrets versions add livekit-api-key --data-file=- --project="$PROJECT_ID"
printf '%s' "$LIVEKIT_API_SECRET" | gcloud secrets versions add livekit-api-secret --data-file=- --project="$PROJECT_ID"

echo "LiveKit secrets updated in project $PROJECT_ID (latest versions)."
echo "Redeploy callsomeone-api so Cloud Run mounts the new secret versions."
