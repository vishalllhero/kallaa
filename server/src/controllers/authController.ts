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

    const token = await createToken(
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
      data: {
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
    console.log("Login endpoint hit with:", {
      email: req.body.email,
      method: req.method,
    });
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await (User as any).findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    let isMatch: boolean;
    try {
      isMatch = await (user as any).comparePassword(password);
    } catch (error) {
      console.error("[Auth] Password comparison error:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication error",
      });
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await createToken(
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

    res.json({
      success: true,
      message: "Logged in successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(`[ERROR] Login error:`, error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error instanceof Error ? error.message : "Undefined error",
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
