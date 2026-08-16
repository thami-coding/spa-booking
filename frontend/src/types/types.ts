import type { ISOStringFormat } from "date-fns";
import type { UseFormRegister } from "react-hook-form";

export interface FormBookingDetails {
  name: string;
  email: string;
  phone: string;
  service: string;
  userId: string;
  serviceId: string;
  bookedDate: string;
  bookedTime: string;
  guests: number;
  request: string;
}

export interface FormFieldsData {
  defaultValue: string;
  register: UseFormRegister<FormBookingDetails>;
  labelText: string;
  name: FormFields;
  value: string;
}

export type FormFields =
  | "name"
  | "email"
  | "phone"
  | "service"
  | "bookedDate"
  | "bookedTime"
  | "guests"
  | "request";

export interface SignupData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Booking {
  id: string;
  userId: string;
  appointmentAt: string;
  serviceId: string;
  isPaid: boolean;
  amount: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  request: string;
}

export interface BookingResponse {
  booking: Booking;
}

export interface BookingsResponse {
  bookings: Booking[];
  totalPages: number;
  page: number;
  limit: number;
}

export interface BookedDates {
  appointmentAt: ISOStringFormat;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  created_at: string;
}

export interface UserResponse {
  user: User;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface ApiErrorPayload {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}
