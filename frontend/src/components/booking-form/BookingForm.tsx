import type { FormFieldsData, Inputs } from '../../types/types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import styles from "./BookingForm.module.css"
import Input from '../input/Input';

export default function BookingForm() {
 const navigate = useNavigate();
   const {
     register,
     handleSubmit,
     formState: { errors },
   } = useForm<Inputs>();
 
   const today = new Date().toISOString().split("T")[0]; // "2024-01-15"
   const currentYear = new Date().getFullYear();
   const endOfYear = `${currentYear}-12-31`;

   const onSubmit: SubmitHandler<Inputs> = (data) => {
     console.log(data);
     // navigate("");
   };
   
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
       labelText: "full Name",
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
            <option value="">Select a service</option>
            <option>Full body Massage</option>
            <option>Deep Tissue Massage</option>
            <option>Back Massage</option>
            <option>Facial Treatment</option>
            <option>Face Massage</option>
            <option>Hot Stone Therapy</option>
          </select>
          {errors.time && (
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
            {...register("date", { required: true })}
            className={errors["date"] && styles.error}
          />
          {errors.time && (
            <span className={styles.errorMessage}>date is required</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Time</label>
          <select
            id="timeSelect"
            {...register("time", { required: true })}
            className={errors["time"] && styles.error}
          >
            <option value="">Select time</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="13:00">01:00 PM</option>
            <option value="14:00">02:00 PM</option>
          </select>
          {errors.time && (
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
  );
}
