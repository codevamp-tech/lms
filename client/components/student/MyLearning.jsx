"use client";
import React from "react";
import { usePurchasedCourses } from "@/hooks/useCoursePurchase";
import { getUserIdFromToken } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import Course from "./Course";

const MyLearning = () => {
  const userId = getUserIdFromToken();
  const { data: courses, isLoading, error } = usePurchasedCourses(userId);
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user profile</p>;

  const handleCourseClick = (courseId) => {
    router.push(`/course/course-progress/${courseId}`);
  };

  return (
    <div className="overflow-y-hidden h-[80vh]">
      {courses?.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <span className="justify-end">
            {" "}
            <h1>You haven't enrolled yet</h1>
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m-5">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => handleCourseClick(course._id)}
              className="cursor-pointer"
            >
              <Course course={course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
