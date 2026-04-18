import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { User } from "../models/User";
import { verifyToken } from "../auth";
import { parse as parseCookie } from "cookie";

const COOKIE_NAME = "kallaa_session"; // Sync with authController

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: any | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const { req, res } = opts;
  let user: any | null = null;

  try {
    const cookieHeader = req.headers.cookie || "";
    const cookies = parseCookie(cookieHeader);
    const token = cookies[COOKIE_NAME];

    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        user = await User.findById(payload.userId);
      }
    }
  } catch (error) {
    console.warn("[Auth] Context error:", error);
    user = null;
  }

  return { req, res, user };
}
