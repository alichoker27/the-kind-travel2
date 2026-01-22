"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/AuthStyles/formStyle.module.css";
import Image from "next/image";

import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.refresh();
      router.push("/dashboard");
    } else {
      setMessage(data.message);
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

        <h1 className={styles.formTitle}>Welcome Back</h1>
        <p className={styles.formSubtitle}>Sign in to continue your journey</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className={styles.input}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className={styles.input}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>

          {message && <p className={styles.errorMessage}>{message}</p>}

          <div className={styles.linkContainer}>
            <a href="/forgot-password" className={styles.link}>
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
