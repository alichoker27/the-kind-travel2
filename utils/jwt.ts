import { SignJWT, jwtVerify } from "jose";

//Define the shape of the data that will be stored in the jwt payload
export interface JwtPayload {
  adminId: number;
  adminEmail: string;
  adminName: string;
  [key: string]: unknown; // Allow for other standard JWT claims
}

//Load and validate the JWT_SECRET from the .env file
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variable");
}

// Enforce minimum secret length in production for security
if (process.env.NODE_ENV === "production" && JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET must be at least 32 characters in production. Generate a strong secret using: openssl rand -base64 32",
  );
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

/**
 * Generates a JSON Web Token (JWT) for a given user payload.
 * @param payload The data to be stored in the token (e.g., admin ID, email , name).
 * @returns The generated JWT string.
 */
export async function generateToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
}

/**
 * Verifies a JSON Web Token (JWT) and returns its decoded payload.
 * @param token The JWT string to verify.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JwtPayload;
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
  [key: string]: unknown;
}

/**
 * Generates a password reset token (expires in 1 hour)
 * @param adminId - Admin's ID
 * @param email - Admin's email address
 * @returns Reset token string
 */
export async function generateResetToken(
  adminId: number,
  email: string,
): Promise<string> {
  return new SignJWT({ adminId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secretKey);
}

/**
 * Verifies a password reset token
 * @param token - Reset token to verify
 * @returns Payload if valid, null if invalid/expired
 */
export async function verifyResetToken(
  token: string,
): Promise<ResetTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as ResetTokenPayload;
  } catch (e) {
    console.error("Reset token verification failed:", e);
    return null;
  }
}
