"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Course from "./Course";
import useCourses from "@/hooks/useCourses";

const Courses = () => {
  const { getPublishedCoursesQuery } = useCourses();
  const { data, isLoading, isError } = getPublishedCoursesQuery();
  const [selectedCategory, setselectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  if (isError) return <h1>Some error occurred while fetching courses.</h1>;

  const courseCategory = data
    ? [...new Set(data.map((course) => course.category))]
    : [];

  const filteredCourses = selectedCategory
    ? data?.filter((course) => course.category === selectedCategory)
    : data;

  // Calculate pagination
  const totalPages = Math.ceil((filteredCourses?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-homeBackground dark:bg-navBackground">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-6">Our Courses</h2>

        {!isLoading && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              onClick={() => setselectedCategory("")}
              className={`rounded-full ${
                selectedCategory === ""
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-500 hover:text-white text-black transform hover:scale-105 transition-all duration-300"
              }`}
            >
              All Category
            </Button>
            {courseCategory.map((category) => (
              <Button
                key={category}
                onClick={() => {
                  setselectedCategory(category);
                  setCurrentPage(1); // Reset to the first page
                }}
                className={`rounded-full ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-500 hover:text-white text-black transform hover:scale-105 transition-all duration-300"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : paginatedCourses?.length > 0 ? (
            paginatedCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No courses available for {selectedCategory} category.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-end items-end mt-8 ">
            <span className="text-gray-700 dark:text-white text-center pr-10">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 mr-2 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded"
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
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
};
