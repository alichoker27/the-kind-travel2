// ============================================
// FILE: components/LoadingSpinner.tsx
// ============================================
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  message: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <div className={styles.spinnerInner}></div>
      </div>
      <p className={styles.loadingText}>{message}</p>
    </div>
  );
}
