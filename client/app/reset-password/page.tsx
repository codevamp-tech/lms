import { getQueryClient } from '@/lib/react-query';
import { dehydrate } from '@tanstack/react-query';
import { Hydrate } from "@/lib/hydrate";
import React from 'react'
import { Reset } from '@/components/reset-password';


const Resetpage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Reset />
    </Hydrate>
  )
}

export default Resetpage;