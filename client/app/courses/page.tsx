"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import useCourses from "@/hooks/useCourses";
import { getUserIdFromToken } from "@/utils/helpers";
import Course from "@/components/student/Course";

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showOtherCompanies, setShowOtherCompanies] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const observerRef = useRef(null);
  const bottomRef = useRef(null);

  const { getPublishedCoursesQuery } = useCourses();
  const userId = getUserIdFromToken();
  const { data, isLoading } = getPublishedCoursesQuery(currentPage);

  useEffect(() => {
    if (data?.courses) {
      setCourses((prev) =>
        currentPage === 1 ? data.courses : [...prev, ...data.courses]
      );
    }
  }, [data]);

  const companyId = localStorage.getItem("companyId");
  const publicCourses = courses?.filter((course) => !course.isPrivate) || [];

  const courseCategory = [
    ...new Set(publicCourses.map((course) => course.category)),
  ];

  const filteredCourses = companyId
    ? courses?.filter((course) =>
      showOtherCompanies ? true : course.companyId === companyId
    ) || []
    : publicCourses;

  const categoryFilteredCourses = selectedCategory
    ? filteredCourses.filter((course) => course.category === selectedCategory)
    : filteredCourses;

  useEffect(() => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < data?.totalPages) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) observerRef.current.observe(bottomRef.current);
  }, [isLoading, currentPage, data?.totalPages]);

  useEffect(() => {
    setCourses([]);
    setCurrentPage(1);
  }, [selectedCategory]);

  return (
    <div className="bg-homeBackground dark:bg-navBackground mt-4">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-6">Our Courses</h2>

        {!isLoading && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {companyId && (
              <Button
                onClick={() => setShowOtherCompanies((prev) => !prev)}
                className={`px-4 py-2 rounded-full border transition-colors ${showOtherCompanies
                  ? "bg-blue-500  text-white"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-500 hover:text-white text-black"
                  }`}
              >
                Show All Courses
              </Button>
            )}
            <Button
              onClick={() => setSelectedCategory("")}
              className={`rounded-full ${selectedCategory === ""
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 hover:bg-gray-500 hover:text-white text-black"
                }`}
            >
              All Category
            </Button>
            {courseCategory.map((category) => (
              <Button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                }}
                className={`rounded-full ${selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-500 hover:text-white text-black"
                  }`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && courses.length === 0 ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : categoryFilteredCourses.length > 0 ? (
            categoryFilteredCourses.map((course, index) => {
              return (
                <Course key={course._id} course={course} userId={userId} />
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No courses available.
              </p>
            </div>
          )}

          {isLoading && courses.length > 0 && (
            <div className="col-span-full flex justify-center py-4">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-10 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => (
  <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
    <Skeleton className="w-full h-36" />
    <div className="px-5 py-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);
