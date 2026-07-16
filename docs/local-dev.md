# Local development

**Repository location:** `/Users/thabhelo/ear` (canonical local path; the old `~/repos/ear` path is obsolete).

The whole platform is one Next.js app: the frontend and the API (route handlers under `apps/web/app/api/`) run together in a **single terminal**.

## Prerequisites

- Node.js and npm (monorepo root or `apps/web`)
- Env file (never commit it):
  - `apps/web/.env.local`: `NEXT_PUBLIC_*` Firebase client config plus server-side settings for the API route handlers (Firebase Admin, GCP, Stripe, LiveKit). See root `.env.example` for the full list.

For local Firebase Admin access (token verification, Firestore), either set `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` service-account values in `.env.local`, or use Application Default Credentials (`gcloud auth application-default login`).

If Turbopack panics after config changes, clear the cache and retry:

```bash
rm -rf /Users/thabhelo/ear/apps/web/.next
```

Fallback dev server (webpack, no Turbopack):

```bash
cd /Users/thabhelo/ear/apps/web
npm run dev:webpack -- -p 3100
```

## Run the app (port 3100)

From the repo root (`/Users/thabhelo/ear`):

```bash
cd /Users/thabhelo/ear/apps/web
npm install
npm run dev -- -p 3100
```

Open [http://localhost:3100](http://localhost:3100).

Verify the API:

```bash
curl http://localhost:3100/api/health
```

Expected JSON includes `"status":"ok"`.

**Port 3100 in use:** stop the old Next dev server, then retry:

```bash
lsof -i :3100
kill <PID>   # or: kill -9 <PID> if it will not exit
```

## Firebase Authentication (localhost)

For sign-in on local dev, **localhost** must be an authorized domain:

1. Open [Firebase Console → Authentication → Settings](https://console.firebase.google.com/project/ear-thabhelo/authentication/settings) (project **ear-thabhelo**).
2. Under **Authorized domains**, add `localhost` if it is not already listed.

## Base URL

Set `APP_BASE_URL=http://localhost:3100` in `apps/web/.env.local` so Stripe redirect URLs and LiveKit join URLs point at your dev server. CORS configuration is no longer needed: the frontend calls the API on the same origin (`/api`).
