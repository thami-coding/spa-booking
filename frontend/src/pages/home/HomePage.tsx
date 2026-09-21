import { Link } from "react-router";
import styles from "./HomePage.module.css";
import useSWRMutation from "swr/mutation";
import { logout } from "../../api/auth";
import { useUser } from "../../hooks/authHooks";
import { mutate } from "swr";

type UserRole = "user" | "admin";

export default function HomePage() {
  const { isLoading, data } = useUser();
  const { trigger: logoutUser } = useSWRMutation("/auth/logout", logout);
  const handleLogout = async () => {
    await logoutUser();
    mutate("/users/me", null, { revalidate: false });
  };

  if (isLoading) return null;

  const userRole: UserRole = data?.user.role;


  return (
    <section className={styles.hero}>
      <div className={styles.linkContainer}>
        {!data?.user ? (
          <>
            <Link to="login" className={styles.link}>
              Login
            </Link>
            <Link to="/signup" className={styles.link}>
              Signup
            </Link>
          </>
        ) : (
          <>
            {userRole === "admin" && (
              <Link to="/bookings" className={styles.link}>
                Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className={styles.link}>
              Logout
            </button>
          </>
        )}
      </div>
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
