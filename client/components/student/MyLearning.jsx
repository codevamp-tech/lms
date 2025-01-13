"use client";
import React, { useEffect } from "react";
import Course from "./Course";
import { useUserProfile } from "@/hooks/useUsers";
import { getUserIdFromToken } from "@/utils/helpers";

const MyLearning = () => {
  const userId = getUserIdFromToken();
  const { data: user, isLoading, error, refetch } = useUserProfile(userId);

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [refetch, user]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user profile</p>;

  return (
    <div className="overflow-y-hidden h-[80vh]">
      {user?.enrolledCourses?.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <span className="justify-end">
            {" "}
            <h1>You haven't enrolled yet</h1>
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m-5">
          {user.enrolledCourses.map((course) => (
            <Course course={course} key={course._id} />
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
