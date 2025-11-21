"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import useCourses from "@/hooks/useCourses";
import { getUserIdFromToken } from "@/utils/helpers";
import Course from "@/components/student/Course";

interface Course {
  _id: string;
  isPrivate: boolean;
  category: string;
  companyId: string;
  courseThumbnail: string;
  courseMRP: number;
  coursePrice: number;
  courseTitle: string;
  creator?: {
    photoUrl?: string;
    name: string;
  };
  courseLevel: string;
}

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showOtherCompanies, setShowOtherCompanies] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    setCompanyId(storedCompanyId);
    setIsInitialized(true);
  }, []);

  const { getPublishedCoursesQuery } = useCourses();
  const userId = getUserIdFromToken();

  // Only run query after companyId is initialized
  const { data, isLoading } = getPublishedCoursesQuery(
    currentPage,
    8,
    companyId
  );
  console.log("companyId>>", companyId, data?.courses);

  // const companyId = localStorage.getItem("companyId");
  const publicCourses = data?.courses?.filter((course) => !course.isPrivate) || [];

  const courseCategory = [
    ...new Set(publicCourses.map((course) => course.category)),
  ];

  const filteredCourses = companyId
    ? data?.courses?.filter((course) =>
      showOtherCompanies ? true : course.companyId === companyId
    )
    : publicCourses;

  console.log("filteredCourses", filteredCourses, companyId, showOtherCompanies, publicCourses, data?.courses)

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

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isLoading, currentPage, data?.totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="bg-homeBackground dark:bg-navBackground mt-4">
        <div className="max-w-7xl mx-auto p-6">
          <h2 className="font-bold text-3xl text-center mb-6">Our Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-homeBackground dark:bg-navBackground mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h2 className="font-bold text-2xl sm:text-3xl text-center mb-4 sm:mb-6">Our Courses</h2>

        {!isLoading && (
          <div className="flex flex-wrap justify-center gap-2 mb-4 sm:mb-6 lg:mb-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {isLoading && data?.courses.length === 0 ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : categoryFilteredCourses?.length > 0 ? (
            categoryFilteredCourses.map((course) => {
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

          {isLoading && data?.courses.length > 0 && (
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