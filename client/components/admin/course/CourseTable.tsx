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
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { getUserIdFromToken } from "@/utils/helpers"; // Assuming you have this helper function

const CourseTable = () => {
  const { getCreatorCoursesQuery } = useCourses();
  const router = useRouter();
  const userId = getUserIdFromToken();

  const { data: courses = [], isLoading, error } = getCreatorCoursesQuery(userId);

  const handleNavigateToCreate = () => {
    router.push("/admin/courses/create");
  };

  const handleNavigateToEdit = (id: string) => {
    router.push(`/admin/courses/${id}`);
  };

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Button onClick={handleNavigateToCreate}>Create a new course</Button>
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
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
    </div>
  );
};

export default CourseTable;
