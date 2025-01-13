"use client"
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import CourseTab from "./CourseTab";
import { useParams } from 'next/navigation';

const EditCourse = () => {
  const { courseId } = useParams();


  if (!courseId) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl text-blue-500">
          Add detail information regarding course
        </h1>
        <Link href={`/admin/courses/${courseId}/lecture`}>
          <Button className="hover:text-blue-600" variant="link">Go to lectures page</Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default EditCourse;