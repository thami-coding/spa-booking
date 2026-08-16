import { useEffect, useState } from "react";
import { useAlert } from "./useAlert";
import useSWRMutation from "swr/mutation";
import { updateBooking } from "../api/bookings";
import { generatePaymentId } from "../api/payment";

type PaymentModalArgs = {
  email: string;
  serviceId: string;
  bookingId: string;
  guests: number;
};

export const usePaymentModal = ({
  email,
  serviceId,
  bookingId,
  guests,
}: PaymentModalArgs) => {
  console.log(serviceId);

  const { showSwalSuccess, showSwalError } = useAlert();
  const { trigger } = useSWRMutation("/bookings", updateBooking);
  const pay = useSWRMutation("/payment", generatePaymentId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sandbox.payfast.co.za/onsite/engine.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    const { paymentIdentifier } = await pay.trigger({
      email,
      serviceId,
      bookingId,
      guests,
    });
    // TODO: fix below typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).payfast_do_onsite_payment) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).payfast_do_onsite_payment(
        { uuid: paymentIdentifier },
        function (result: boolean) {
          if (result === true) {
            trigger(bookingId);
            showSwalSuccess("Appointment Booked");
          } else {
            showSwalError("Booking Failed");
          }
        },
      );
      setIsLoading(false);
    } else {
      alert("PayFast script not loaded yet!");
    }
  };
  return { handlePayment, isLoading };
};
