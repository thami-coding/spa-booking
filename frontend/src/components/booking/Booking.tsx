import styles from "./Booking.module.css";
import { useForm, type SubmitHandler } from "react-hook-form";
import Input from "../input/Input";
import type { FormFieldsData, Inputs } from "../../types/types";

export default function Booking() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const today = new Date().toISOString().split("T")[0]; // "2024-01-15"
  const currentYear = new Date().getFullYear();
  const endOfYear = `${currentYear}-12-31`; 
  // const bookings = {
  //         "2025-01-21": ["10:00", "12:00"],
  //         "2025-01-23": ["09:00", "14:00"]
  //     };

  //     const datePicker = document.getElementById("datePicker");
  //     const timeSelect = document.getElementById("timeSelect");

  //     datePicker.addEventListener("change", () => {
  //         const selectedDate = datePicker.value;
  //         const bookedTimes = bookings[selectedDate] || [];

  //         Array.from(timeSelect.options).forEach(option => {
  //             option.disabled = bookedTimes.includes(option.value);
  //             option.style.color = option.disabled ? "#aaa" : "#000";
  //         });

  //         timeSelect.value = "";
  //     });
  const formFieldsData: FormFieldsData[] = [
    {
      defaultValue: "Jane Doe",
      register: register,
      labelText: "fullName",
      value: "fullName",
    },
    {
      defaultValue: "jane@email.com",
      register: register,
      labelText: "Email Address",
      value: "email",
    },
    {
      defaultValue: "+27 234 567 890",
      register: register,
      labelText: "Phone Number",
      value: "phone",
    },
  ];

  return (
    <div className={styles.bg}>
      <form className={styles.bookingForm} onSubmit={handleSubmit(onSubmit)}>
        <h2>Book Your Spa Experience</h2>
        <p>Complete the form below to reserve your appointment.</p>
        <div className={styles.formGrid}>
          {formFieldsData.map((formFieldData) => {
            const { value } = formFieldData;
            return (
              <Input key={value} {...formFieldData} error={errors[value]} />
            );
          })}
          <div className={`${styles.formGroup}`}>
            <label>Service</label>
            <select
              className={styles.error}
              {...register("service", { required: true })}
            >
              <option value="">Select a service</option>
              <option>Full body Massage</option>
              <option>Deep Tissue Massage</option>
              <option>Back Massage</option>
              <option>Facial Treatment</option>
              <option>Face Massage</option>
              <option>Hot Stone Therapy</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Preferred Date</label>
            <input
              type="date"
              name="date"
              min={today}
              max={endOfYear}
              id="datePicker"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Preferred Time</label>
            <select id="timeSelect" name="time">
              <option value="">Select time</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Guests</label>
            <select name="guests">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
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
          Book Appointment
        </button>
      </form>
    </div>
  );
}
