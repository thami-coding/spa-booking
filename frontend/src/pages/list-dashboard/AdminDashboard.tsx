import useSWR from "swr";
import { Link, useSearchParams } from "react-router";
import { format, parseISO, parse, isToday } from "date-fns";
import { getAllBookings } from "../../api/bookings";
import styles from "./AdminDashboard.module.css";
import Pagination from "../../components/pagination/Pagination";
import Spinner from "../../components/spinner/Spinner";
import { useState } from "react";

const AdminDashboard = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });
  const { data, error, isLoading } = useSWR(
    `/bookings?page=${pageIndex}`,
    getAllBookings,
  );

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

          {data.bookings.map((booking) => {
            const [date, time] = booking.appointment_at.split("T");
            const bookedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");
            const dateObj = parse(time, "HH:mm:ss", new Date());
            const bookedTime = format(dateObj, "h:mm a");
            const isTodayDate = isToday(bookedDate);

            return (
              <Link
                to={`/bookings/${booking.id}`}
                key={booking.id}
                className={`${styles.row} ${isTodayDate && styles.active}`}
              >
                <span>{booking.full_name}</span>
                <span>{booking.phone}</span>
                <span>{bookedDate}</span>
                <span>{bookedTime}</span>
              </Link>
            );
          })}
        </div>

        <Pagination
          page={pageIndex}
          totalPages={data.totalPages}
          setPageIndex={setPageIndex}
          setSearchParams={setSearchParams}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
