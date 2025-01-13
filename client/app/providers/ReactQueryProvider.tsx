'use client';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, QueryClientConfig } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
interface ReactQueryProviderProps {
  children: React.ReactNode;
}
export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () => new QueryClient() // Optionally pass a config object for QueryClient here
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}