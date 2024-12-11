"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

// Mock data for demonstration
const mockCourses = [
  {
    _id: "1",
    coursePrice: "$250",
    isPublished: true,
    courseTitle: "React for Beginners",
  },
  {
    _id: "2",
    coursePrice: "$150",
    isPublished: false,
    courseTitle: "Next.js Deep Dive",
  },
  {
    _id: "3",
    coursePrice: "$300",
    isPublished: true,
    courseTitle: "Advanced JavaScript",
  },
];

const CourseTable = () => {
  const router = useRouter();

  const handleNavigateToCreate = () => {
    router.push("/admin/courses/create");
  };

  const handleNavigateToEdit = (id) => {
    router.push(`/admin/courses/${id}`);
  };

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
          {mockCourses.map((course) => (
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
