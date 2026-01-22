import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuthAdmin } from "@/utils/auth";
import ChangePasswordForm from "./ChangePasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password | The Kind Travel",
  description: "Update your administrator password.",
};

import styles from "@/styles/AuthStyles/formStyle.module.css";

export default async function ChangePasswordPage() {
  const auth = await getAuthAdmin();

  if (!auth) {
    redirect("/login");
  }

  return (
    <main className={styles.pageWrapper}>
      <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
        <ChangePasswordForm />
      </Suspense>
    </main>
  );
}
