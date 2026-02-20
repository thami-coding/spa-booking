import type { Inputs } from "../types/types";
import { api } from "./api";

export const createBooking = async (url, { arg }: { arg: Inputs }) => {
  const res = await api.post(url, arg);
  return res.data;
};

export const getBooking = async (...args) => {
  const {data} = await api.get(...args);

  return data
};

export const getAllBookings = async (...args) => {
  const res = await api.get(...args);
  return res.data;
};

export const getUserBooking = async (...args) => {
  const res = await api.get(...args);
  return res.data;
};

export const getServices = async (...args) => {
  const { data } = await api.get(...args);
  return data.services;
};

export const getBookedDates = async (...args) => {
  const { data } = await api.get(...args);
  return data;
};

export const updateBooking = async (url, { arg }: { arg: string }) => {
  const { data } = await api.post(url, arg);
  return data;
};
