import bcrypt from "bcryptjs";
import * as jose from "jose";

const SALT_ROUNDS = 10;
const JWT_SECRET = new TextEncoder().encode(
  process.env.COOKIE_SECRET || "your-secret-key"
);

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
export async function createToken(
  userId: string,
  email: string,
  role: "user" | "admin" = "user",
  expiresIn: string = "30d"
): Promise<string> {
  const token = await new jose.SignJWT({
    userId,
    email,
    role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<{
  userId: string;
  email: string;
  role: "user" | "admin";
} | null> {
  try {
    const verified = await jose.jwtVerify(token, JWT_SECRET);
    return verified.payload as any;
  } catch (error) {
    console.error("[Auth] Failed to verify token:", error);
    return null;
  }
}
