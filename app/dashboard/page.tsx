import { prisma } from "@/utils/db";
import { getAuthAdmin } from "@/utils/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | The Kind Travel",
  description: "Manage your travel adventures and account settings.",
};

export default async function DashboardPage() {
  const auth = await getAuthAdmin();

  if (!auth) {
    redirect("/login");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: auth.adminId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!admin) {
    redirect("/login");
  }

  return <DashboardClient admin={admin} />;
}
