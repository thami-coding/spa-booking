import type { Inputs } from "../../types/types";
import styles from "./Input.module.css";
import { type FieldError, type UseFormRegister } from "react-hook-form";

type InputProps = {
  register: UseFormRegister<Inputs>;
  labelText: string;
  defaultValue: string;
  value:
    | "fullName"
    | "email"
    | "phone"
    | "service"
    | "date"
    | "time"
    | "guests"
    | "requests";
  error: FieldError | undefined
};
export default function Input({
  defaultValue,
  labelText,
  value,
  register,
  error
}: InputProps) {

  return (
    <div className={styles.formGroup}>
      <label>{labelText}</label>
      <input
      className={error && styles.error}
        placeholder={defaultValue}
        {...register(value, { required: true })}
      />
    </div>
  );
}
