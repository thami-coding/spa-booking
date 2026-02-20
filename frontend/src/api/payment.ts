import { api } from "./api";

export const generatePaymentId = async (url, { arg }) => {
  const { data } = await api.post(url, arg);
  return data;
};
