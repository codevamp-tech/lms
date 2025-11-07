"use client";

import React, { createContext, useContext, useState } from 'react';
import Script from 'next/script';

interface RazorpayContextType {
  isLoaded: boolean;
}

const RazorpayContext = createContext<RazorpayContextType>({
  isLoaded: false,
});

export const useRazorpay = () => {
  return useContext(RazorpayContext);
};

export const RazorpayProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <RazorpayContext.Provider value={{ isLoaded }}>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          setIsLoaded(true);
        }}
      />
      {children}
    </RazorpayContext.Provider>
  );
};
