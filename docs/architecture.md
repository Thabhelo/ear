# Ear Low-Level Architecture

## System Diagram

```mermaid
flowchart TD
  User[Customer Web Client] --> Web[Next.js Web App]
  Host[Thabhelo Host Console] --> Web

  Web --> Firebase[Firebase Authentication]
  Web --> API[FastAPI Backend]

  API --> Stripe[Stripe Payments and Billing]
  Stripe --> Webhook[Stripe Webhook Endpoint]
  Webhook --> API

  API --> DB[(Supabase PostgreSQL)]
  API --> Queue[Priority Queue Service]
  Queue --> DB

  API --> Calls[LiveKit or Daily.co]
  Calls --> Recorder[Call Recording Worker]
  Recorder --> GCS[Google Cloud Storage]
  Recorder --> DB

  API --> Messages[Platform Messaging Service]
  Messages --> DB

  API --> Ban[Ban and Moderation Service]
  Ban --> DB

  API --> Logs[Google Cloud Logging]
  API --> Secrets[Google Secret Manager]
```

## Request Flow

```mermaid
sequenceDiagram
  participant U as Customer
  participant W as Next.js Web
  participant A as FastAPI
  participant S as Stripe
  participant Q as Queue
  participant C as LiveKit/Daily
  participant R as Recorder
  participant G as GCS

  U->>W: Choose mode and duration
  W->>A: Create checkout session
  A->>S: Create payment or subscription
  S-->>A: Webhook payment confirmed
  A->>Q: Add user to priority queue
  Q-->>W: Queue position and bid context
  W->>A: Submit recording and terms consent
  A->>C: Create bounded call room
  C->>R: Stream recording
  R->>G: Store recording
  R->>A: Save recording metadata
  A-->>W: Join token
```

## Core Services

### Web App

Responsibilities:

- Landing page and product education.
- Authentication UI.
- Mode selection.
- One-off checkout.
- Subscription checkout and account management.
- Priority bid entry.
- Queue status.
- Recording and terms consent.
- Call room UI.
- Text messaging UI.
- Host console.

### API

Responsibilities:

- Verify Firebase identity tokens.
- Create Stripe checkout sessions.
- Receive Stripe webhooks.
- Create subscriptions and payment records.
- Maintain queue entries and priority scores.
- Issue LiveKit or Daily.co room tokens.
- Enforce consent before room entry.
- Store call, message, recording, ban, and subscription state.
- Provide panic-end and user-exit call controls.
- Enforce bans and platform boundaries.

### Queue

Priority score:

```text
priority_score = bid_amount + waiting_time_bonus
```

The initial implementation can compute the waiting bonus at read time from `created_at`.

### Calls

All calls require:

- Authenticated user.
- Paid one-off session or active subscription allowance.
- Recording consent.
- Terms consent.
- No active ban.

All calls support:

- Automatic purchased-time disconnect.
- Host panic end.
- User exit.
- Optional grace extension.

### Recording

Every call is recorded after consent.

Recording metadata stores:

- Recording ID.
- Call ID.
- Storage URL.
- Consent timestamp.
- User ID.
- Payment ID.
- Created timestamp.

## Data Model

```mermaid
erDiagram
  users ||--o{ calls : starts
  users ||--o{ payments : pays
  users ||--o{ queue_entries : joins
  users ||--o{ subscriptions : owns
  users ||--o{ messages : sends
  users ||--o{ bans : receives
  calls ||--o{ recordings : has
  payments ||--o{ calls : funds
  subscriptions ||--o{ calls : grants

  users {
    uuid id
    string name
    string email
    string firebase_uid
    timestamp created_at
  }

  calls {
    uuid id
    uuid user_id
    string mode
    int purchased_minutes
    string status
    string recording_url
    timestamp started_at
    timestamp ended_at
  }

  payments {
    uuid id
    uuid user_id
    int amount_cents
    string stripe_payment_intent_id
    string status
    timestamp created_at
  }

  queue_entries {
    uuid id
    uuid user_id
    uuid payment_id
    int bid_amount_cents
    timestamp created_at
  }

  subscriptions {
    uuid id
    uuid user_id
    string plan
    string stripe_subscription_id
    string status
    timestamp created_at
  }

  messages {
    uuid id
    uuid sender_id
    uuid receiver_id
    string content
    timestamp created_at
  }

  recordings {
    uuid id
    uuid call_id
    string storage_url
    timestamp consent_timestamp
    timestamp created_at
  }

  bans {
    uuid id
    uuid user_id
    string ban_type
    string reason
    timestamp created_at
  }
```

## Infrastructure

- Frontend: Next.js.
- Backend: FastAPI.
- Auth: Firebase Authentication.
- Database: Supabase PostgreSQL.
- Payments: Stripe.
- Calls: LiveKit or Daily.co.
- Storage: Google Cloud Storage.
- Hosting: Google Cloud Run.
- Secrets: Google Secret Manager.
- Logging: Google Cloud Logging.
