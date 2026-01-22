// ============================================
// FILE: components/Title.tsx
// ============================================
import styles from "./Title.module.css";

interface TitleProps {
  main: string;
  subtitle: string;
}

export default function Title({ main, subtitle }: TitleProps) {
  return (
    <>
      <h1 className={styles.title}>{main}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </>
  );
}
