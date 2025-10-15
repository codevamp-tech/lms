"use client";
import { useSearchParams } from "next/navigation";

const PaymentStatusClient = () => {
  const searchParams = useSearchParams();
  const orderStatus = searchParams.get("order_status");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">
        Payment {orderStatus === "SUCCESS" ? "Successful" : "Failed"}
      </h1>
      <p className="mt-2 text-sm">
        {orderStatus === "SUCCESS"
          ? "Thank you for your payment!"
          : "Something went wrong, please try again."}
      </p>
    </div>
  );
};

export default PaymentStatusClient;
