"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Course from "./Course";
import useCourses from "@/hooks/useCourses";
import { getUserIdFromToken } from "@/utils/helpers";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const observerRef = useRef(null);
  const bottomRef = useRef(null);

  const { getPublishedCoursesQuery } = useCourses();
  const userId = getUserIdFromToken();
  const { data, isLoading, isFetching } = getPublishedCoursesQuery(currentPage, 12);

  useEffect(() => {
    if (data?.courses) {
      setCourses((prev) =>
        currentPage === 1 ? data.courses : [...prev, ...data.courses]
      );
    }
  }, [data]);

  const courseCategories = useMemo(() => {
    const categories = new Set(courses.map((course) => course.category));
    return ["All", ...Array.from(categories)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "All" || !selectedCategory) {
      return courses;
    }
    return courses.filter((course) => course.category === selectedCategory);
  }, [courses, selectedCategory]);

  useEffect(() => {
    if (isFetching) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < (data?.totalPages || 1)) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [isFetching, currentPage, data?.totalPages]);

  useEffect(() => {
    setCourses([]);
    setCurrentPage(1);
  }, [selectedCategory]);

  return (
    <div className="bg-background dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Explore Our Courses
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find the perfect course to achieve your learning goals.
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {courseCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-4 py-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(isLoading && courses.length === 0) ? (
            Array.from({ length: 12 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Course key={course._id} course={course} userId={userId} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-muted-foreground">
                No courses found for the selected category.
              </p>
            </div>
          )}
        </div>

        <div ref={bottomRef} className="h-10 w-full mt-8" />
        {isFetching && (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseSkeleton = () => (
  <div className="bg-card shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

export default Courses;
