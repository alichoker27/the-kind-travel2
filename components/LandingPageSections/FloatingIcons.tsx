// ============================================
// FILE: components/FloatingIcons.tsx
// ============================================
import {
  FaPlane,
  FaSuitcaseRolling,
  FaMapMarkedAlt,
  FaCompass,
  FaGlobeAmericas,
} from "react-icons/fa";
import { IoAirplane } from "react-icons/io5";
import { MdLuggage } from "react-icons/md";
import { GiCommercialAirplane, GiJourney } from "react-icons/gi";
import styles from "./FloatingIcons.module.css";

export default function FloatingIcons() {
  return (
    <div className={styles.floatingIcons}>
      <FaPlane className={`${styles.icon} ${styles.icon1}`} />
      <IoAirplane className={`${styles.icon} ${styles.icon2}`} />
      <FaSuitcaseRolling className={`${styles.icon} ${styles.icon3}`} />
      <MdLuggage className={`${styles.icon} ${styles.icon4}`} />
      <FaMapMarkedAlt className={`${styles.icon} ${styles.icon5}`} />
      <FaCompass className={`${styles.icon} ${styles.icon6}`} />
      <FaGlobeAmericas className={`${styles.icon} ${styles.icon7}`} />
      <GiCommercialAirplane className={`${styles.icon} ${styles.icon8}`} />
      <GiJourney className={`${styles.icon} ${styles.icon9}`} />
    </div>
  );
}
