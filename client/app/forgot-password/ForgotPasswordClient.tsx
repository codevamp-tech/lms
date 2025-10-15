"use client";

import { getQueryClient } from '@/lib/react-query';
import { dehydrate } from '@tanstack/react-query';
import { Hydrate } from "@/lib/hydrate";

import React from 'react'
import { Forgot } from '@/components/forgot-password';

const ForgotPasswordClient = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Forgot />
    </Hydrate>
  )
}

export default ForgotPasswordClient;
