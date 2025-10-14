"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Star, Zap } from "lucide-react";
import useCourses from "@/hooks/useCourses";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const TopPickCourse = () => {
  const [topPick, setTopPick] = useState<any>(null);
  const { getPublishedCoursesQuery } = useCourses();
  const { data, isLoading } = getPublishedCoursesQuery(1, 10);

  useEffect(() => {
    if (data?.courses?.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.courses.length);
      setTopPick(data.courses[randomIndex]);
    }
  }, [data]);

  if (isLoading || !topPick) {
    return <TopPickSkeleton />;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-12 sm:py-16 lg:py-20 bg-secondary/50 dark:bg-gray-800/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Our Top Pick for You
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Handpicked by our experts to help you achieve your goals.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-6 rounded-2xl border shadow-lg bg-background dark:bg-gray-900/50">
          <div className="w-full lg:w-2/5">
            <img
              src={topPick.courseThumbnail || "/images/default-course.jpg"}
              alt={topPick.courseTitle}
              className="w-full h-auto object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-bold sm:text-3xl">
              {topPick.courseTitle}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {topPick.courseDescription?.substring(0, 150)}...
            </p>

            <div className="flex items-center justify-center lg:justify-start mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.floor(topPick.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {topPick.rating ? `${topPick.rating} / 5` : "No rating"}
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-primary">
              ₹{topPick.courseMRP || "N/A"}
            </p>

            <Link href={`/course/course-detail?courseId=${topPick._id}`}>
              <Button size="lg" className="mt-6 w-full sm:w-auto">
                <Zap className="mr-2 h-5 w-5" />
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const TopPickSkeleton = () => (
  <section className="py-12 sm:py-16 lg:py-20 bg-secondary/50 dark:bg-gray-800/50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 lg:mb-12">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-6 rounded-2xl border shadow-lg bg-background dark:bg-gray-900/50">
        <div className="w-full lg:w-2/5">
          <Skeleton className="w-full h-64 rounded-xl" />
        </div>
        <div className="flex-1 text-center lg:text-left w-full">
          <Skeleton className="h-8 w-3/4 mx-auto lg:mx-0" />
          <Skeleton className="h-5 w-full mt-4 mx-auto lg:mx-0" />
          <Skeleton className="h-5 w-2/3 mt-2 mx-auto lg:mx-0" />
          <div className="flex items-center justify-center lg:justify-start mt-4">
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-10 w-32 mt-4 mx-auto lg:mx-0" />
          <Skeleton className="h-12 w-40 mt-6 mx-auto lg:mx-0" />
        </div>
      </div>
    </div>
  </section>
);

export default TopPickCourse;
