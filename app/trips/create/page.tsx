import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuthAdmin } from "@/utils/auth";
import CreateTripForm from "./CreateTripForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Trip | The Kind Travel",
  description: "Add a new trip to the catalog.",
};

export default async function CreateTripPage() {
  const auth = await getAuthAdmin();

  if (!auth) {
    redirect("/login");
  }

  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#d4af37",
          }}
        >
          Loading...
        </div>
      }
    >
      <CreateTripForm />
    </Suspense>
  );
}
