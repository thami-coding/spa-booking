import { Link } from "react-router";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const token = sessionStorage.getItem("acccess_token");
  return (
    <section className={styles.hero}>
      {!token && (
        <div className={styles.linkContainer}>
          <Link to="login" className={styles.link}>
            Login
          </Link>
          <Link to="/signup" className={styles.link}>
            Signup
          </Link>
        </div>
      )}
      <video autoPlay muted loop playsInline>
        <source src="/spa-video.mp4" type="video/mp4" />
      </video>
      <div className={styles.heroContent}>
        <h1>Relax, Rejuvenate, and Restore</h1>
        <p>
          Escape the everyday and indulge in a calming spa experience designed
          to refresh your body and mind.
        </p>
        <Link to="/book" className={styles.ctaButton}>
          Book Now
        </Link>
      </div>
    </section>
  );
}
