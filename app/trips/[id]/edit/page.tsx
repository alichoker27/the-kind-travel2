import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/utils/db";
import { getAuthAdmin } from "@/utils/auth";
import EditTripForm from "./EditTripForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Trip | The Kind Travel",
  description: "Update trip details.",
};

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await getAuthAdmin();

  if (!auth) {
    redirect("/login");
  }

  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id: parseInt(id) },
  });

  if (!trip) {
    notFound();
  }

  return (
    <Suspense
      fallback={<div className="text-center py-20">Loading trip...</div>}
    >
      <EditTripForm trip={trip} />
    </Suspense>
  );
}
