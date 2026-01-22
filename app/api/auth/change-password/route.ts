import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import bcrypt from "bcryptjs";
import { getAuthAdmin } from "@/utils/auth";
import {
  sendEmail,
  generatePasswordChangeEmailHTML,
} from "@/utils/sendingEmail";

export async function POST(request: Request) {
  try {
    // 1. Verify Authentication
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current and new passwords are required" },
        { status: 400 },
      );
    }

    // 2. Fetch Admin
    const admin = await prisma.admin.findUnique({
      where: { id: auth.adminId },
    });

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    // 3. Verify Current Password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect current password" },
        { status: 400 },
      );
    }

    // 4. Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update Database
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    // 6. Send Confirmation Email
    const emailHtml = generatePasswordChangeEmailHTML(admin.name);
    try {
      await sendEmail(
        admin.email,
        "Password Changed Successfully - The Kind Travel",
        emailHtml,
      );
    } catch (emailError) {
      console.error("Failed to send password change email:", emailError);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
