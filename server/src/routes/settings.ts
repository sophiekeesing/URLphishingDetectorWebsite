import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const settingsRouter = Router();
settingsRouter.use(requireAuth);

const featureKeys = [
  "linkScanning",
  "formProtection",
  "typosquatWarnings",
  "downloadScanning",
  "communityReports",
  "weeklyEmailSummary",
] as const;

const updateSchema = z
  .object(Object.fromEntries(featureKeys.map((key) => [key, z.boolean()])) as Record<(typeof featureKeys)[number], z.ZodBoolean>)
  .partial();

settingsRouter.get("/", async (req, res) => {
  const settings = await prisma.featureSettings.upsert({
    where: { userId: req.userId! },
    update: {},
    create: { userId: req.userId! },
  });
  res.json(settings);
});

settingsRouter.patch("/", async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid settings payload" });
    return;
  }

  const settings = await prisma.featureSettings.upsert({
    where: { userId: req.userId! },
    update: parsed.data,
    create: { userId: req.userId!, ...parsed.data },
  });
  res.json(settings);
});
