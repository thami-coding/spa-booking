import { useEffect, useState } from "react";
import { useAlert } from "./useAlert";
import useSWRMutation from "swr/mutation";
import { updateBooking } from "../api/bookings";
import { generatePaymentId } from "../api/payment";

type PaymentModalArgs = {
  email: string;
  service_id: string;
  bookingId: string;
};

export const usePaymentModal = ({
  email,
  service_id,
  bookingId,
}: PaymentModalArgs) => {
  const { showSwalSuccess, showSwalError } = useAlert();
  const { trigger } = useSWRMutation("/bookings", updateBooking);
  const payment = useSWRMutation("/payment", generatePaymentId);
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
    const { paymentIdentifier } = await payment.trigger({ email, service_id });
    if (window.payfast_do_onsite_payment) {
      window.payfast_do_onsite_payment(
        { uuid: paymentIdentifier },
        function (result) {
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
