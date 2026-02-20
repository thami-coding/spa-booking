import useSWR from "swr";
import { useNavigate } from "react-router";
import useSWRMutation from "swr/mutation";

import styles from "./BookingForm.module.css";
import Input from "../input/Input";
import Spinner from "../spinner/Spinner";
import { getUser } from "../../api/user";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { FormFieldsData, Inputs } from "../../types/types";
import { createBooking, getBookedDates, getServices } from "../../api/bookings";
import { format, parse } from "date-fns";
import { useAlert } from "../../hooks/useAlert";
import { useEffect } from "react";

export default function BookingForm() {
  const navigate = useNavigate();
  const { showSwalError } = useAlert();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const services = useSWR("/services", getServices);
  const booked = useSWR("/bookings/dates", getBookedDates);
  const { isLoading, error, data } = useSWR("/users/me", getUser);
  const { trigger, isMutating,error:bookingError } = useSWRMutation("/bookings", createBooking);

  useEffect(() => {
    if (bookingError?.status === "442") {
      showSwalError("Sorry! This time slot is already booked");
      return
    }
    console.log(booked?.error);
    console.log(bookingError?.status);
    
    if(error?.status === 401 || booked.error?.status === 401){
      navigate("/")
    }

  }, [booked.error, bookingError, error, navigate, showSwalError]);

  if (isLoading || booked.isLoading) {
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
  Array.from(booked?.data).forEach((booking) => {
    const [date, time] = booking.appointment_at.split("T");
    if (!bookings[date]) bookings[date] = [];
    const dateObj = parse(time, "HH:mm:ss", new Date());
    const formatTime = format(dateObj, "HH:mm");
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
      labelText: "full Name",
      name: "full_name",
      value: data.full_name,
    },
    {
      defaultValue: "jane@email.com",
      register: register,
      labelText: "Email Address",
      name: "email",
      value: data.email,
    },
    {
      defaultValue: "+27 234 567 890",
      register: register,
      labelText: "Phone Number",
      name: "phone",
      value: data.phone,
    },
  ];
  
  const bookedDate = watch("booked_date");
  const serviceId = watch("service");
  const service = services?.data?.find((service) => service.id === serviceId);

  const onSubmit: SubmitHandler<Inputs> = async (bookingData) => {
    const { id } = data;
    const bookingDetails = {
      ...bookingData,
      user_id: id,
      service_id: service.id,
    };
    const { booking } = await trigger(bookingDetails);
    navigate(`/checkout/${booking.id}`);
  };

  const bookedTimes = bookings[bookedDate] || [];

  return (
    <form className={styles.bookingForm} onSubmit={handleSubmit(onSubmit)}>
      <h2>Book Your Spa Experience</h2>
      <p>Complete the form below to reserve your appointment.</p>

      <div className={styles.formGrid}>
        {formFieldsData.map((formFieldData) => {
          const { value } = formFieldData;
          return <Input key={value} {...formFieldData} errors={errors} />;
        })}

        <div className={`${styles.formGroup}`}>
          <label>Service</label>
          <select
            className={errors["service"] && styles.error}
            {...register("service", { required: true })}
          >
            <option value="" disabled={true}>
              Select a service
            </option>
            {services.data.map((service) => (
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
            {...register("booked_date", { required: true })}
            className={errors["booked_date"] && styles.error}
          />
          {errors.booked_date && (
            <span className={styles.errorMessage}>date is required</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Time</label>
          <select
            id="timeSelect"
            {...register("booked_time", { required: true })}
            className={errors["booked_time"] && styles.error}
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
          {errors.booked_time && (
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
          <input disabled value={`R ${service?.price ?? 0.0}`} />
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
        {isMutating ? <Spinner size={20} /> : " Book Appointment"}
      </button>
    </form>
  );
}
