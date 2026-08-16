import useSWR from "swr";
import BookingSummary from "../../components/booking-summary/BookingSummary";
import { usePaymentModal } from "../../hooks/usePaymentMethod";
import styles from "./CheckoutPage.module.css";
import { useParams } from "react-router";
import { getBooking } from "../../api/bookings";
import Spinner from "../../components/spinner/Spinner";

export default function CheckoutPage() {
  const params = useParams();
  const bookingId = params.id!;
  const { data, isLoading: loading } = useSWR(
    `/bookings/${bookingId}`,
    getBooking,
  );
  const serviceId = data?.booking.serviceId;
  const email = data?.booking.email;
  const guests = data?.booking.guests;
  
  const { handlePayment, isLoading } = usePaymentModal({
    email,
    serviceId,
    bookingId,
    guests,
  });

  return (
    <>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <Spinner size={50} />
        </div>
      ) : (
        <div className={styles.top}>
          <div className={styles.container}>
            <h2 className={styles.title}>Booking Summary</h2>
            <BookingSummary bookingDetails={data?.booking} />
            <form>
              <button
                type="button"
                disabled={isLoading}
                className={styles.payButton}
                onClick={handlePayment}
              >
                {isLoading ? (
                  <div className={styles.center}>
                    <Spinner size={17} /> <span>Loading</span>
                  </div>
                ) : (
                  "Pay Now"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
