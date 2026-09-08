import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./env.js";
import { authRouter } from "./routes/auth.js";
import { settingsRouter } from "./routes/settings.js";
import { subscriptionRouter } from "./routes/subscription.js";
import { stripeWebhookHandler } from "./routes/stripeWebhook.js";

const app = express();

app.use(cors({ origin: env.webOrigin, credentials: true }));

// Stripe needs the raw request body to verify webhook signatures, so this
// route is registered before the JSON body parser.
app.post("/api/subscription/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/subscription", subscriptionRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(env.port, () => {
  console.log(`Chick-Check API listening on http://localhost:${env.port}`);
});
