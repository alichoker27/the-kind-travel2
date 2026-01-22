import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getAuthAdmin } from "@/utils/auth";
import { updateTripSchema } from "@/utils/validation";

// GET: Fetch single trip by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const trip = await prisma.trip.findUnique({
      where: { id: parseInt(id) },
    });

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Fetch trip error:", error);
    return NextResponse.json(
      { message: "Failed to fetch trip" },
      { status: 500 },
    );
  }
}

// PUT: Update trip
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tripId = parseInt(id);
    const body = await request.json();
    const validation = updateTripSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.format() },
        { status: 400 },
      );
    }

    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: validation.data,
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error("Update trip error:", error);
    return NextResponse.json(
      { message: "Failed to update trip" },
      { status: 500 },
    );
  }
}

// DELETE: Delete trip
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tripId = parseInt(id);

    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 });
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Delete trip error:", error);
    return NextResponse.json(
      { message: "Failed to delete trip" },
      { status: 500 },
    );
  }
}
