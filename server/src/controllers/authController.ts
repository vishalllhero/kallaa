import { Request, Response } from "express";
import { User } from "../models/User.js";
import { createToken } from "../auth.js";

const COOKIE_NAME = "kallaa_session";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    const existingUser = await (User as any).findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = new User({ name, email, password });
    await user.save();

    const token = createToken(
      (user._id as any).toString(),
      user.email!,
      user.role as any
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(`[ERROR] Register error:`, error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error instanceof Error ? error.message : "Undefined error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("🔐 LOGIN REQUEST - Origin:", req.headers.origin);
    console.log("🔐 LOGIN REQUEST - Method:", req.method);
    console.log("🔐 LOGIN BODY:", req.body);

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("❌ LOGIN FAILED: Missing email or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    console.log("🔍 Searching for user with email:", normalizedEmail);

    const user = await (User as any).findOne({ email: normalizedEmail });
    console.log(
      "📊 DB USER FOUND:",
      user
        ? {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            hasPassword: !!user.password,
            passwordHash: user.password
              ? user.password.substring(0, 10) + "..."
              : "none",
          }
        : "❌ NO USER FOUND"
    );

    if (!user) {
      console.log(
        "❌ LOGIN FAILED: User not found for email:",
        normalizedEmail
      );
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("🔐 Comparing passwords...");
    let isMatch: boolean;
    try {
      isMatch = await (user as any).comparePassword(password);
      console.log(
        "🔐 Password match result:",
        isMatch ? "✅ MATCH" : "❌ NO MATCH"
      );
    } catch (error) {
      console.error("💥 AUTH ERROR: Password comparison failed:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication system error",
      });
    }

    if (!isMatch) {
      console.log(
        "❌ LOGIN FAILED: Password mismatch for user:",
        normalizedEmail
      );
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("✅ AUTHENTICATION SUCCESSFUL for user:", normalizedEmail);

    const token = createToken(
      (user._id as any).toString(),
      user.email!,
      user.role as any
    );

    // Set cookie for session management
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    console.log("🍪 Cookie set for user:", normalizedEmail);

    res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

    console.log("📤 Login response sent successfully");
  } catch (error: any) {
    console.error(`💥 CRITICAL LOGIN ERROR:`, {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
    });

    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
