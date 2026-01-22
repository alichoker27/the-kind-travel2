import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/utils/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Protect only dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
