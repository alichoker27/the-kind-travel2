"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "@/styles/AuthStyles/formStyle.module.css";
import Image from "next/image";
import { FaLock } from "react-icons/fa";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/settings");
        }, 2000);
      } else {
        setError(data.message || "Failed to change password");
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

        <h1 className={styles.formTitle}>Change Password</h1>
        <p className={styles.formSubtitle}>Update your security credentials</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Current Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>New Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm New Password</label>
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
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Updating..." : "Update Password"}
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
