"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCourses from "@/hooks/useCourses";
import { Edit, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getUserIdFromToken } from "@/utils/helpers";
import { getInstructor } from "@/features/api/users/route";

const CourseTable = () => {
  const { getCreatorCoursesQuery } = useCourses();
  const router = useRouter();
  const userId = getUserIdFromToken();
  const ITEMS_PER_PAGE = 7;

  const { data: courses = [], isLoading, error } = getCreatorCoursesQuery(userId);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [instructorStatus, setInstructorStatus] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorStatus = async () => {
      try {
        const data = await getInstructor();

        if (data.success) {
          // Find current user in instructors array
          const currentInstructor = data.instructors.find(
            (inst: any) => inst._id === userId
          );

          if (currentInstructor) {
            setInstructorStatus(currentInstructor.isStatus);
          }
        }
      } catch (err) {
        console.error("Error fetching instructor status:", err);
        setError("Failed to verify instructor status");
      } finally {
        setStatusLoading(false);
      }
      setCurrentPage(1);
    };

    fetchInstructorStatus();
  }, [userId, searchTerm]);


  const filteredCourses = courses.filter((course: { courseTitle: string; }) =>
    course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);


  const handleNavigateToCreate = () => {
    router.push("/admin/courses/create");
  };

  const handleNavigateToEdit = (id: string) => {
    router.push(`/admin/courses/${id}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSuggestionClick = (title: string) => {
    setSearchTerm(title);
    setShowSuggestions(false);
  };

  const clearSearch = () => setSearchTerm("");

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Button
          onClick={handleNavigateToCreate}
          disabled={statusLoading || !instructorStatus}
        >
          {statusLoading ? "Checking Status..." : "Create New Course"}
        </Button>
        {!instructorStatus && !statusLoading && (
          <span className="text-sm text-red-500">
            Your account is inactive. Please contact admin to active your account .
          </span>
        )}
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search courses by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestions && searchTerm && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCourses.map((course) => (
                  <div
                    key={course._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(course.courseTitle)}
                  >
                    {course.courseTitle}
                  </div>
                ))}
              </div>
            )}
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="px-2"
            >
              <X className="h-30 w-30" />
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableCaption>
          {searchTerm && filteredCourses.length === 0
            ? "No courses found. Try a different search."
            : courses.length === 0
              ? "No courses here. Start by creating your first course."
              : "A list of your recent courses."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="w-[80px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCourses.map((course: any) => (
            <TableRow key={course._id}>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="font-medium">{course.coursePrice || "NA"}</TableCell>
              <TableCell>
                <Badge>{course.isPublished ? "Published" : "Draft"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleNavigateToEdit(course._id)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredCourses.length > ITEMS_PER_PAGE && (
        <div className="flex  justify-end items-center mt-4 gap-3" >

          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseTable;

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
