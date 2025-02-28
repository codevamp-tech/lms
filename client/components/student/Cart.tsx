"use client";

import { Star, StarHalf } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { getUserIdFromToken } from "@/utils/helpers";

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
        <Star key={`empty-${index}`} className="h-4 w-4 text-gray-500" />
      ))}
    </div>
  );
};

export default function Cart() {
  interface Course {
    _id: string;
    courseTitle: string;
    courseThumbnail: string;
    coursePrice: number;
    courseMRP?: number;
    creator: { name: string } | string;
  }

  interface CartItem {
    courseId: any;
    course: Course;
  }

  const [cart, setCart] = useState<CartItem[]>([]);
  const [courseRatings, setCourseRatings] = useState({});
  const [discountPercentages, setDiscountPercentages] = useState<{ [key: string]: number }>({});
  const userId = getUserIdFromToken();

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:3001/cart/${userId}/getUserCart`);
      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();


      setCart(data);
    } catch (error) {
      toast.error("Failed to load cart.");
      setCart([]);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:3001/cart/${courseId}/remove-from-cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Failed to remove course");

      setCart(cart.filter((item) => item.courseId._id !== courseId));
      toast.success("Removed a Course from cart!");
    } catch (error) {
      toast.error("Failed to remove course.");
    }
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  // Calculate discount percentages
  useEffect(() => {
    if (cart.length === 0) return;
    const newDiscountPercentages = {};
    cart.forEach((item) => {
      if (item.courseId.courseMRP && item.courseId.coursePrice) {
        const discount = ((item.courseId.courseMRP - item.courseId.coursePrice) / item.courseId.courseMRP) * 100;
        newDiscountPercentages[item.courseId._id] = Math.round(discount);
      }
    });
    setDiscountPercentages(newDiscountPercentages);
  }, [cart]);

  // Fetch course ratings
  useEffect(() => {
    if (cart.length === 0) return;

    const fetchRatings = async () => {
      const ratings = {};
      for (const item of cart) {
        try {
          const res = await fetch(`http://localhost:3001/ratings/${item.courseId._id}`);
          if (res.ok) {
            const data = await res.json();
            ratings[item.courseId._id] = data;
          }
        } catch (error) {
          console.error(`Error fetching rating for course ${item.courseId._id}:`, error);
        }
      }
      setCourseRatings(ratings);
    };

    fetchRatings();
  }, [cart]);

  // Calculate totals
  const totalPrice = cart.reduce((acc, item) => acc + item.courseId.coursePrice, 0);
  const totalMRP = cart.reduce((acc, item) => acc + (item.courseId.courseMRP || item.courseId.coursePrice), 0);
  const totalDiscount = totalMRP - totalPrice;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="mb-2 text-gray-600">{cart.length} Course(s) in Cart</div>

      {cart.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Go back to courses
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => {
            const rating = courseRatings[item.courseId._id];
            return (
              <div key={item.courseId._id} className="flex gap-4 border rounded-lg p-4 bg-white dark:bg-navBackground shadow-sm relative">
                <div className="w-40 h-24 bg-gray-200 rounded-lg overflow-hidden relative">
                  <img src={item.courseId.courseThumbnail} alt={item.courseId.courseTitle} className="w-full h-full object-cover" />
                  {discountPercentages[item.courseId._id] > 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-tr-lg rounded-bl-lg">
                      {discountPercentages[item.courseId._id]}% OFF
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/course/course-detail/${item.courseId._id}`}>
                        <h3 className="font-semibold text-lg hover:underline">{item.courseId.courseTitle}</h3>
                      </Link>
                      {/* <p className="text-sm text-gray-600">
                        By {typeof item.courseId.creator === "object" ? item.courseId.creator.name : item.course.creator}
                      </p> */}
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
                    <div className="flex-col">
                      <div className="text-lg font-bold">₹{item.courseId.coursePrice}</div>
                      {item.courseId.courseMRP > item.courseId.coursePrice && (
                        <div className="text-sm text-gray-500 line-through">₹{item.courseId.courseMRP}</div>
                      )}
                      <button
                        onClick={() => removeFromCart(item.courseId._id)}
                        className="text-red-600 pt-2 hover:text-blue-800 text-sm"
                      >
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
          <div className="flex justify-end items-center font-semibold">
            <span>Price:</span>
            <span className="line-through text-gray-500 ml-2">₹{totalMRP}</span>
          </div>
          <div className="flex justify-end items-center text-green-600">
            <span>Discount:</span>
            <span className="ml-2">-₹{totalDiscount}</span>
          </div>
          <div className="flex justify-end items-center">
            <span>Total Price:</span>
            <span className="ml-2">₹{totalPrice}</span>
          </div>
          <div className="mt-2 flex justify-end">
            <Button className="ml-4" onClick={() => toast.success("Proceeding to checkout!")}>
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
