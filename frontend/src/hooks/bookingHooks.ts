import useSWRMutation from "swr/mutation";
import { createBooking, getAllBookings, getBookedDates } from "../api/bookings";
import useSWR from "swr";

export const useBookedDates = () => {
  const { isLoading, data, error } = useSWR("/bookings/dates", getBookedDates);
  return { isLoading, data, error };
};

export const useCreateBooking = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    "/bookings",
    createBooking,
  );

  return {
    trigger,
    isMutating,
    error,
  };
};

export const useAllBookings = (pageIndex: number) => {
  const { data, error, isLoading } = useSWR(
    `/bookings?page=${pageIndex}`,
    getAllBookings,
  );

  return {
    data,
    error,
    isLoading,
  };
};
