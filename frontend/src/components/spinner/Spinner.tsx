import styles from "./Spinner.module.css";

export default function Spinner({ size = 28, label = "Loading..." }) {
  return (
    <div
      className={styles.wrap}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span
        className={styles.spinner}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    </div>
  );
}
