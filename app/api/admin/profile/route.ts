import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getAuthAdmin } from "@/utils/auth";
import { updateProfileSchema } from "@/utils/validation";
import {
  sendEmail,
  generateProfileUpdateEmailHTML,
} from "@/utils/sendingEmail";

// GET: Fetch current admin profile
export async function GET() {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: auth.adminId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

// PUT: Update admin profile
export async function PUT(request: Request) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.format() },
        { status: 400 },
      );
    }

    const { name, email, image } = validation.data;

    const currentAdmin = await prisma.admin.findUnique({
      where: { id: auth.adminId },
    });

    if (!currentAdmin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    // Determine new image value (handle removal)
    let newImage = undefined;
    if (image !== undefined) {
      newImage = image === "" ? null : image;
    }

    // Track changes
    const changes: { field: string; old: string; new: string }[] = [];
    if (name && name !== currentAdmin.name) {
      changes.push({ field: "Name", old: currentAdmin.name, new: name });
    }
    if (email && email !== currentAdmin.email) {
      changes.push({ field: "Email", old: currentAdmin.email, new: email });
    }

    // Check for image change (if it was provided in request)
    if (newImage !== undefined && newImage !== currentAdmin.image) {
      changes.push({
        field: "Image URL",
        old: currentAdmin.image || "None",
        new: newImage || "None",
      });
    }

    if (changes.length === 0) {
      return NextResponse.json({ message: "No changes detected" });
    }

    // Update DB
    const updatedAdmin = await prisma.admin.update({
      where: { id: auth.adminId },
      data: {
        name: name || undefined,
        email: email || undefined,
        image: newImage, // undefined = no change, null = remove, string = update
      },
    });

    // Send notification email
    const emailHtml = generateProfileUpdateEmailHTML(
      updatedAdmin.name,
      changes,
    );
    try {
      await sendEmail(
        currentAdmin.email,
        "Profile Updated - The Kind Travel",
        emailHtml,
      );
    } catch (emailError) {
      console.error("Failed to send profile update email:", emailError);
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      admin: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        image: updatedAdmin.image, // Can be null
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
