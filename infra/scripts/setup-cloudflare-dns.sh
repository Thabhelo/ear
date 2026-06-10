#!/usr/bin/env bash
# Optional DNS helpers when CLOUDFLARE_API_TOKEN is set.
# Worker routes (wrangler deploy) are the primary path; this script ensures
# www/api CNAMEs exist pointing at the apex zone.
set -euo pipefail

ZONE_NAME="${1:-callsomeone.org}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Set CLOUDFLARE_API_TOKEN with Zone:Read and DNS:Edit scopes."
  exit 1
fi

ZONE_ID="$(curl -sS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['result'][0]['id'])")"

echo "Zone ${ZONE_NAME} -> ${ZONE_ID}"

upsert_cname() {
  local name="$1"
  local target="$2"
  local existing
  existing="$(curl -sS -G -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
    --data-urlencode "type=CNAME" \
    --data-urlencode "name=${name}" \
    | python3 -c "import sys,json; r=json.load(sys.stdin)['result']; print(r[0]['id'] if r else '')")"

  if [[ -n "$existing" ]]; then
    curl -sS -X PUT -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${existing}" \
      --data "{\"type\":\"CNAME\",\"name\":\"${name}\",\"content\":\"${target}\",\"proxied\":true}" >/dev/null
    echo "Updated CNAME ${name} -> ${target}"
  else
    curl -sS -X POST -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
      --data "{\"type\":\"CNAME\",\"name\":\"${name}\",\"content\":\"${target}\",\"proxied\":true}" >/dev/null
    echo "Created CNAME ${name} -> ${target}"
  fi
}

upsert_cname "www" "${ZONE_NAME}"
upsert_cname "api" "${ZONE_NAME}"

echo "Done. Deploy the Worker: cd infra/cloudflare-proxy && npm run deploy"
