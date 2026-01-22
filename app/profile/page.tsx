import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuthAdmin } from "@/utils/auth";
import ProfileForm from "./ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Profile | The Kind Travel",
  description: "Manage your admin profile settings.",
};

export default async function ProfilePage() {
  const auth = await getAuthAdmin();

  if (!auth) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileForm />
    </Suspense>
  );
}
