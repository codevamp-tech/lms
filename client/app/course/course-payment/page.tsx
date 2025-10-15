// course/payment-status/page.tsx
"use client";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import PaymentStatusClient from "./PaymentStatusClient";
import LoadingSpinner from "@/components/LoadingSpinner";

const PaymentStatus = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentStatusClient />
    </Suspense>
  );
};

export default PaymentStatus;
