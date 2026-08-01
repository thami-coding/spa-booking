import Row from "../row/Row";
import styles from "./BookingSummary.module.css";
import { format, parseISO, parse } from "date-fns";
import { capitalizeFirst } from "../../lib/capitalize";
import type { Booking } from "../../types/types";

interface BookingSummaryProps {
  bookingDetails: Booking | undefined;
}
export default function BookingSummary({ bookingDetails }: BookingSummaryProps) {
  const { appointment_at, id, user_id, is_paid, service_id, ...rest } =
    bookingDetails!;

  const [bookedDate, bookedTime] = appointment_at.split("T");
  const date = format(parseISO(bookedDate), "EEEE, MMMM d, yyyy");
  const dateObj = parse(bookedTime, "HH:mm:ss", new Date());
  const time = format(dateObj, "h:mm a");
  const booking = { date, time, ...rest };
  const details = Object.keys(booking) as Array<keyof typeof booking>;

  return (
    <div className={styles.container}>
      {details.map((detail, index) => {
        const noRequest = detail === "request" && booking[detail] === "";
        const detailName = capitalizeFirst(String(detail));

        if (noRequest) return;

        return (
          <Row key={index} detail={booking[detail]} detailName={detailName} />
        );
      })}

      <div className={styles.divider} />
      <Row detail={`R ${Number(350.0).toFixed(2)}`} detailName={"Total"} />
    </div>
  );
}
