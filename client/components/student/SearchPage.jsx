"use client";
import React, { useEffect, useState, useMemo } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCourses from "@/hooks/useCourses";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const SearchPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { getPublishedCoursesQuery } = useCourses();
  const { data, isLoading, isError } = getPublishedCoursesQuery();

  const searchedCourses = useMemo(() => {
    if (!data?.courses) return [];
    const lowerCaseQuery = query.toLowerCase();
    return data.courses.filter((course) =>
      course.courseTitle.toLowerCase().includes(lowerCaseQuery)
    );
  }, [data, query]);

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...searchedCourses];
    if (selectedCategories.length > 0) {
      result = result.filter((course) =>
        selectedCategories.includes(course.category)
      );
    }
    if (sortByPrice === "asc") {
      result.sort((a, b) => a.courseMRP - b.courseMRP);
    } else if (sortByPrice === "desc") {
      result.sort((a, b) => b.courseMRP - a.courseMRP);
    }
    return result;
  }, [searchedCourses, selectedCategories, sortByPrice]);

  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Search Results for "{query}"
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          {filteredAndSortedCourses.length} courses found.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/4">
          <Filter handleFilterChange={handleFilterChange} />
        </div>
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => <CourseSkeleton key={idx} />)
          ) : filteredAndSortedCourses.length === 0 ? (
            <CourseNotFound query={query} />
          ) : (
            <div className="space-y-6">
              {filteredAndSortedCourses.map((course) => (
                <SearchResult key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseNotFound = ({ query }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] bg-secondary/30 dark:bg-gray-800/30 p-8 rounded-lg">
    <AlertCircle className="text-destructive h-20 w-20 mb-6" />
    <h2 className="font-bold text-3xl md:text-4xl text-center mb-3">
      No Results Found for "{query}"
    </h2>
    <p className="text-lg text-muted-foreground text-center mb-6 max-w-md">
      We couldn't find any courses matching your search. Try a different keyword or browse our categories.
    </p>
    <Link href="/courses">
      <Button size="lg">
        <Search className="mr-2 h-5 w-5" />
        Browse All Courses
      </Button>
    </Link>
  </div>
);

const CourseSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-6 border-b border-border py-6">
    <Skeleton className="h-48 w-full md:w-1/3 rounded-lg" />
    <div className="flex-1 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-8 w-32 mt-4" />
    </div>
  </div>
);

export default SearchPage;
