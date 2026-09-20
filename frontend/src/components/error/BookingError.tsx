import styles from "./BookingError.module.css";

export default function ServerError({
  title = "Something went wrong",
  message = "We couldn't complete your request. Please try again later.",
  homeLabel = "Back home",
  homeHref = "/",
}) {
  return (
    <section className={styles.root}>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
          <path
            d="M12 4v10M12 19v1"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
          />
        </svg>
      </span>

      <div role="alert">
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
      </div>

      <a className={styles.home} href={homeHref}>
        {homeLabel}
      </a>
    </section>
  );
}
