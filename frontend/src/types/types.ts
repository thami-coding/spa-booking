import type { UseFormRegister } from "react-hook-form";

export type Inputs = {
  full_name: string;
  email: string;
  phone: string;
  service: string;
  booked_date: string;
  booked_time: string;
  guests: number;
  request: string;
};

export type FormFieldsData = {
  defaultValue: string;
  register: UseFormRegister<Inputs>;
  labelText: string;
  name: Fields;
  value: string;
};

export type Fields =
  | "full_name"
  | "email"
  | "phone"
  | "service"
  | "booked_date"
  | "booked_time"
  | "guests"
  | "request";

export type Details = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  booked_date:string;
  booked_time:string;
  guests: number;
  request: string;
  price: number;
};

export type AuthData = {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
};
