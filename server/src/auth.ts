import jwt from "jsonwebtoken";
import { env } from "./env.js";

export const AUTH_COOKIE_NAME = "chick_check_session";

export interface AuthTokenPayload {
  userId: string;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "30d" });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.nodeEnv === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
}
