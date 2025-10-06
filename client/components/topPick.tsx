"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import useCourses from "@/hooks/useCourses";
import { getUserIdFromToken } from "@/utils/helpers";

const TopPickCourse = () => {
  const [topPick, setTopPick] = useState<any>(null);
  const { getPublishedCoursesQuery } = useCourses();
  const userId = getUserIdFromToken();

  // Fetch first page of courses (or you can fetch all)
  const { data, isLoading } = getPublishedCoursesQuery(1);

  useEffect(() => {
    if (data?.courses?.length > 0) {
      // Pick a random course index
      const randomIndex = Math.floor(Math.random() * data.courses.length);
      setTopPick(data.courses[randomIndex]);
    }
  }, [data]);

  if (isLoading || !topPick) {
    return (
      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold mb-6">Our Top Pick for You</h2>
        <p className="text-gray-500">Loading course...</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl font-bold mb-6">Our Top Pick for You</h2>

      <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl border shadow-md bg-white">
        <img
          src={topPick.courseThumbnail || "/images/default-course.jpg"}
          alt={topPick.courseTitle}
          className="w-full md:w-64 h-40 object-cover rounded-lg"
        />

        <div className="flex-1">
          <h3 className="text-xl font-semibold">{topPick.courseTitle}</h3>

          {/* Rating */}
          <div className="flex items-center mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < Math.floor(topPick.rating || 0)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {topPick.rating ? `${topPick.rating} / 5` : "No rating"}
            </span>
          </div>

          {/* Price */}
          <p className="mt-2 text-lg font-medium text-gray-800">
            ₹{topPick.courseMRP || "N/A"}
          </p>

          <Button className="mt-4">Enroll Now</Button>
        </div>
      </div>
    </section>
  );
};

export default TopPickCourse;
