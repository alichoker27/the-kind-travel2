import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuthAdmin } from "@/utils/auth";
import ChangeEmailForm from "./ChangeEmailForm";
import styles from "@/styles/AuthStyles/formStyle.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Email | The Kind Travel",
  description: "Update your administrative email address securely.",
};

export default async function ChangeEmailPage() {
  const admin = await getAuthAdmin();

  if (!admin) {
    redirect("/login");
  }

  return (
    <main className={styles.pageWrapper}>
      <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
        <ChangeEmailForm />
      </Suspense>
    </main>
  );
}
