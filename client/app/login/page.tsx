import { getQueryClient } from '@/lib/react-query';
import { dehydrate } from '@tanstack/react-query';
import { Hydrate } from "@/lib/hydrate";
import Login from '@/components/Login'
import React from 'react'

const LoginPage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Login />
    </Hydrate>
    )
}

export default LoginPage