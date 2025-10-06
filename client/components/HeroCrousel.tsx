
"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import Course from "./Course";
import useCourses from "@/hooks/useCourses";
import { getUserIdFromToken } from "@/utils/helpers";

const HeroCrousel = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showOtherCompanies, setShowOtherCompanies] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);
  const [topRatedCourses, setTopRatedCourses] = useState<any[]>([]);
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

  // ✅ Fetch ratings for top-rated courses
  useEffect(() => {
    async function fetchRatings() {
      try {
        const ratingsData = await Promise.all(
          publicCourses.map(async (course) => {
            try {
              const res = await fetch(`http://localhost:3001/ratings/${course._id}`);
              if (!res.ok) return { ...course, avgRating: 0 };
              const rating = await res.json();
              return { ...course, avgRating: rating.average || 0 };
            } catch {
              return { ...course, avgRating: 0 };
            }
          })
        );

        // Sort by rating descending
        const sorted = ratingsData
          .sort((a, b) => b.avgRating - a.avgRating)
          .slice(0, 10); // Top 10 only
        setTopRatedCourses(sorted);
      } catch (error) {
        console.error("Error fetching top rated courses:", error);
      }
    }

    if (publicCourses.length > 0) fetchRatings();
  }, [publicCourses]);

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
    <div className="bg-homeBackground dark:bg-navBackground">
      <div className="max-w-7xl mx-auto p-6">
        {/* 🔹 Normal Courses */}
        <h2 className="font-bold text-3xl text-center mb-6">Our Courses</h2>

        {/* ✅ Carousel 1 (Left → Right) */}
        <div className="overflow-hidden mb-12">
          <div className="flex gap-6 animate-marquee">
            {categoryFilteredCourses.map((course) => (
              <div key={course._id} className="w-72 flex-shrink-0">
                <Course course={course} userId={userId} />
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Carousel 2 (Right → Left) */}
        <div className="overflow-hidden">
          <div className="flex gap-6 animate-marquee-reverse">
            {categoryFilteredCourses.map((course) => (
              <div key={`reverse-${course._id}`} className="w-72 flex-shrink-0">
                <Course course={course} userId={userId} />
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 Top Rated Courses Section */}
        {topRatedCourses.length > 0 && (
          <div className="mt-16">
            <h2 className="font-bold text-3xl text-center mb-6">
              ⭐ Top Rated Courses
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {topRatedCourses.map((course) => (
                <div key={`top-${course._id}`} className="w-72">
                  <Course course={course} userId={userId} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-10 w-full"></div>
      </div>
    </div>
  );
};

export default HeroCrousel;


/* Skeleton Loader */
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
