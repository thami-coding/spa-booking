import type { BookedDates, BookingResponse, BookingsResponse, FormBookingDetails, Service } from "../types/types";
import { api } from "./api";

export const createBooking = async (
  url: string,
  { arg }: { arg: FormBookingDetails },
): Promise<BookingResponse> => {
  const res = await api.post(url, arg);
  return res.data;
};

export const getBooking = async (url: string) => {
  const { data } = await api.get(url);
  return data;
};

export const getAllBookings = async (url: string):Promise<BookingsResponse> => {
  const res = await api.get(url);
  return res.data;
};

export const getUserBooking = async (url: string) => {
  const res = await api.get(url);
  return res.data;
};

export const getServices = async (url: string):Promise<Service[]> => {
  const { data } = await api.get(url);
  return data.services;
};

export const getBookedDates = async (url: string):Promise<BookedDates[]> => {
  const { data } = await api.get(url);
  return data;
};

export const updateBooking = async (url: string, { arg }: { arg: string }) => {
  const { data } = await api.post(url, arg);
  return data;
};
