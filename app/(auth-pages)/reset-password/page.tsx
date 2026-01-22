import { Suspense } from "react";
import { redirect } from "next/navigation";
import { verifyResetToken } from "@/utils/jwt";
import ResetPasswordForm from "./ResetPasswordForm";
import type { Metadata } from "next";
import styles from "@/styles/AuthStyles/formStyle.module.css";

export const metadata: Metadata = {
  title: "Reset Password | The Kind Travel",
  description: "Set a new password for your administrator account.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token as string | undefined;

  if (!token) {
    redirect("/forgot-password");
  }

  // Server-side validation of token
  const isValid = await verifyResetToken(token);

  if (!isValid) {
    redirect("/forgot-password");
  }

  return (
    <main className={styles.pageWrapper}>
      <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
        <ResetPasswordForm token={token} />
      </Suspense>
    </main>
  );
}
