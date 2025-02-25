import { getQueryClient } from '@/lib/react-query';
import { dehydrate } from '@tanstack/react-query';
import { Hydrate } from "@/lib/hydrate";
import React from 'react'
import Cart from '@/components/student/Cart';


const Cartpage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Cart />
    </Hydrate>
  )
}

export default Cartpage;