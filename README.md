# Ear

Ear is an on-demand human presence platform.

The product starts as a single-provider service: customers connect to Thabhelo through a platform identity, never through personal phone numbers, email, WhatsApp, Instagram, or other private accounts.

## Product

Ear sells access to a real human who responds.

- Just Listen: the customer talks, the host listens, no advice unless requested.
- Conversation: normal two-way conversation.
- Deep Talk: life, relationships, dreams, failures, loneliness, and whatever is on the customer's mind.
- Silent Company: almost no talking, just another person present.
- Study Buddy: quiet co-working.
- Game Mode: play games together.

## Pricing

One-off sessions are the acquisition funnel.

- Quick Call: $2.99 for 3 minutes.
- Standard Call: $6.99 for 25 minutes.
- Long Call: $14.99 for 60 minutes.
- Text once: $6.99/day.
- Priority Access: customers may add any bid amount to move higher in the queue.

Subscription tiers sell access.

- Text Friend: $4.99/month.
- Friend: $19/month.
- Close Friend: $29.99/month.
- Always There: $49/month.

## Architecture

See `docs/architecture.md` for the low-level system diagram and data model.

## Development

**Local clone:** `/Users/thabhelo/ear` (use this path; `~/repos/ear` is no longer used).

This repository is a monorepo:

- `apps/web`: Next.js frontend deployed as `pickup-web`.
- `apps/api`: FastAPI backend deployed as `pickup-api`.
- `docs`: product, architecture, and operating docs.
- `infra`: local and cloud infrastructure notes.

See **[docs/local-dev.md](docs/local-dev.md)** for exact commands (ports 3100 / 8080), `.env` setup, and Firebase authorized domains.
