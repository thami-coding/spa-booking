import { Link, useSearchParams } from "react-router";
import { format, parseISO, parse, isToday } from "date-fns";
import styles from "./AdminDashboard.module.css";
import Pagination from "../../components/pagination/Pagination";
import Spinner from "../../components/spinner/Spinner";
import { useState } from "react";
import { useAllBookings } from "../../hooks/bookingHooks";

const AdminDashboard = () => {
  const [pageIndex, setPageIndex] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });
  const { isLoading, error, data } = useAllBookings(pageIndex);

  if (isLoading)
    return (
      <div className={styles.spinnerContainer}>
        <Spinner size={70} />
      </div>
    );

  if (error) return <div>failed to load</div>;

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.card}>
          <h1 className={styles.title}>Bookings</h1>
          <div className={styles.headerRow}>
            <span>Name</span>
            <span>Phone</span>
            <span>Date</span>
            <span>Time</span>
          </div>

          {data?.bookings.map((booking) => {
            const [date, time] = booking.appointmentAt.split("T");
            const bookedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");
            const dateObj = parse(time, "HH:mm:ss", new Date());
            const bookedTime = format(dateObj, "h:mm a");
            const isTodayDate = isToday(bookedDate);

            return (
              <Link
                to={`/bookings/${booking._id}`}
                key={booking._id}
                className={`${styles.row} ${isTodayDate && styles.active}`}
              >
                <span>{booking.name}</span>
                <span>{booking.phone}</span>
                <span>{bookedDate}</span>
                <span>{bookedTime}</span>
              </Link>
            );
          })}
        </div>

        <Pagination
          page={pageIndex}
          totalPages={data?.totalPages}
          setPageIndex={setPageIndex}
          setSearchParams={setSearchParams}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
