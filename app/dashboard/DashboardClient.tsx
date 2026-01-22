"use client";

import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import styles from "@/styles/Dashboard/dashboard.module.css";
import {
  MdCardTravel,
  MdAddCircleOutline,
  MdSettings,
  MdPerson,
  MdEmail,
  MdCalendarToday,
  MdDashboard,
  MdAdminPanelSettings,
} from "react-icons/md";

interface AdminData {
  id: number;
  name: string;
  email: string;
  image: string | null;
  createdAt: string | Date;
}

interface DashboardClientProps {
  admin: AdminData;
}

export default function DashboardClient({ admin }: DashboardClientProps) {
  const getInitials = (name: string) => {
    if (!name) return "A";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className={styles.pageWrapper}>
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
        {/* Enhanced Header with Icons */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <MdDashboard className={styles.headerIcon} />
            <div className={styles.headerText}>
              <h1 className={styles.pageTitle}>Admin Dashboard</h1>
              <p className={styles.welcomeText}>
                Manage your luxury travel experiences
              </p>
            </div>
            <MdAdminPanelSettings className={styles.headerIcon} />
          </div>
        </header>

        <div className={styles.dashboardGrid}>
          {/* Profile Section - Bigger Image */}
          <aside className={styles.profileSection}>
            <div className={styles.profileBox}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatarInner}>
                  {admin.image ? (
                    <Image
                      src={admin.image}
                      alt={admin.name}
                      fill
                      className={styles.avatarImage}
                      sizes="200px"
                    />
                  ) : (
                    <span className={styles.avatarInitials}>
                      {getInitials(admin.name)}
                    </span>
                  )}
                </div>
              </div>
              <h2 className={styles.adminName}>{admin.name}</h2>
            </div>
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            {/* Admin Data Box */}
            <div className={styles.dataBox}>
              <div className={styles.boxHeader}>
                <MdPerson className={styles.boxHeaderIcon} />
                <h3 className={styles.boxTitle}>Profile Information</h3>
              </div>
              <div className={styles.dataList}>
                <div className={styles.dataItem}>
                  <MdPerson className={styles.dataIcon} />
                  <div>
                    <label className={styles.dataLabel}>Full Name</label>
                    <p className={styles.dataValue}>{admin.name}</p>
                  </div>
                </div>

                <div className={styles.dataItem}>
                  <MdEmail className={styles.dataIcon} />
                  <div>
                    <label className={styles.dataLabel}>Email Address</label>
                    <p className={styles.dataValue}>{admin.email}</p>
                  </div>
                </div>

                <div className={styles.dataItem}>
                  <MdCalendarToday className={styles.dataIcon} />
                  <div>
                    <label className={styles.dataLabel}>Member Since</label>
                    <p className={styles.dataValue}>
                      {admin.createdAt instanceof Date
                        ? admin.createdAt.toISOString().split("T")[0]
                        : new Date(admin.createdAt).toISOString().split("T")[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Box */}
            <div className={styles.actionsBox}>
              <div className={styles.boxHeader}>
                <MdSettings className={styles.boxHeaderIcon} />
                <h3 className={styles.boxTitle}>Quick Actions</h3>
              </div>
              <div className={styles.actionsGrid}>
                <Link href="/trips" className={styles.actionButton}>
                  <MdCardTravel className={styles.actionIcon} />
                  <span className={styles.actionLabel}>Manage Trips</span>
                </Link>

                <Link
                  href="/trips/create"
                  className={`${styles.actionButton} ${styles.actionPrimary}`}
                >
                  <MdAddCircleOutline className={styles.actionIcon} />
                  <span className={styles.actionLabel}>Create New Trip</span>
                </Link>

                <Link href="/settings" className={styles.actionButton}>
                  <MdSettings className={styles.actionIcon} />
                  <span className={styles.actionLabel}>Account Settings</span>
                </Link>

                <div className={styles.actionButton}>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
