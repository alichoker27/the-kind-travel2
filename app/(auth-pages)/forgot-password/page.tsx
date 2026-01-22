import { Suspense } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import styles from "@/styles/AuthStyles/formStyle.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | The Kind Travel",
  description: "Reset your administrator password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className={styles.pageWrapper}>
      <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </main>
  );
}
