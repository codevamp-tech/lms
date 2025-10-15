import { getQueryClient } from '@/lib/react-query';
import { dehydrate } from '@tanstack/react-query';
import { Hydrate } from "@/lib/hydrate";

import React, { Suspense } from "react";
import ForgotPasswordClient from "./ForgotPasswordClient";
import LoadingSpinner from "@/components/LoadingSpinner";

const Forgotpage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ForgotPasswordClient />
    </Suspense>
  )
}

export default Forgotpage;