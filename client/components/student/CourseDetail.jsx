// course/course-detail/[courseId]/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarDays,
  Lock,
  PlayCircle,
  Users,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useParams, useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/utils/helpers";
import useCoursePurchase from "@/hooks/useCoursePurchase";
import { createCheckout } from "@/features/api/course-purchase/route";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const CourseDetail = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const userId = getUserIdFromToken();
  const [isExpanded, setIsExpanded] = useState(false);
  const { getCourseDetailsWithPurchaseStatusQuery } = useCoursePurchase();
  const [isInCart, setIsInCart] = useState(false);

  const {
    data: courseData,
    isLoading,
    error,
  } = getCourseDetailsWithPurchaseStatusQuery(courseId, userId);

  useEffect(() => {
    if (courseData) {
      const checkCartStatus = async () => {
        if (!userId || !courseId) return;
        try {
          const response = await fetch(
            `https://lms-v4tz.onrender.com/cart/${userId}/check/${courseId}`
          );
          const data = await response.json();
          if (response.ok) {
            setIsInCart(data.isCart);
          }
        } catch (error) {
          console.error("Error checking cart status:", error);
        }
      };
      checkCartStatus();
    }
  }, [courseId, userId, courseData]);

  const handleAddToCart = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (isInCart) {
      router.push("/cart");
      return;
    }
    try {
      const response = await fetch(
        `https://lms-v4tz.onrender.com/cart/${courseId}/add-to-cart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Course added to cart!");
        setIsInCart(true);
      } else {
        toast.error(data.message || "Failed to add to cart.");
      }
    } catch (error) {
      toast.error("Error adding course to cart.");
    }
  };

  const handleBuyCourse = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    try {
      const data = await createCheckout(courseId, userId);
      if (data?.success && data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Error: No URL returned from the checkout API.");
      }
    } catch (error) {
      toast.error("Error during checkout:", error);
    }
  };

  if (isLoading) return <CourseDetailSkeleton />;
  if (error) return <div>Error: {error.message}</div>;
  if (!courseData) return <CourseDetailSkeleton />;

  const course = courseData.course;
  const purchased = courseData.purchased;

  return (
    <div className="bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-card dark:bg-gray-800/50 p-6 mb-8">
                <h1 className="font-bold text-3xl md:text-4xl text-primary">
                  {course.courseTitle}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-2">
                  {course.subTitle}
                </p>
                <p className="py-2 text-sm">
                  Created By{" "}
                  <span className="text-primary/80 underline italic">
                    {course.creator?.name}
                  </span>
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 py-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    <span>
                      Last updated{" "}
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{course.enrolledStudents.length} Students enrolled</span>
                  </div>
                </div>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`prose dark:prose-invert max-w-none transition-all duration-300 ${
                      isExpanded ? "max-h-full" : "max-h-48 overflow-hidden"
                    }`}
                    dangerouslySetInnerHTML={{ __html: course.description || "" }}
                  />
                  <Button
                    variant="link"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-0 mt-2"
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                    {isExpanded ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    {course.lectures.length} lectures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.lectures.map((lecture, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm p-2 rounded-md bg-secondary/50"
                    >
                      {purchased ? (
                        <PlayCircle size={16} className="text-primary" />
                      ) : (
                        <Lock size={16} className="text-muted-foreground" />
                      )}
                      <p>{lecture.lectureTitle}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/3 lg:sticky top-24 self-start">
            <Card>
              <CardContent className="p-4">
                <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden">
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={course.lectures[0]?.videoUrl}
                    controls
                    light={course.courseThumbnail}
                  />
                </div>
                <h2 className="text-3xl font-bold text-center mb-4">
                  ₹{course.coursePrice}
                </h2>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                {purchased ? (
                  <Button
                    size="lg"
                    onClick={() =>
                      router.push(`/course/course-progress/${courseId}`)
                    }
                    className="w-full"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Continue Learning
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      className="w-full"
                    >
                      {isInCart ? (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Go to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleBuyCourse}
                      className="w-full"
                    >
                      Buy Now
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseDetailSkeleton = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="w-full lg:w-2/3">
        <Card className="p-6 mb-8">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-5 w-1/3 mb-4" />
          <div className="flex gap-6">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </Card>
        <Card className="p-6 mb-8">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-24 w-full" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </Card>
      </div>
      <div className="w-full lg:w-1/3">
        <Card>
          <CardContent className="p-4">
            <Skeleton className="w-full aspect-video mb-4" />
            <Skeleton className="h-10 w-1/2 mx-auto" />
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
);

export default CourseDetail;
