import jwt, { Secret } from "jsonwebtoken";

//Define the shape of the data that will be stored in the jwt payload
export interface JwtPayload {
  adminId: number;
  adminEmail: string;
  adminName: string;
}

//Load and validate the JWT_SECRET from the .env file
const JWT_SECRET: Secret = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variable");
}

// Enforce minimum secret length in production for security
if (process.env.NODE_ENV === "production" && JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET must be at least 32 characters in production. Generate a strong secret using: openssl rand -base64 32",
  );
}

/**
 * Generates a JSON Web Token (JWT) for a given user payload.
 * @param payload The data to be stored in the token (e.g., admin ID, email , name).
 * @param expiresIn The duration after which the token expires (e.g., '1h', '7d').
 * @returns The generated JWT string.
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }); // 1 day
}

/**
 * Verifies a JSON Web Token (JWT) and returns its decoded payload.
 * @param token The JWT string to verify.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (e) {
    console.error("JWT verification failed :", e);
    return null;
  }
}

/**
 * Reset Token Payload
 * Includes both adminId and email to make validation more secure.
 */
interface ResetTokenPayload {
  adminId: number;
  email: string;
}

/**
 * Generates a password reset token (expires in 1 hour)
 * @param adminId - Admin's ID
 * @param email - Admin's email address
 * @returns Reset token string
 */
export function generateResetToken(adminId: number, email: string): string {
  return jwt.sign({ adminId, email }, JWT_SECRET, { expiresIn: "1h" });
}

/**
 * Verifies a password reset token
 * @param token - Reset token to verify
 * @returns Payload if valid, null if invalid/expired
 */
export function verifyResetToken(token: string): ResetTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ResetTokenPayload;
    return decoded;
  } catch (e) {
    console.error("Reset token verification failed:", e);
    return null;
  }
}
