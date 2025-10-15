import React, { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";
import LoadingSpinner from "@/components/LoadingSpinner";

const Resetpage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordClient />
    </Suspense>
  )
}

export default Resetpage;