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

const ITEMS_PER_PAGE = 7; // Define items per page

const CourseTable = () => {
  const { getCreatorCoursesQuery } = useCourses();
  const router = useRouter();
  const userId = getUserIdFromToken();

  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = getCreatorCoursesQuery(userId, currentPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [instructorStatus, setInstructorStatus] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorStatus = async () => {
      try {
        const data = await getInstructor();
        console.log("instructor data", data);
        if (data.success) {
          const currentInstructor = data.instructors.find((inst: any) => inst._id === userId);
          if (currentInstructor) {
            setInstructorStatus(currentInstructor.isStatus);
          }
        }
      } catch (err) {
        console.error("Error fetching instructor status:", err);
      } finally {
        setStatusLoading(false);
      }
      setCurrentPage(1);
    };

    fetchInstructorStatus();
  }, [userId]);

  const courses = data?.courses || [];
  const totalPages = data?.totalPages || 1;

  const filteredCourses = courses.filter((course: { courseTitle: string }) =>
    course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleNavigateToCreate = () => {
    router.push("/admin/courses/create");
  };

  const handleNavigateToEdit = (id: string) => {
    router.push(`/admin/courses/${id}`);
  };

  const handleSuggestionClick = (title: string) => {
    setSearchTerm(title);
    setShowSuggestions(false);
  };

  const clearSearch = () => setSearchTerm("");

  console.log("coursesssssss", courses);

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log("instructorStatus:", instructorStatus, statusLoading, statusLoading || !instructorStatus);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Button onClick={handleNavigateToCreate} disabled={statusLoading || !instructorStatus}>
          {statusLoading ? "Checking Status..." : "Create New Course"}
        </Button>
        {!instructorStatus && !statusLoading && (
          <span className="text-sm text-red-500">
            Your account is inactive. Please contact admin to activate your account.
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
            <Button variant="ghost" size="sm" onClick={clearSearch} className="px-2">
              <X className="h-4 w-4" />
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
          {courses.map((course: any) => (
            <TableRow key={course._id}>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="font-medium">{course.coursePrice || "NA"}</TableCell>
              <TableCell>
                <Badge>{course.isPublished ? "Published" : "Draft"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" onClick={() => handleNavigateToEdit(course._id)}>
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4 gap-3">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={handlePreviousPage}>
            Previous
          </Button>
          <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={handleNextPage}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseTable;
