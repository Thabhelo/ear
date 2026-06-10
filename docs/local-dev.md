# Local development

**Repository location:** `/Users/thabhelo/ear` (canonical local path; the old `~/repos/ear` path is obsolete).

Run the web app and API in **two terminals**. Use Python **3.12+** (3.13 recommended) for the API.

## Prerequisites

- Node.js and npm (monorepo root or `apps/web`)
- Python 3.13 (`brew install python@3.13` or use `/opt/homebrew/bin/python3.13`)
- Copy or create env files (never commit them):
  - `apps/api/.env` — API secrets and GCP/Firebase/Stripe/LiveKit settings (loaded via `app/settings.py`)
  - `apps/web/.env.local` — `NEXT_PUBLIC_*` Firebase client config and `NEXT_PUBLIC_API_BASE_URL` (use `http://127.0.0.1:8080` when the API runs on port 8080)

If you moved the repo (for example from `~/repos/ear` to `~/ear`), delete and recreate `apps/api/.venv` so scripts point at the correct path (old venvs break `pip`/`uvicorn` shebangs).

## Terminal 1 — Web (port 3100)

From the repo root (`/Users/thabhelo/ear`):

```bash
cd /Users/thabhelo/ear/apps/web
npm install
npm run dev -- -p 3100
```

Open [http://localhost:3100](http://localhost:3100).

**Port 3100 in use:** stop the old Next dev server, then retry:

```bash
lsof -i :3100
kill <PID>   # or: kill -9 <PID> if it will not exit
```

## Terminal 2 — API (port 8080)

```bash
cd /Users/thabhelo/ear/apps/api
python3.13 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```

Verify:

```bash
curl http://127.0.0.1:8080/health
```

Expected JSON includes `"status":"ok"`.

Always activate the venv before `uvicorn`; otherwise you may hit `ModuleNotFoundError` (e.g. `firebase_admin`).

**Port 8080 in use:**

```bash
lsof -i :8080
kill <PID>
```

## Firebase Authentication (localhost)

For sign-in on local dev, **localhost** must be an authorized domain:

1. Open [Firebase Console → Authentication → Settings](https://console.firebase.google.com/project/ear-thabhelo/authentication/settings) (project **ear-thabhelo**).
2. Under **Authorized domains**, add `localhost` if it is not already listed.

## CORS / origins

The API defaults `ALLOWED_ORIGINS` to `http://localhost:3000`. If the web app runs on **3100**, set in `apps/api/.env` for example:

```env
ALLOWED_ORIGINS=["http://localhost:3100","http://127.0.0.1:3100"]
APP_BASE_URL=http://localhost:3100
```

(Pydantic settings accept JSON array syntax for list fields.)
