import { api } from "./api";

interface PaymentPayload {
  email: string;
  serviceId: string;
  bookingId: string;
  guests: number;
}
export const generatePaymentId = async (
  url: string,
  { arg }: { arg: PaymentPayload },
) => {
  const { data } = await api.post(url, arg);
  return data;
};
