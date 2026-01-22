// ============================================
// FILE: components/Logo.tsx
// ============================================
import { FaPlane } from "react-icons/fa";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <FaPlane className={styles.mainIcon} />
    </div>
  );
}
