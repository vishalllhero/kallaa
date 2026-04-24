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
    console.log(`🔐 AUTH CHECK: ${req.method} ${req.path}`);

    const token =
      req.cookies[COOKIE_NAME] || req.headers.authorization?.split(" ")[1];

    console.log("🔐 Token present:", !!token);
    console.log("🔐 Cookie name:", COOKIE_NAME);
    console.log("🔐 Cookies available:", Object.keys(req.cookies || {}));

    if (!token) {
      console.log("❌ AUTH FAILED: No token provided");
      return res
        .status(401)
        .json({ success: false, message: "No authentication token provided" });
    }

    const payload = verifyToken(token);
    console.log(
      "🔐 Token payload:",
      payload
        ? { userId: payload.userId, email: payload.email, role: payload.role }
        : "INVALID"
    );

    if (!payload) {
      console.log("❌ AUTH FAILED: Invalid token");
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await (User as any).findById(payload.userId);
    console.log(
      "🔐 User lookup result:",
      user ? { id: user._id, email: user.email, role: user.role } : "NOT FOUND"
    );

    if (!user) {
      console.log("❌ AUTH FAILED: User not found in database");
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    (req as any).user = user;
    console.log("✅ AUTH SUCCESS: User authenticated:", user.email);
    next();
  } catch (error: any) {
    console.error(`💥 CRITICAL AUTH ERROR:`, error);
    res
      .status(500)
      .json({ success: false, message: "Server error during authentication" });
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
