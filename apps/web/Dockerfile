FROM node:22-slim AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

FROM node:22-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js inlines NEXT_PUBLIC_* at build time. Load production values from the
# same file Cloud Run uses so client bundles include Firebase config.
COPY .cloudrun.env.yaml ./production.build.env
RUN set -a \
  && while IFS= read -r line; do \
    case "$line" in ''|\#*) continue ;; esac; \
    key="${line%%:*}"; \
    val="${line#*: }"; \
    export "$key=$val"; \
  done < production.build.env \
  && set +a \
  && npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=8080

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
