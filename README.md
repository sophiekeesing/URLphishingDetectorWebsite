# Chick Check — website

Marketing site and account portal for **Chick Check**, a browser extension that
warns you about phishing and scam links before you click them. This repo does
**not** contain the extension itself (that lives in a separate repo) — it's the
informational landing page, download call-to-action, and the account area
where users manage their subscription and choose which extension features are
enabled.

## Structure

- [`web/`](web) — Astro site (SSR, Node adapter): landing page, login/register,
  and the `/account` area (dashboard, extension settings, subscription).
- [`server/`](server) — Express + Prisma API: authentication, per-user feature
  settings, and Stripe (test-mode) subscription management.

## Getting started

```bash
make dev
```

This creates `server/.env` and `web/.env` from their `.env.example` files
(generating a random `JWT_SECRET`), installs dependencies, runs the Prisma
migration to create the local SQLite database, and starts both services:

- API — http://localhost:4000
- Website — http://localhost:4321

`Ctrl+C` stops both. Add Stripe test keys to `server/.env` any time to enable
billing (see below) — no need to redo setup.

### Stripe (optional, test mode)

The subscription page works without Stripe configured — upgrade/billing
buttons are disabled and show a note instead. To enable it:

1. Create a test-mode product/price in the [Stripe dashboard](https://dashboard.stripe.com/test/products).
2. Fill in `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` in `server/.env`.
3. Forward webhooks locally with the Stripe CLI and put the signing secret in
   `STRIPE_WEBHOOK_SECRET`:
   ```bash
   stripe listen --forward-to localhost:4000/api/subscription/webhook
   ```
