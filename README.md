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
npm install

# server/.env — copy from server/.env.example and fill in JWT_SECRET (and
# Stripe test keys if you want billing to work)
cp server/.env.example server/.env
cp web/.env.example web/.env

npm run prisma:migrate -w server   # creates the local SQLite database
npm run dev:server                 # http://localhost:4000
npm run dev:web                    # http://localhost:4321
```

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
