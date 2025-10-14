"use client";
import { Star, StarHalf, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { getUserIdFromToken } from "@/utils/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

interface RatingStarsProps {
  rating: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="h-4 w-4 text-yellow-400 fill-current" />
      ))}
      {hasHalfStar && <StarHalf key="half" className="h-4 w-4 text-yellow-400 fill-current" />}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={`empty-${index}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
      ))}
    </div>
  );
};

interface Course {
  _id: string;
  courseTitle: string;
  courseThumbnail: string;
  coursePrice: number;
  courseMRP?: number;
  creator: { name: string } | string;
}

interface CartItemType {
  courseId: Course;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [courseRatings, setCourseRatings] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);
  const userId = getUserIdFromToken();

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/cart/${userId}/getUserCart`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch (error) {
      toast.error("Failed to load cart.");
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (courseId: string) => {
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

  useEffect(() => {
    if (cart.length === 0) return;
    const fetchRatings = async () => {
      const ratings: { [key: string]: any } = {};
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

  const { totalPrice, totalMRP, totalDiscount } = useMemo(() => {
    const totalPrice = cart.reduce((acc, item) => acc + item.courseId.coursePrice, 0);
    const totalMRP = cart.reduce((acc, item) => acc + (item.courseId.courseMRP || item.courseId.coursePrice), 0);
    const totalDiscount = totalMRP - totalPrice;
    return { totalPrice, totalMRP, totalDiscount };
  }, [cart]);

  if (isLoading) {
    return <CartSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Your Shopping Cart
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          You have {cart.length} course(s) in your cart.
        </p>
      </motion.div>

      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3">
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <CartItem
                    key={item.courseId._id}
                    item={item}
                    rating={courseRatings[item.courseId._id]}
                    onRemove={removeFromCart}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="w-full lg:w-1/3 lg:sticky top-24 self-start">
            <CheckoutSummary
              totalPrice={totalPrice}
              totalMRP={totalMRP}
              totalDiscount={totalDiscount}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface CartItemProps {
  item: CartItemType;
  rating: any;
  onRemove: (courseId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, rating, onRemove }) => {
  const discountPercentage = useMemo(() => {
    if (item.courseId.courseMRP && item.courseId.coursePrice) {
      return Math.round(
        ((item.courseId.courseMRP - item.courseId.coursePrice) / item.courseId.courseMRP) * 100
      );
    }
    return 0;
  }, [item]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
      className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 bg-card dark:bg-gray-800/50 shadow-sm"
    >
      <div className="w-full sm:w-48 h-32 bg-secondary rounded-lg overflow-hidden relative">
        <img
          src={item.courseId.courseThumbnail}
          alt={item.courseId.courseTitle}
          className="w-full h-full object-cover"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/course/course-detail/${item.courseId._id}`}>
              <h3 className="font-semibold text-lg hover:underline">{item.courseId.courseTitle}</h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              {rating ? (
                <>
                  <RatingStars rating={rating.average} />
                  <span className="text-sm text-muted-foreground">({rating.count} reviews)</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">No ratings yet</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">₹{item.courseId.coursePrice}</div>
            {item.courseId.courseMRP > item.courseId.coursePrice && (
              <div className="text-sm text-muted-foreground line-through">₹{item.courseId.courseMRP}</div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="sm" onClick={() => onRemove(item.courseId._id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

interface CheckoutSummaryProps {
  totalPrice: number;
  totalMRP: number;
  totalDiscount: number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ totalPrice, totalMRP, totalDiscount }) => (
  <div className="p-6 bg-card dark:bg-gray-800/50 rounded-lg shadow-sm border">
    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Original Price:</span>
        <span className="line-through text-muted-foreground">₹{totalMRP.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-green-600 dark:text-green-400">
        <span>Discount:</span>
        <span>-₹{totalDiscount.toFixed(2)}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between text-xl font-bold">
        <span>Total:</span>
        <span>₹{totalPrice.toFixed(2)}</span>
      </div>
    </div>
    <Button size="lg" className="w-full mt-6" onClick={() => toast.success("Proceeding to checkout!")}>
      Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  </div>
);

const EmptyCart = () => (
  <div className="text-center py-16">
    <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
    <h2 className="mt-6 text-2xl font-semibold">Your cart is empty</h2>
    <p className="mt-2 text-muted-foreground">
      Looks like you haven't added anything to your cart yet.
    </p>
    <div className="mt-6">
      <Link href="/courses">
        <Button size="lg">
          <ArrowRight className="mr-2 h-5 w-5" />
          Explore Courses
        </Button>
      </Link>
    </div>
  </div>
);

const CartSkeleton = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center mb-12">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
    </div>
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="w-full lg:w-2/3 space-y-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
      <div className="w-full lg:w-1/3">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  </div>
);
