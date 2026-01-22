// page.tsx - SERVER COMPONENT WITH PREMIUM DESIGN
import { Suspense } from "react";
import { prisma } from "@/utils/db";
import { getAuthAdmin } from "@/utils/auth";
import TripCard from "./TripCard";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import styles from "@/styles/Trips/trips.module.css";

export const metadata: Metadata = {
  title: "All Trips | The Kind Travel",
  description: "Explore our curated travel experiences.",
};

async function getTrips() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
    });
    return trips;
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return [];
  }
}

export default async function TripsPage() {
  const auth = await getAuthAdmin();
  const isAdmin = !!auth;
  const trips = await getTrips();

  return (
    <div className={styles.pageWrapper}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimated}>
        <div className={styles.bgGradient}></div>
        <div className={styles.floatingOrb1}></div>
        <div className={styles.floatingOrb2}></div>
      </div>

      {/* Navbar - Scrollable (not fixed) */}
      <nav className={styles.navbar}>
        <Link href="/admin">
          <Image
            src="/the-kind-travel-logo.jpg"
            alt="The Kind Travel"
            width={60}
            height={60}
            className={styles.navLogo}
          />
        </Link>
      </nav>

      {/* Main Container */}
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 className={styles.pageTitle}>Our Trips</h1>
              <p className={styles.pageSubtitle}>
                Discover amazing places and unforgettable experiences.
              </p>
            </div>

            {isAdmin && (
              <Link href="/trips/create" className={styles.createButton}>
                + Create New Trip
              </Link>
            )}
          </div>
        </div>

        {/* Trips Grid */}
        <Suspense
          fallback={
            <div className={styles.loadingContainer}>
              <p className={styles.loadingText}>Loading trips...</p>
            </div>
          }
        >
          {trips.length > 0 ? (
            <div className={styles.tripsGrid}>
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} isAdmin={isAdmin} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>No trips found yet.</p>
              {isAdmin && (
                <Link href="/trips/create" className={styles.emptyStateLink}>
                  Create your first trip
                </Link>
              )}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
