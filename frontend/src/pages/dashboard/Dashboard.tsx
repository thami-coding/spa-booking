import styles from "./dashboard.module.css";

const booking = {
  date: "2026-02-12",
  time: "10:00",
  service: "Full body Massage",
  fullName: "Thamsanqa Gumede",
  email: "sainttsquared@gmail.com",
  phone: "0659972023",
  guests: "1",
  request: "Prefers aromatherapy oils",
};

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Admin Dashboard</h1>
          <span className={styles.badge}>New Booking</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.item}>
            <span>Date</span>
            <p>{booking.date}</p>
          </div>

          <div className={styles.item}>
            <span>Time</span>
            <p>{booking.time}</p>
          </div>

          <div className={styles.item}>
            <span>Service</span>
            <p>{booking.service}</p>
          </div>

          <div className={styles.item}>
            <span>Full Name</span>
            <p>{booking.fullName || "Not Provided"}</p>
          </div>

          <div className={styles.item}>
            <span>Email</span>
            <p>{booking.email || "Not Provided"}</p>
          </div>

          <div className={styles.item}>
            <span>Phone</span>
            <p>{booking.phone || "Not Provided"}</p>
          </div>

          <div className={styles.item}>
            <span>Guests</span>
            <p>{booking.guests}</p>
          </div>

          <div className={`${styles.item} ${styles.fullWidth}`}>
            <span>Special Request</span>
            <p>{booking.request || "No special requests"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
