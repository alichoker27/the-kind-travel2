"use client";

import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import styles from "@/styles/Dashboard/dashboard.module.css";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <button onClick={handleLogout} className={styles.logoutBtn}>
      <MdLogout className={styles.actionIcon} />
      <span>Logout</span>
    </button>
  );
}
