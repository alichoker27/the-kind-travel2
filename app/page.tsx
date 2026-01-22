// ============================================
// FILE: app/page.tsx (MAIN PAGE - REFACTORED)
// ============================================
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FloatingIcons from "@/components/LandingPageSections/FloatingIcons";
import Logo from "@/components/LandingPageSections/Logo";
import Title from "@/components/LandingPageSections/Title";
import LoadingSpinner from "@/components/LandingPageSections/LoadingSpinner";
import styles from "./page.module.css";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/trips");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      <FloatingIcons />

      <div className={styles.content}>
        <Logo />
        <Title main="The Kind Travel" subtitle="Discover Your Next Adventure" />
        <LoadingSpinner message="Preparing amazing trips for you..." />
      </div>
    </div>
  );
}
