import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth.js";
import { User } from "../models/User.js";

const COOKIE_NAME = "kallaa_session"; // Ensure this matches what's used in login

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies[COOKIE_NAME] || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token provided" });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await (User as any).findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error(`[ERROR] Authentication error:`, error);
    res.status(500).json({ message: "Server error during authentication" });
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  if (!user || user.role !== "admin") {
    console.warn(
      `[WARN] Unauthorized admin access attempt by: ${user?.email || "Unknown"}`
    );
    return res.status(403).json({ message: "Forbidden: Admin access only" });
  }
  next();
};
