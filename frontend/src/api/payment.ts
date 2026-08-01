import { api } from "./api";

interface PaymentPayload {
  email: string;
  service_id: string;
}
export const generatePaymentId = async (
  url: string,
  { arg }: { arg: PaymentPayload },
) => {
  const { data } = await api.post(url, arg);
  return data;
};
