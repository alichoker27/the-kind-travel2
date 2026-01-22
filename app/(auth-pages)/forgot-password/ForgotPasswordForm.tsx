"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/AuthStyles/formStyle.module.css";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (_) {
      setError("Failed to send request. Please try again.");
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

        <h1 className={styles.formTitle}>Forgot Password</h1>
        <p className={styles.formSubtitle}>
          Enter your email address and we will send you a link to reset your
          password
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="you@email.com"
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
            <span>{loading ? "Sending..." : "Send Reset Link"}</span>
          </button>

          <div className={styles.linkContainer}>
            <Link href="/login" className={styles.link}>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
