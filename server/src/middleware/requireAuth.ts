import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "../auth.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  req.userId = payload.userId;
  next();
}
