import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 },
      );
    }

    // Validate file type (simple check)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "File must be an image" },
        { status: 400 },
      );
    }

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    let url = "";

    // Hybrid Strategy: Check for Vercel Blob Token
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Production: Upload to Vercel Blob
      const blob = await put(file.name, file, {
        access: "public",
      });
      url = blob.url;
    } else {
      // Development: Save to public/uploads
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, "-")}`;

      const uploadDir = path.join(process.cwd(), "public/uploads");

      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {
        // Ignore if directory exists
      }

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      // Construct public URL
      // NOTE: This assumes the app is served from the root
      url = `/uploads/${filename}`;
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
