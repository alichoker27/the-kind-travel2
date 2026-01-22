import { Suspense } from "react";
import LoginForm from "./LoginForm";
import styles from "@/styles/AuthStyles/formStyle.module.css";

export default function LoginPage() {
  return (
    <main className={styles.pageWrapper}>
      <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
