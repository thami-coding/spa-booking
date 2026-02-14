import Row from "../row/Row";
import styles from "./BookingSummary.module.css";

export default function BookingSummary() {
  const booking = {
    date: "2026-02-12",
    time: "10:00",
    service: "Full body Massage",
    fullName: "Thamsanqa Gumede",
    email: "sainttsquared@gmail.com",
    phone: "0659972023",
    guests: "1",
    request: "",
  };

  const details = Object.keys(booking) as Array<keyof typeof booking>;
  return (
    <>
      {details.map((detail) => {
        const noRequest = detail === "request" && booking[detail] === "";
        if (noRequest) return;
        return <Row detail={booking[detail]} detailName={detail} />;
      })}
      <div className={styles.divider} />
      <Row detail={`R ${Number(350.00).toFixed(2)}`} detailName={"price"} />
    </>
  );
  {
    /* <div className={styles.summaryItem}>
        <span>Full Name</span>
        <strong>{fullName}</strong>
      </div>

      <div className={styles.summaryItem}>
        <span>Email Address</span>
        <strong>{email}</strong>
      </div>

      <div className={styles.summaryItem}>
        <span>Phone Number</span>
        <strong>{phone}</strong>
      </div>

      <div className={styles.summaryItem}>
        <span>Service</span>
        <strong>{service}</strong>
      </div>

      <div className={styles.summaryItem}>
        <span>Preferred Date</span>
        <strong>{preferredDate}</strong>
      </div>

      <div className={styles.summaryItem}>
        <span>Preferred Time</span>
        <strong>{preferredTime}</strong>
      </div>

      <div className={styles.summaryItem}>
        <span>Guests</span>
        <strong>{guests}</strong>
      </div>

      {specialRequests && (
        <div className={styles.notes}>
          <span>Special Requests</span>
          <p>{specialRequests}</p>
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.priceRow}>
        <span>Total Price</span>
        <strong>${price.toFixed(2)}</strong>
      </div>
      */
  }
}
