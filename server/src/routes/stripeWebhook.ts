import type { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../db.js";
import { env } from "../env.js";
import { stripe, stripeConfigured } from "../stripe.js";

// Mounted with express.raw() in index.ts — Stripe signature verification needs the raw body.
export async function stripeWebhookHandler(req: Request, res: Response) {
  if (!stripe || !stripeConfigured || !env.stripeWebhookSecret) {
    res.status(503).send("Stripe is not configured on this server yet.");
    return;
  }

  const signature = req.headers["stripe-signature"];
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature as string, env.stripeWebhookSecret);
  } catch (err) {
    res.status(400).send(`Webhook signature verification failed`);
    return;
  }

  const subscriptionEvents = new Set([
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ]);

  if (subscriptionEvents.has(event.type)) {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const periodEnd = sub.current_period_end;

    await prisma.subscription.updateMany({
      where: { stripeCustomerId: customerId },
      data: {
        stripeSubscriptionId: sub.id,
        status: sub.status,
        plan: sub.status === "active" || sub.status === "trialing" ? "pro" : "free",
        currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      },
    });
  }

  res.json({ received: true });
}
