import { Request, Response } from "express";
import { User } from "../models/User";
import { createToken } from "../auth";

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
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`[DEBUG] Incoming login request for: ${email}`);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await (User as any).findOne({ email });
    if (!user) {
      console.warn(`[WARN] Login failed: User not found for ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      console.warn(`[WARN] Login failed: Invalid password for ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
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

    console.log(`[DEBUG] User logged in successfully: ${email}`);
    res.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token, // Sending token for frontend storage if not using cookies
    });
  } catch (error) {
    console.error(`[ERROR] Login error:`, error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: "Logged out successfully" });
};

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "Not authenticated" });
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};
