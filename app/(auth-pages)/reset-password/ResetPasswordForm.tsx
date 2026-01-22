"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/AuthStyles/formStyle.module.css";
import Image from "next/image";
import { FaLock } from "react-icons/fa";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.formCard}>
        <div className={styles.logoContainer}>
          <Image
            src="/the-kind-travel-logo.jpg"
            alt="The Kind Travel"
            width={200}
            height={133}
            className={styles.logo}
            priority
          />
        </div>

        <h1 className={styles.formTitle}>Reset Password</h1>
        <p className={styles.formSubtitle}>
          Set a new password for your account
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>New Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !!message}
            className={styles.submitButton}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className={styles.linkContainer}>
          <Link href="/login" className={styles.link}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
