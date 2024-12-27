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
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useParams, useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/utils/helpers";
import useCoursePurchase from "@/hooks/useCoursePurchase";
import { createCheckout } from "@/features/api/course-purchase/route";

const CourseDetail = () => {
  const { courseId } = useParams();
  const router = useRouter()
  const userId = getUserIdFromToken();
  const { getCourseDetailsWithPurchaseStatusQuery } = useCoursePurchase();

  const {
    data: course,
    isLoading,
    error,
  } = getCourseDetailsWithPurchaseStatusQuery(courseId, userId);

  // If course not found
  if (!course) {
    return <h1>Course not found</h1>;
  }

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
        console.error("Error: No URL returned from the checkout API.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.course.courseTitle}
          </h1>
          <p className="text-base md:text-lg">{course?.course.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.course.creator.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.course.createdAt.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.course.enrolledStudents.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course.course.description }}
          />
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
        <div className="w-full lg:w-1/3">
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
              <h1>{course?.course.lectures[0].lectureTitle}</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">$ {course?.course.coursePrice}</h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {course.purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">
                  Continue Course
                </Button>
              ) : (
                <Button onClick={handleBuyCourse} className="w-full">Buy Course</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
