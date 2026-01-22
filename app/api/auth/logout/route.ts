import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout successful" });

  // Clear the cookie by setting it to expire immediately
  res.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
