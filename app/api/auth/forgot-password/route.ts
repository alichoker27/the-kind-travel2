import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { generateResetToken } from "@/utils/jwt";
import { sendEmail, generateResetEmailHTML } from "@/utils/sendingEmail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      // For security, do not reveal if the email exists or not
      return NextResponse.json(
        { message: "If the email exists, a reset link has been sent." },
        { status: 200 },
      );
    }

    const token = await generateResetToken(admin.id, admin.email);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "http://localhost:3000";
    const resetLink = `${appUrl}/reset-password?token=${token}`;
    const emailHtml = generateResetEmailHTML(resetLink);

    await sendEmail(
      admin.email,
      "Password Reset Request - The Kind Travel",
      emailHtml,
    );

    return NextResponse.json({
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
