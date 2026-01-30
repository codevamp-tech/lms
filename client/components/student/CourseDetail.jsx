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
  Eye,
  Video,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useParams, useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/utils/helpers";
import { useCourseDetails } from "@/hooks/useCourseDetails";
import { createRazorpayOrder, enrollIdCourse, verifyPayment } from "@/features/api/course-purchase/route";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from '@tanstack/react-query';
import LoginModal from "./loginModal";

const CourseDetail = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const userId = getUserIdFromToken();

  const [pendingPayment, setPendingPayment] = useState(null);
  const [loginPopup, setLoginPopup] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [activePreviewVideo, setActivePreviewVideo] = useState(0);
  const [razorpayPhone, setRazorpayPhone] = useState(null);

  const {
    data: courseData,
    isLoading,
    error
  } = useCourseDetails(courseId, userId || "");

  const queryClient = useQueryClient();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (courseData) {
      const checkCartStatus = async () => {
        if (!userId || !courseId) return;
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}/check/${courseId}`
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

  // Create account using phone number from Razorpay
  const createAccountWithPhone = async (phoneNumber, paymentData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register-with-phone`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phoneNumber,
            name: `User ${phoneNumber.slice(-4)}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      const userData = await response.json();
      console.log("useerData??", userData);
      // Store user data
      localStorage.setItem("userId", userData.userId || userData._id);
      localStorage.setItem("token", userData.token);

      toast.success("Account created automatically!");

      const newUserId = userData.userId || userData.user?._id || userData._id;

      // Now verify payment with the new userId
      await verifyNow({
        ...paymentData,
        userId: newUserId, // ✅ THIS IS THE KEY
      });


      return userData.userId || userData.user._id;
    } catch (err) {
      console.error("Account creation error:", err);
      toast.error("Failed to create account automatically.");
      return null;
    }
  };

  const handleLoginModalClose = async () => {
    setLoginPopup(false);

    // If user closes modal and has pending payment, create account automatically
    if (pendingPayment && razorpayPhone) {
      toast.loading("Creating your account automatically...");
      await createAccountWithPhone(razorpayPhone, pendingPayment);
      setPendingPayment(null);
      setRazorpayPhone(null);
    } else if (pendingPayment && !razorpayPhone) {
      // If somehow we don't have phone, show error
      toast.error("Unable to create account. Please contact support.");
    }
  };


  const handleBuyCourse = async () => {
    try {
      const { order } = await createRazorpayOrder(courseId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Mr English",
        handler: async function (response) {
          const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            courseId,
          };

          if (!userId) {
            try {
              // Fetch payment details to get phone number
              const paymentDetails = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/razorpay/payment-details/${response.razorpay_payment_id}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );

              const details = await paymentDetails.json();
              const phoneNumber = details.contact || details.phone;

              if (phoneNumber) {
                setRazorpayPhone(phoneNumber); // Store phone for later use
                setPendingPayment(paymentData);
                setLoginPopup(true); // Show login popup
                toast.success("Payment successful! Login to unlock the course!");
              } else {
                toast.error("Unable to retrieve phone number from payment");
                setPendingPayment(paymentData);
                setLoginPopup(true);
              }
            } catch (err) {
              console.error("Error fetching payment details:", err);
              toast.error("Payment successful but unable to complete enrollment");
            }
            return;
          }

          // If user is already logged in, verify payment directly
          verifyNow(paymentData);
        },
        modal: {
          ondismiss: function () {
            if (!userId) {
              toast.error("Payment cancelled. Please try again.");
            }
          }
        },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Checkout failed!");
    }
  };


  const verifyNow = async (paymentData) => {
    try {
      const userIdToUse = paymentData.userId || userId;
      console.log("🔍 Starting payment verification...");
      console.log("📦 Payment Data:", paymentData);
      console.log("👤 User ID:", userIdToUse);

      const verify = await verifyPayment({
        ...paymentData,
        userId: userIdToUse,
        courseId,
      });

      if (!verify?.success) {
        toast.error("Payment verification failed!");
        return;
      }

      console.log("📝 Enrolling user...");
      await enrollIdCourse({ courseId, userId: userIdToUse });

      toast.success("Course purchased successfully!");

      queryClient.invalidateQueries({
        queryKey: ["courseDetails", courseId, userIdToUse],
      });

      router.push(`/course/course-progress/${courseId}`);
    } catch (error) {
      console.error("❌ Verification error:", error);
      toast.error("Payment verification failed!");
    }
  };



  // Handle manual login success from LoginModal
  useEffect(() => {
    if (!pendingPayment) return;

    const checkLogin = setInterval(() => {
      const id = getUserIdFromToken();
      if (id) {
        clearInterval(checkLogin);
        // User logged in manually, verify payment
        verifyNow({ ...pendingPayment, userId: id });
        setPendingPayment(null);
        setRazorpayPhone(null);
        setLoginPopup(false);
      }
    }, 500);

    // Cleanup after 30 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkLogin);
    }, 30000);

    return () => {
      clearInterval(checkLogin);
      clearTimeout(timeout);
    };
  }, [pendingPayment]);




  if (isLoading) return <CourseDetailSkeleton />;
  if (error) return <div>Error: {error.message}</div>;
  if (!courseData) return <CourseDetailSkeleton />;

  const course = courseData.course;
  const purchased = courseData.purchased;
  const isExpired = courseData.isExpired;
  const isRevoked = courseData.isRevoked;

  // User has valid access only if purchased AND not expired AND not revoked
  const hasValidAccess = purchased && !isExpired && !isRevoked;

  // Get first two lectures for preview
  const previewLectures = course.lectures.slice(0, 2);

  return (
    <>
      <LoginModal
        isOpen={loginPopup}
        onClose={handleLoginModalClose}
      />
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
                      className={`prose dark:prose-invert max-w-none transition-all duration-300 ${isExpanded ? "max-h-full" : "max-h-48 overflow-hidden"}`}
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
                        {hasValidAccess ? (
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
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Preview Videos Section */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-4 border-b">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <Eye className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Free Preview</h3>
                        <p className="text-xs text-muted-foreground">Watch before you buy</p>
                      </div>
                    </div>

                    {/* Main Video Player */}
                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg mb-3">
                      <ReactPlayer
                        width="100%"
                        height="100%"
                        url={previewLectures[activePreviewVideo]?.videoUrl}
                        controls
                        light={course.courseThumbnail}
                      />
                    </div>

                    {/* Video Selector */}
                    <div className="grid grid-cols-2 gap-2">
                      {previewLectures.map((lecture, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePreviewVideo(idx)}
                          className={`
                            relative group rounded-lg overflow-hidden border-2 transition-all duration-200
                            ${activePreviewVideo === idx
                              ? 'border-primary shadow-md scale-[1.02]'
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                        >
                          <div className="aspect-video bg-secondary/50 flex flex-col items-center justify-center p-2">
                            <Video className={`h-5 w-5 mb-1 ${activePreviewVideo === idx ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className="text-xs font-medium line-clamp-2 text-center">
                              {lecture.lectureTitle || `Lecture ${idx + 1}`}
                            </p>
                          </div>
                          {activePreviewVideo === idx && (
                            <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Course Price</p>
                      <h2 className="text-4xl font-bold text-primary">
                        ₹{course.coursePrice}
                      </h2>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-3 pt-0">
                  {hasValidAccess ? (
                    <Button
                      size="lg"
                      onClick={() => router.push(`/course/course-progress/${courseId}`)}
                      className="w-full"
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Continue Learning
                    </Button>
                  ) : (
                    <>
                      {(isExpired || isRevoked) && purchased && (
                        <p className="text-sm text-destructive text-center mb-2">
                          {isRevoked ? "Your access has been revoked." : "Your course access has expired."}
                        </p>
                      )}
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
    </>
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