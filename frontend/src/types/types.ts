import type { UseFormRegister } from "react-hook-form";

export type Inputs = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  guests: number;
  request: string;
};

export type FormFieldsData = {
  defaultValue: string;
  register: UseFormRegister<Inputs>;
  labelText: string;
  value: Fields;
};

export type Fields =
  | "fullName"
  | "email"
  | "phone"
  | "service"
  | "date"
  | "time"
  | "guests"
  | "request";

export type Details = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  guests: number;
  request: string;
  price: number;
};
