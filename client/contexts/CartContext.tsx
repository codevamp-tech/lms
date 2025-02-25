"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define Course Type
interface Course {
  course: any;
  coursePrice: string;
  courseTitle: string;
  id: number;


}

// Define Cart Context Type
interface CartContextType {
  cart: Course[];
  addToCart: (course: Course) => void;
  removeFromCart: (id: number) => void;
}

// Create Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Course[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  const addToCart = (course: Course) => {
    setCart((prevCart) => {
      return [...prevCart, course];
    });
  };


  const removeFromCart = (courseId: any) => {
    setCart((prevCart) => {
      return prevCart.filter(item => item.course._id !== courseId);
    });
  };
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook for Using Cart Context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};



