import BookingForm from "../../components/booking-form/BookingForm";
import styles from "./BookingPage.module.css";

export default function BookingPage() {
  return (
    <div className={styles.bg}>
      <BookingForm />
    </div>
  );
}
