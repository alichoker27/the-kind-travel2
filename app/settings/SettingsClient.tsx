"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Settings/settings.module.css";
import {
  MdSettings,
  MdSecurity,
  MdPerson,
  MdLock,
  MdEmail,
  MdArrowBack,
  MdShield,
} from "react-icons/md";

export default function SettingsClient() {
  return (
    <div className={styles.pageWrapper}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimated}>
        <div className={styles.bgGradient}></div>
        <div className={styles.floatingOrb1}></div>
        <div className={styles.floatingOrb2}></div>
      </div>

      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <Image
          src="/the-kind-travel-logo.jpg"
          alt="The Kind Travel"
          width={180}
          height={120}
          className={styles.navLogo}
          priority
        />
      </nav>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <MdSettings className={styles.headerIcon} />
            <div className={styles.headerText}>
              <h1 className={styles.pageTitle}>Settings</h1>
              <p className={styles.subtitle}>
                Manage your account and security preferences
              </p>
            </div>
            <MdShield className={styles.headerIcon} />
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Security Section */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <MdSecurity className={styles.cardHeaderIcon} />
              <h2 className={styles.cardTitle}>Security & Privacy</h2>
            </div>

            <div className={styles.cardContent}>
              <p className={styles.cardDescription}>
                Update your profile information and manage your password to keep
                your account secure.
              </p>

              <div className={styles.actionsGrid}>
                <Link href="/profile" className={styles.actionButton}>
                  <div className={styles.actionIconWrapper}>
                    <MdPerson className={styles.actionIcon} />
                  </div>
                  <div className={styles.actionContent}>
                    <h3 className={styles.actionTitle}>Edit Profile</h3>
                    <p className={styles.actionDescription}>
                      Update your personal information and preferences
                    </p>
                  </div>
                </Link>

                <Link href="/change-email" className={styles.actionButton}>
                  <div className={styles.actionIconWrapper}>
                    <MdEmail className={styles.actionIcon} />
                  </div>
                  <div className={styles.actionContent}>
                    <h3 className={styles.actionTitle}>Change Email</h3>
                    <p className={styles.actionDescription}>
                      Update your administrative email address
                    </p>
                  </div>
                </Link>

                <Link href="/change-password" className={styles.actionButton}>
                  <div className={styles.actionIconWrapper}>
                    <MdLock className={styles.actionIcon} />
                  </div>
                  <div className={styles.actionContent}>
                    <h3 className={styles.actionTitle}>Change Password</h3>
                    <p className={styles.actionDescription}>
                      Update your password to maintain account security
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Link href="/dashboard" className={styles.backButton}>
            <MdArrowBack className={styles.backIcon} />
            <span>Back to Dashboard</span>
          </Link>
        </main>
      </div>
    </div>
  );
}
