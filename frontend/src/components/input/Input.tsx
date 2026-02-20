import type { Inputs } from "../../types/types";
import styles from "./Input.module.css";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type InputProps = {
  register: UseFormRegister<Inputs>;
  labelText: string;
  defaultValue: string;
  name:
    | "full_name"
    | "email"
    | "phone"
    | "service"
    | "booked_date"
    | "booked_time"
    | "guests"
    | "request";
  value: string;
  errors: FieldErrors<Inputs>;
};
export default function Input({
  labelText,
  value,
  name,
  register,
  errors,
}: InputProps) {
  
  const error = errors[name];
  const validation = name === "phone" ? { minLength: 10, maxLength: 10 } : {};
  const errorType = ["minLength", "maxLength"];

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>{labelText}</label>
      <input
        id={name}
        type={name === "email" ? "email" : "text"}
        className={error && styles.error}
        defaultValue={value}
        {...register(name, { required: true, ...validation })}
      />
      <span className={styles.errorMessage}>
        {errorType.includes(errors.phone?.type ?? "") &&
          name === "phone" &&
          "Invalid phone number"}
        {errors[name]?.type === "required" && `${name} is required`}
      </span>
    </div>
  );
}
