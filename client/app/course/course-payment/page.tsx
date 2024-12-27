// course/payment-status/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PaymentStatus = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const data = {};

      queryParams.forEach((value, key) => {
        data[key] = value;
      });

      console.log("Payment Response Data:", data);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">
        Payment {router.query.order_status === "SUCCESS" ? "Successful" : "Failed"}
      </h1>
      <p className="mt-2 text-sm">
        {router.query.order_status === "SUCCESS"
          ? "Thank you for your payment!"
          : "Something went wrong, please try again."}
      </p>
    </div>
  );
};

export default PaymentStatus;
