import Stripe from "stripe";
import { env, stripeConfigured } from "./env.js";

export { stripeConfigured };

export const stripe = stripeConfigured ? new Stripe(env.stripeSecretKey) : null;
