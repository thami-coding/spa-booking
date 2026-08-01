import useSWR from "swr";
import styles from "./dashboard.module.css";
import { useParams } from "react-router";
import Spinner from "../../components/spinner/Spinner";
import { getBooking } from "../../api/bookings";
import { format, parse, parseISO } from "date-fns";

const Dashboard = () => {
  const params = useParams();
  const bookingId = params.id;
  const { isLoading, error, data } = useSWR(
    `/bookings/${bookingId}`,
    getBooking,
  );
  // TODO: fetch services from service id from bookings

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner size={70} />
      </div>
    );
  }

  if (error) return <div>failed to load</div>;
  const { booking } = data;
  const [date, time] = booking.appointment_at.split("T");
  const bookedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");
  const dateObj = parse(time, "HH:mm:ss", new Date());
  const bookedTime = format(dateObj, "h:mm a");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Booking Details</h1>
          <span className={styles.badge}>New Booking</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.item}>
            <span>Date</span>
            <p>{bookedDate}</p>
          </div>

          <div className={styles.item}>
            <span>Time</span>
            <p>{bookedTime}</p>
          </div>

          <div className={styles.item}>
            <span>Service</span>
            <p>{booking.service}</p>
          </div>

          <div className={styles.item}>
            <span>Full Name</span>
            <p>{booking.name || "Not Provided"}</p>
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
