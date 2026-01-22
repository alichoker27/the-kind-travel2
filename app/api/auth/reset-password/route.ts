import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import bcrypt from "bcryptjs";
import { verifyResetToken } from "@/utils/jwt";
import {
  sendEmail,
  generatePasswordChangeEmailHTML,
} from "@/utils/sendingEmail";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 },
      );
    }

    // Verify token validity
    const decoded = await verifyResetToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // Find admin to ensure they exist
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
    });

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in database
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    // Send confirmation email
    console.log(
      "[ResetPasswordAPI] Generating confirmation email for:",
      admin.email,
    );
    const emailHtml = generatePasswordChangeEmailHTML(admin.name);

    console.log("[ResetPasswordAPI] Sending email...");
    await sendEmail(
      admin.email,
      "Password Changed Successfully - The Kind Travel",
      emailHtml,
    );
    console.log("[ResetPasswordAPI] Email sent.");

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
