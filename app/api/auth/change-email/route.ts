import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import bcrypt from "bcryptjs";
import { getAuthAdmin } from "@/utils/auth";
import { sendEmail, generateEmailChangeEmailHTML } from "@/utils/sendingEmail";

/**
 * Validates if an email is not a "demo" or "test" email.
 */
function isRealEmail(email: string): boolean {
  const demoPrefixes = ["test", "demo", "user", "admin", "guest", "example"];
  const demoDomains = [
    "example.com",
    "test.com",
    "mailinator.com",
    "tempmail.org",
  ];

  const [localPart, domain] = email.toLowerCase().split("@");

  if (!localPart || !domain) return false;

  // Check if prefix is too generic or contains demo keywords
  if (
    demoPrefixes.some((prefix) => localPart.includes(prefix)) ||
    localPart.length < 3
  ) {
    return false;
  }

  // Check if domain is a known demo/temp domain
  if (demoDomains.includes(domain)) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    // 1. Verify Authentication
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { newEmail, password } = await request.json();

    if (!newEmail || !password) {
      return NextResponse.json(
        { message: "New email and current password are required" },
        { status: 400 },
      );
    }

    // 2. Validate Email Format & "Realness"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 },
      );
    }

    if (!isRealEmail(newEmail)) {
      return NextResponse.json(
        {
          message:
            "Please use a professional email address. Demo or generic emails are not allowed.",
        },
        { status: 400 },
      );
    }

    // 3. Fetch Admin
    const admin = await prisma.admin.findUnique({
      where: { id: auth.adminId },
    });

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    // Capture old email for notification
    const oldEmail = admin.email;

    // 4. Verify Current Password for security
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect password. Confirmation failed." },
        { status: 400 },
      );
    }

    // 5. Check if New Email is already in use
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: newEmail },
    });

    if (existingAdmin && existingAdmin.id !== admin.id) {
      return NextResponse.json(
        { message: "This email is already registered with another account" },
        { status: 400 },
      );
    }

    // 6. Update Database
    await prisma.admin.update({
      where: { id: admin.id },
      data: { email: newEmail },
    });

    // 7. Send Confirmation Emails (to BOTH old and new emails for security)
    const emailHtml = generateEmailChangeEmailHTML(
      admin.name,
      oldEmail,
      newEmail,
    );

    // Notify New Email
    try {
      await sendEmail(
        newEmail,
        "Email Address Updated - The Kind Travel",
        emailHtml,
      );
    } catch (emailError) {
      console.error("Failed to send email to new address:", emailError);
    }

    // Notify Old Email (Security standard: alert the user on their previous address)
    try {
      await sendEmail(
        oldEmail,
        "Security Alert: Your Email Was Changed - The Kind Travel",
        emailHtml,
      );
    } catch (emailError) {
      console.error("Failed to send alert to old address:", emailError);
    }

    return NextResponse.json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Change email error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the email" },
      { status: 500 },
    );
  }
}
