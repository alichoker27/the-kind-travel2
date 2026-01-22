import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";
import { generateToken } from "@/utils/jwt";

import { LoginDTO } from "@/utils/dto";
import { loginSchema } from "@/utils/validation";

export async function POST(request: Request) {
  try {
    const body: LoginDTO = await request.json();

    // Validate body using zod schema
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parseResult.error.flatten() },
        { status: 400 },
      );
    }

    const { email, password } = parseResult.data;

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = await generateToken({
      adminId: admin.id,
      adminEmail: admin.email,
      adminName: admin.name,
    });

    const res = NextResponse.json({ message: "Login successful" });

    res.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Login failed", error: (error as Error).message },
      { status: 500 },
    );
  }
}
