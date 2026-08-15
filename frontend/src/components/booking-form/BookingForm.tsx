import useSWR from "swr";
import { useNavigate } from "react-router";
import styles from "./BookingForm.module.css";
import Input from "../input/Input";
import Spinner from "../spinner/Spinner";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { FormBookingDetails, FormFieldsData } from "../../types/types";
import { getServices } from "../../api/bookings";
import { format, parse } from "date-fns";
import { useAlert } from "../../hooks/useAlert";
import { useEffect } from "react";
import { useUser } from "../../hooks/authHooks";
import { useBookedDates, useCreateBooking } from "../../hooks/bookingHooks";

export default function BookingForm() {
  const navigate = useNavigate();
  const { showSwalError } = useAlert();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormBookingDetails>();
  const {
    trigger: bookSlot,
    isMutating: isBooking,
    error: bookingError,
  } = useCreateBooking();
  const bookedDates = useBookedDates();
  const { isLoading: isLoadingUser, data: userInfo } = useUser();
  const services = useSWR("/services", getServices);

  useEffect(() => {
    if (bookingError?.status === "409") {
      showSwalError("Sorry! This time slot is already booked");
    }
  }, [bookingError, showSwalError]);

  if (isLoadingUser || bookedDates.isLoading) {
    return (
      <div className={styles.SpinnerContainer}>
        <Spinner />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear();
  const endOfYear = `${currentYear}-12-31`;

  const bookings: Record<string, string[]> = {};
  Array.from(bookedDates?.data || []).forEach((bookedDate) => {
    const [date, time] = bookedDate.appointment_at.split("T");
    const dateObj = parse(time, "HH:mm:ss", new Date());
    const formatTime = format(dateObj, "HH:mm");

    if (!bookings[date]) bookings[date] = [];
    bookings[date].push(formatTime);
  });

  const bookingTimes = [
    { text: "09:00 AM", value: "09:00" },
    { text: "10:00 AM", value: "10:00" },
    { text: "11:00 AM", value: "11:00" },
    { text: "12:00 PM", value: "12:00" },
    { text: "13:00 PM", value: "13:00" },
    { text: "14:00 PM", value: "14:00" },
  ];

  const formFieldsData: FormFieldsData[] = [
    {
      defaultValue: "Jane Doe",
      register: register,
      labelText: "name",
      name: "name",
      value: userInfo.name,
    },
    {
      defaultValue: "jane@email.com",
      register: register,
      labelText: "Email Address",
      name: "email",
      value: userInfo.email,
    },
    {
      defaultValue: "+27 234 567 890",
      register: register,
      labelText: "Phone Number",
      name: "phone",
      value: userInfo.phone,
    },
  ];

  const bookedDate = watch("bookedDate");
  const serviceId = watch("service");
  const guestNumber = watch("guests");
  const service = services.data?.find((service) => service.id === serviceId);
  const totalCost = (service?.price ?? 0) * guestNumber;

  const onSubmit: SubmitHandler<FormBookingDetails> = async (bookingData) => {
    const { id } = userInfo;
    const bookingDetails = {
      ...bookingData,
      userId: id,
      serviceId: service!.id,
    };
    const { booking } = await bookSlot(bookingDetails);
    navigate(`/checkout/${booking.id}`);
  };

  const bookedTimes = bookings[bookedDate] || [];

  return (
    <form className={styles.bookingForm} onSubmit={handleSubmit(onSubmit)}>
      <h2>Book Your Spa Experience</h2>
      <p>Complete the form below to reserve your appointment.</p>

      <div className={styles.formGrid}>
        {formFieldsData.map((formFieldData) => {
          const { name } = formFieldData;
          return <Input key={name} {...formFieldData} errors={errors} />;
        })}

        <div className={`${styles.formGroup}`}>
          <label>Service</label>
          <select
            defaultValue=""
            className={errors["service"] && styles.error}
            {...register("service", { required: true })}
          >
            <option value="" disabled={true}>
              Select a service
            </option>
            {services.data?.map((service) => (
              <option value={service.id} key={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          {errors.service && (
            <span className={styles.errorMessage}>service is required</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Date</label>
          <input
            type="date"
            min={today}
            max={endOfYear}
            id="datePicker"
            {...register("bookedDate", { required: true })}
            className={errors["bookedDate"] && styles.error}
          />
          {errors.bookedDate && (
            <span className={styles.errorMessage}>date is required</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Time</label>
          <select
            id="timeSelect"
            {...register("bookedTime", { required: true })}
            className={errors["bookedTime"] && styles.error}
            disabled={!bookedDate}
          >
            <option value="">Select time</option>
            {bookingTimes.map(({ text, value }) => {
              const disabled = bookedTimes.includes(value);
              return (
                <option disabled={disabled} key={text} value={value}>
                  {text}
                </option>
              );
            })}
          </select>
          {errors.bookedTime && (
            <span className={styles.errorMessage}>time is required</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Guests</label>
          <select {...register("guests", { required: true })}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Price</label>

          <input disabled value={totalCost} />
        </div>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label>Special Requests</label>
          <textarea
            name="requests"
            placeholder="Any preferences or notes..."
          ></textarea>
        </div>
      </div>

      <button className={styles.submitBtn} type="submit">
        {isBooking ? <Spinner size={20} /> : " Book Appointment"}
      </button>
    </form>
  );
}
