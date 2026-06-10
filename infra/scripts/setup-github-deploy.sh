#!/usr/bin/env bash
# One-time setup: GitHub Actions -> Cloud Run deploy via Workload Identity Federation.
set -euo pipefail

PROJECT_ID="${1:-ear-thabhelo}"
REPO="${2:-Thabhelo/ear}"
SA_ID="github-actions-deploy"
POOL_ID="github"
PROVIDER_ID="github"

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
SA_EMAIL="${SA_ID}@${PROJECT_ID}.iam.gserviceaccount.com"
PROVIDER_RESOURCE="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}"

echo "Project: $PROJECT_ID ($PROJECT_NUMBER)"
echo "Repository: $REPO"
echo "Service account: $SA_EMAIL"

if ! gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SA_ID" \
    --project="$PROJECT_ID" \
    --display-name="GitHub Actions deploy"
  sleep 5
fi

for ROLE in \
  roles/run.admin \
  roles/artifactregistry.writer \
  roles/cloudbuild.builds.builder \
  roles/iam.serviceAccountUser \
  roles/storage.admin; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$ROLE" \
    --quiet >/dev/null
done

if ! gcloud iam workload-identity-pools describe "$POOL_ID" \
  --project="$PROJECT_ID" --location=global >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$POOL_ID" \
    --project="$PROJECT_ID" \
    --location=global \
    --display-name="GitHub Actions"
fi

if ! gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" \
  --project="$PROJECT_ID" --location=global --workload-identity-pool="$POOL_ID" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
    --project="$PROJECT_ID" \
    --location=global \
    --workload-identity-pool="$POOL_ID" \
    --display-name="GitHub OIDC" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
    --attribute-condition="assertion.repository_owner=='${REPO%%/*}'"
fi

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${REPO}" \
  --quiet >/dev/null

RUNTIME_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_SA" \
  --project="$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser" \
  --quiet >/dev/null
gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_SA" \
  --project="$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountTokenCreator" \
  --quiet >/dev/null

cat <<EOF

Done. Set these GitHub repository secrets (Settings -> Secrets and variables -> Actions):

  GCP_SERVICE_ACCOUNT=${SA_EMAIL}
  GCP_WORKLOAD_IDENTITY_PROVIDER=${PROVIDER_RESOURCE}

Or run:

  gh secret set GCP_SERVICE_ACCOUNT -R ${REPO} -b "${SA_EMAIL}"
  gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER -R ${REPO} -b "${PROVIDER_RESOURCE}"

Then push to main to trigger .github/workflows/deploy.yml
EOF
