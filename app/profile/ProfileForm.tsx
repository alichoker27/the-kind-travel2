// ProfileForm.tsx - UPDATED WITH STYLED DESIGN
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Profile/profile.module.css";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default function ProfileForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setName(data.name);
          setEmail(data.email);
          setImage(data.image || "");
        } else {
          setError("Failed to load profile");
        }
      } catch (_) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setImage(data.url);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (_) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleRemoveImage() {
    setImage("");
  }

  function getInitials(nameString: string) {
    if (!nameString) return "A";
    const parts = nameString.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameString[0].toUpperCase();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setUpdating(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, image }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        router.refresh();
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (_) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimated}>
        <div className={styles.bgGradient}></div>
        <div className={styles.floatingOrb1}></div>
        <div className={styles.floatingOrb2}></div>
      </div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <Image
          src="/the-kind-travel-logo.jpg"
          alt="The Kind Travel"
          width={60}
          height={60}
          className={styles.navLogo}
        />
      </nav>

      {/* Main Container */}
      <div className={styles.container}>
        <div className={styles.formCard}>
          {/* Header */}
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Admin Profile</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Avatar Section */}
            <div className={styles.avatarSection}>
              <div
                className={styles.avatarWrapper}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={styles.avatarInner}>
                  {image ? (
                    <Image
                      src={image}
                      alt="Profile"
                      fill
                      className={styles.avatarImage}
                      sizes="140px"
                    />
                  ) : (
                    <div className={styles.avatarInitials}>
                      {getInitials(name)}
                    </div>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className={styles.avatarOverlay}>
                  <span className={styles.avatarOverlayText}>Change</span>
                </div>
              </div>

              {/* Avatar Actions */}
              <div className={styles.avatarActions}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={styles.avatarButton}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>

                {image && (
                  <>
                    <span className={styles.avatarDivider}>|</span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={uploading}
                      className={`${styles.avatarButton} ${styles.avatarButtonRemove}`}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className={styles.hiddenInput}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Name Field */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            {/* Success Message */}
            {message && (
              <div className={`${styles.message} ${styles.messageSuccess}`}>
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={`${styles.message} ${styles.messageError}`}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={updating || uploading}
              className={styles.submitButton}
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* Back Link */}
          <Link href="/settings" className={styles.backLink}>
            Back to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
