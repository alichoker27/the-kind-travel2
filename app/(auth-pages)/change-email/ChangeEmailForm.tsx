"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MdEmail, MdLock } from "react-icons/md";
import styles from "@/styles/AuthStyles/formStyle.module.css";

export default function ChangeEmailForm() {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Email updated successfully! Redirecting...");
        setTimeout(() => {
          router.push("/settings");
          router.refresh();
        }, 2000);
      } else {
        setError(data.message || "Failed to update email");
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

        <h1 className={styles.formTitle}>Change Email</h1>
        <p className={styles.formSubtitle}>
          Update your administrative email address
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>New Email Address</label>
            <div className={styles.inputWrapper}>
              <MdEmail className={styles.inputIcon} />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter new email"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Current Password</label>
            <div className={styles.inputWrapper}>
              <MdLock className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter current password"
                disabled={loading}
              />
            </div>
            <p
              className={styles.formSubtitle}
              style={{
                marginTop: "0.5rem",
                fontSize: "0.8rem",
                textAlign: "left",
                marginBottom: 0,
              }}
            >
              For security, confirm your identity with your password.
            </p>
          </div>

          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !!message}
            className={styles.submitButton}
          >
            {loading ? "Updating..." : "Update Email"}
          </button>
        </form>

        <div className={styles.linkContainer}>
          <Link href="/settings" className={styles.link}>
            Back to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
