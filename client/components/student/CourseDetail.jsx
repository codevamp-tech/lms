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
import { CalendarDays, Lock, PlayCircle, Users } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useParams, useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/utils/helpers";
import useCoursePurchase from "@/hooks/useCoursePurchase";
import { createCheckout } from "@/features/api/course-purchase/route";
import { toast } from "sonner";

const CourseDetail = () => {
  const descriptionRef = useRef(null);
  const { courseId } = useParams();
  const router = useRouter();
  const userId = getUserIdFromToken();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const { getCourseDetailsWithPurchaseStatusQuery } = useCoursePurchase();

  const {
    data: course,
    isLoading,
    error,
  } = getCourseDetailsWithPurchaseStatusQuery(courseId, userId);
  // If course not found

  useEffect(() => {
    if (descriptionRef.current && course?.course?.description) {
      const actualHeight = descriptionRef.current.scrollHeight;
      const maxHeight = 180; // h-76 equivalent in pixels
      setContentHeight(actualHeight);
      setIsTruncated(actualHeight > maxHeight);
    }
  }, [course]);

  // if (!course) {
  //   return <h1>Course not found</h1>;
  // }

  const handleContinueCourse = () => {
    if (course.purchased) {
      // Navigate to the course progress page
      router.push(`/course/course-progress/${courseId}`);
    }
  };

  const handleBuyCourse = async () => {
    try {
      const data = await createCheckout(courseId, userId);
      if (data?.success && data?.url) {
        // Redirect to the checkout URL
        window.location.href = data.url;
      } else {
        toast.error("Error: No URL returned from the checkout API.");
      }
    } catch (error) {
      toast.error("Error during checkout:", error);
    }
  };

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-5  pb-4 max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10 ">
      <div className=" dark:text-white ">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2 ">
          <Card className="bg-navBackground dark:bg-white p-6 text-gray-300 dark:text-black">
            <h1 className="font-bold text-2xl md:text-3xl text-blue-500 ">
              {course?.course.courseTitle}
            </h1>
            <p className="text-base md:text-lg ">{course?.course.subTitle}</p>
            <p className="py-1">
              Created By{" "}
              <span className="dark:text-blue-400  underline font-extralight  italic">
                {course?.course.creator?.name}
              </span>
            </p>
            <div className="flex gap-6 py-1">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays size={18} />
                <p>Last updated {course?.course.createdAt.split("T")[0]}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={18} />
                <p>
                  {" "}
                  {course?.course.enrolledStudents.length} Students enrolled
                </p>
              </div>
            </div>
          </Card>
          <div className="w-full  space-y-5">
            <Card className="pb-4 px-4 h-auto">
              <h1 className="font-bold text-xl md:text-2xl text-blue-500 pt-6">
                Description
              </h1>
              <div
                ref={descriptionRef}
                className={`text-sm p-2 transition-all duration-300 ${
                  isExpanded
                    ? "h-auto"
                    : `overflow-hidden ${
                        contentHeight > 180
                          ? "h-[180px]"
                          : `h-[${contentHeight}px]`
                      }`
                }`}
                dangerouslySetInnerHTML={{
                  __html: course.course.description || "",
                }}
                style={{
                  lineHeight: "1.5", // Adjust line height for better readability
                }}
              />
              {isTruncated && (
                <button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="text-blue-500 font-medium mt-2"
                >
                  {isExpanded ? "See Less" : "See More"}
                </button>
              )}
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.course.lectures.length} lectures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.course.lectures.map((lecture, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span>
                      {course?.purchased ? (
                        <PlayCircle size={14} />
                      ) : (
                        <Lock size={14} />
                      )}
                    </span>
                    <p>{lecture.lectureTitle}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 pt-3">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="w-full aspect-video mb-4">
              <ReactPlayer
                width="100%"
                height={"100%"}
                url={course?.course.lectures[0].videoUrl}
                controls={true}
              />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-center">
              $ {course?.course.coursePrice}
            </h1>
          </CardContent>
          <CardFooter className="flex justify-center pb-4">
            {course.purchased ? (
              <Button onClick={handleContinueCourse} className="w-full">
                Continue Course
              </Button>
            ) : (
              <Button onClick={handleBuyCourse} className="w-full">
                Buy Course
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetail;
