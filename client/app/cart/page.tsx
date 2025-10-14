import { getQueryClient } from '@/lib/react-query';
import { dehydrate } from '@tanstack/react-query';
import { Hydrate } from "@/lib/hydrate";
import React from 'react'
import Cart from '@/components/student/Cart';
import ProtectedRoutes from '@/components/ProtectedRoutes';

const Cartpage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <ProtectedRoutes>
      <Hydrate state={dehydratedState}>
        <Cart />
      </Hydrate>
    </ProtectedRoutes>
  )
}

export default Cartpage;