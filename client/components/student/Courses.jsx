"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Course from "./Course";
import useCourses from "@/hooks/useCourses";

const Courses = () => {
  const { getPublishedCoursesQuery } = useCourses();
  const { data, isLoading } = getPublishedCoursesQuery();
  const companyId = localStorage.getItem("companyId");

  const [selectedCategory, setselectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showOtherCompanies, setShowOtherCompanies] = useState(false);

  const itemsPerPage = 12;

  const publicCourses = data?.filter((course) => !course.isPrivate) || [];

  const courseCategory = [
    ...new Set(publicCourses.map((course) => course.category)),
  ];

  const filteredCourses = companyId
    ? data?.filter((course) =>
        showOtherCompanies ? true : course.companyId === companyId
      ) || []
    : publicCourses;

  const categoryFilteredCourses = selectedCategory
    ? filteredCourses.filter((course) => course.category === selectedCategory)
    : filteredCourses;

  const totalPages = Math.ceil(categoryFilteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = categoryFilteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-homeBackground dark:bg-navBackground">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-6">Our Courses</h2>

        {!isLoading && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {!isLoading && companyId && (
              <Button
                checked={showOtherCompanies}
                onClick={() => setShowOtherCompanies((prev) => !prev)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  showOtherCompanies
                    ? "bg-blue-500  text-white "
                    : " bg-white dark:bg-gray-800 hover:bg-gray-500 hover:text-white text-black"
                }`}
              >
                Show All Courses
              </Button>
            )}
            <Button
              onClick={() => setselectedCategory("")}
              className={`rounded-full ${
                selectedCategory === ""
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
                  setselectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`rounded-full ${
                  selectedCategory === category
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
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : paginatedCourses.length > 0 ? (
            paginatedCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No courses available.
              </p>
            </div>
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="flex justify-end items-end gap-2 mt-8">
            <span className="text-gray-700 dark:text-white text-center pr-5">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
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
