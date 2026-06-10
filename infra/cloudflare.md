# Cloudflare + callsomeone.org

Production app stays on **Google Cloud Run**. Cloudflare sits in front with a small **Worker proxy** so `callsomeone.org` serves the site without moving the Next.js app off GCP.

## Architecture

| Host | Backend |
| ---- | ------- |
| `callsomeone.org` | `pickup-web` (Cloud Run) |
| `www.callsomeone.org` | `pickup-web` (Cloud Run) |
| `api.callsomeone.org` | `pickup-api` (Cloud Run) |

Worker code: [`infra/cloudflare-proxy/`](./cloudflare-proxy/)

`wrangler.toml` uses `name = "ear"` and `custom_domain = true` on each hostname so Cloudflare Git builds stay in sync with the dashboard.

## One-time setup

### 1. Log in to Cloudflare CLI

```bash
cd /Users/thabhelo/ear/infra/cloudflare-proxy
npm install
npx wrangler login
```

### 2. Deploy the edge Worker

```bash
npm run deploy
```

Wrangler attaches routes from `wrangler.toml` to zone `callsomeone.org`.

### 3. Fix the failed Cloudflare Git build (if you use CI)

In **Workers & Pages → your project → Settings → Build**:

| Setting | Value |
| ------- | ----- |
| Root directory | `infra/cloudflare-proxy` |
| Build command | *(leave empty)* |
| Deploy command | `npx wrangler deploy` |

Do **not** run `wrangler deploy` from the repo root. The monorepo has no Worker there, which caused the workspace error.

### 4. DNS (Cloudflare dashboard)

If routes are not auto-created, ensure these exist in **DNS → Records** for `callsomeone.org`:

| Type | Name | Content | Proxy |
| ---- | ---- | ------- | ----- |
| A | `@` | `192.0.2.1` (placeholder) or Worker route | Proxied |
| CNAME | `www` | `callsomeone.org` | Proxied |
| CNAME | `api` | `callsomeone.org` | Proxied |

With **Worker routes** configured, Cloudflare routes traffic to the Worker; apex can use proxied records or CNAME flattening per your zone setup.

### 5. Firebase authorized domains

In [Firebase Console → Authentication → Settings](https://console.firebase.google.com/project/ear-thabhelo/authentication/settings), add:

- `callsomeone.org`
- `www.callsomeone.org`

### 6. Redeploy Cloud Run (GitHub Actions)

Push to `main` so `pickup-web` and `pickup-api` pick up updated env in:

- `apps/web/.cloudrun.env.yaml` → `NEXT_PUBLIC_API_BASE_URL=https://api.callsomeone.org`
- `apps/api/.cloudrun.env.yaml` → `APP_BASE_URL`, `ALLOWED_ORIGINS`

## Optional: native Cloud Run custom domains

Instead of the Worker proxy, you can map domains directly in GCP after verifying ownership in [Google Search Console](https://search.google.com/search-console):

```bash
gcloud domains verify callsomeone.org
gcloud beta run domain-mappings create --service=pickup-web --domain=callsomeone.org --region=us-central1 --project=ear-thabhelo
gcloud beta run domain-mappings create --service=pickup-api --domain=api.callsomeone.org --region=us-central1 --project=ear-thabhelo
```

Add the DNS records Google shows into Cloudflare. The Worker proxy is simpler and already handles SSL at the edge.

## API token (optional automation)

```bash
export CLOUDFLARE_API_TOKEN=...
./infra/scripts/setup-cloudflare-dns.sh callsomeone.org
```

Requires token scopes: `Zone:Read`, `DNS:Edit`, `Workers Routes:Edit`.
