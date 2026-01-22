import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getAuthAdmin } from "@/utils/auth";
import { CreateTripSchema } from "@/utils/validation";

// GET: Fetch all trips
export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(trips);
  } catch (error) {
    console.error("Fetch trips error:", error);
    return NextResponse.json(
      { message: "Failed to fetch trips" },
      { status: 500 },
    );
  }
}

// POST: Create a new trip
export async function POST(request: Request) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = CreateTripSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.format() },
        { status: 400 },
      );
    }

    const { title, tourType, includes, notes, places, description, images } =
      validation.data;

    const newTrip = await prisma.trip.create({
      data: {
        title,
        tourType,
        includes,
        notes,
        places,
        description,
        images,
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error("Create trip error:", error);
    return NextResponse.json(
      { message: "Failed to create trip" },
      { status: 500 },
    );
  }
}
