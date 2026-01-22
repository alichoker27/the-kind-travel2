import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, JwtPayload } from "./jwt";

/**
 * FOR MIDDLEWARE ONLY - Uses NextRequest
 */
export async function authenticateRequest(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return {
      error: NextResponse.json(
        { message: "No token provided, please log in" },
        { status: 401 },
      ),
      user: null,
    };
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    return {
      error: NextResponse.json(
        { message: "Invalid or expired token, please log in again" },
        { status: 401 },
      ),
      user: null,
    };
  }

  return {
    error: null,
    user: decoded,
  };
}

/**
 * FOR API ROUTES & SERVER COMPONENTS - Uses cookies()
 */
export async function getAuthAdmin(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  return await verifyToken(token);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const admin = await getAuthAdmin();
  return admin !== null;
}
