# Infrastructure Notes

Ear is designed to deploy on Google Cloud Run with managed external services.

## Services

- `pickup-web`: Next.js frontend.
- `pickup-api`: FastAPI backend.
- Firebase Authentication for identity.
- Cloud Firestore for application state.
- Stripe for one-off payments, bids, subscriptions, and reinstatement review fees.
- LiveKit or Daily.co for calls.
- Google Cloud Storage for recordings.
- Google Secret Manager for service credentials.
- Google Cloud Logging for application logs and operational audit trails.

## Deployment Goals

- Keep all user interactions inside the platform identity.
- Keep secrets outside source control.
- Treat call recordings as sensitive protected assets.
- Make the queue and call state observable for host operations.
