"use client";

import { useCart } from "@/contexts/CartContext";
import { Star, StarHalf } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

// RatingStars component
const RatingStars = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="h-4 w-4 text-yellow-500 fill-current" />
      ))}
      {hasHalfStar && <StarHalf key="half" className="h-4 w-4 text-yellow-500 fill-current" />}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={`empty-${index}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
};

export default function Cart() {
  const [courseRatings, setCourseRatings] = useState({});
  const { cart, removeFromCart } = useCart();
  const totalPrice = cart.reduce((acc, item) => acc + item.course.coursePrice, 0);
  const totalMRP = cart.reduce((acc, item) => acc + (item.course.courseMRP || item.course.coursePrice), 0);
  const totalDiscount = totalMRP - totalPrice;
  const [discountPercentages, setDiscountPercentages] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const newDiscountPercentages: { [key: string]: number } = {};
    cart.forEach((item) => {
      if (item.course.courseMRP && item.course.coursePrice) {
        const discount = ((item.course.courseMRP - item.course.coursePrice) / item.course.courseMRP) * 100;
        newDiscountPercentages[item.course._id] = Math.round(discount);
      }
    });
    setDiscountPercentages(newDiscountPercentages);
  }, [cart]);

  useEffect(() => {
    const fetchRatings = async () => {
      const ratings = {};
      for (const item of cart) {
        try {
          const res = await fetch(`http://localhost:3001/ratings/${item.course._id}`);
          if (res.ok) {
            const data = await res.json();
            ratings[item.course._id] = data;
          }
        } catch (error) {
          console.error(`Error fetching rating for course ${item.course._id}:`, error);
        }
      }
      setCourseRatings(ratings);
    };

    if (cart.length > 0) {
      fetchRatings();
    }
  }, [cart]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="mb-2 text-gray-600">{cart.length} Course(s) in Cart</div>

      {cart.length === 0 ? (
        <p>
          Your cart is empty. <Link href="/" className="text-blue-600 hover:text-blue-800">Go back to courses</Link>
        </p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => {
            const rating = courseRatings[item.course._id];
            return (
              <div key={item.course._id} className="flex gap-4 border rounded-lg p-4 bg-white shadow-sm relative">
                <div className="w-40 h-24 bg-gray-200 rounded-lg overflow-hidden relative">
                  <img src={item.course.courseThumbnail} alt={item.course.courseTitle} className="w-full h-full object-cover" />
                  {discountPercentages[item.course._id] > 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-bl-lg">
                      {discountPercentages[item.course._id]}% OFF
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/course/course-detail/${item.course._id}`}>
                        <h3 className="font-semibold text-lg hover:underline">{item.course.courseTitle}</h3>
                      </Link>
                      <p className="text-sm text-gray-600">By {typeof item.course.creator === "object" ? item.course.creator.name : item.course.creator}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {rating ? (
                          <>
                            <RatingStars rating={rating.average} />
                            <span className="text-sm text-gray-500 ml-2">({rating.count} reviews)</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">No ratings yet</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-col ">
                      <div className="text-lg font-bold">₹{item.course.coursePrice}</div>
                      {item.course.courseMRP > item.course.coursePrice && (
                        <div className="text-sm text-gray-500 line-through">₹{item.course.courseMRP}</div>
                      )}
                      <button onClick={() => { removeFromCart(item.course._id); toast.success("Removed a Course from cart!"); }} className="text-blue-600 pt-2 hover:text-blue-800 text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end items-center  font-semibold">
            <span>Price:</span>
            <span className="line-through text-gray-500 ml-2">₹{totalMRP}</span>
          </div>
          <div className="flex justify-end items-center   text-green-600">
            <span>discount:</span>
            <span className="ml-2">-₹{totalDiscount}</span>
          </div>
          <div className="flex justify-end items-center  ">
            <span>Total Price:</span>
            <span className="ml-2">₹{totalPrice}</span>
          </div>
          <div className="mt-2   flex justify-end">
            <Button className="ml-4" onClick={() => toast.success("Proceeding to checkout!")}>Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}
