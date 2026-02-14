import BookingSummary from "../../components/booking-summary/BookingSummary";
import styles from "./CheckoutPage.module.css";

export default function CheckoutPage() {
  return (
    <div className={styles.top}>
      <div className={styles.container}>
        <h2 className={styles.title}>Booking Summary</h2>
        <BookingSummary />
        <button className={styles.payButton} onClick={() => {}}>
         Pay Now
        </button>
      </div>
    </div>
  );
}
