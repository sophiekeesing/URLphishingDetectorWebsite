import { Router } from "express";
import { prisma } from "../db.js";
import { env } from "../env.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { stripe, stripeConfigured } from "../stripe.js";

export const subscriptionRouter = Router();
subscriptionRouter.use(requireAuth);

subscriptionRouter.get("/", async (req, res) => {
  const subscription = await prisma.subscription.upsert({
    where: { userId: req.userId! },
    update: {},
    create: { userId: req.userId! },
  });
  res.json({ ...subscription, stripeConfigured });
});

subscriptionRouter.post("/checkout", async (req, res) => {
  if (!stripe) {
    res.status(503).json({ error: "Stripe is not configured on this server yet." });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  const subscription = await prisma.subscription.upsert({
    where: { userId: req.userId! },
    update: {},
    create: { userId: req.userId! },
  });

  let customerId = subscription.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user?.email,
      metadata: { userId: req.userId! },
    });
    customerId = customer.id;
    await prisma.subscription.update({
      where: { userId: req.userId! },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: env.stripePriceId, quantity: 1 }],
    success_url: `${env.webOrigin}/account/subscription?checkout=success`,
    cancel_url: `${env.webOrigin}/account/subscription?checkout=cancelled`,
    metadata: { userId: req.userId! },
  });

  res.json({ url: session.url });
});

subscriptionRouter.post("/portal", async (req, res) => {
  if (!stripe) {
    res.status(503).json({ error: "Stripe is not configured on this server yet." });
    return;
  }

  const subscription = await prisma.subscription.findUnique({ where: { userId: req.userId! } });
  if (!subscription?.stripeCustomerId) {
    res.status(400).json({ error: "No billing account found for this user yet." });
    return;
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${env.webOrigin}/account/subscription`,
  });

  res.json({ url: portalSession.url });
});
