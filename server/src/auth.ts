import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain password with a hashed password
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT token for a user
 */
export function createToken(
  userId: string,
  email: string,
  role: "user" | "admin" = "user",
  expiresIn: string = "30d"
): string {
  const token = (jwt as any).sign(
    {
      userId,
      email,
      role,
    },
    JWT_SECRET as string,
    { expiresIn }
  );

  return token;
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): {
  userId: string;
  email: string;
  role: "user" | "admin";
} | null {
  try {
    const decoded = (jwt as any).verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    console.error("[Auth] Failed to verify token:", error);
    return null;
  }
}
