import { Badge } from "@/components/ui/badge";
import React from "react";
import Link from "next/link";

const SearchResult = ({ course }) => {
   
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
      <Link
        href={`/course/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnial"
          className="h-32 w-full md:w-56 object-cover rounded"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl">{course.courseTitle}</h1>
          <p className="text-sm dark:text-white">{course.subTitle}</p>
          <p className="text-sm dark:text-white">
            Intructor: <span className="font-bold italic underline">{course.creator?.name}</span>
          </p>
          <Badge className="w-fit mt-2 md:mt-0 bg-blue-500">{course.courseLevel}</Badge>
        </div>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
        <h1 className="font-bold text-lg md:text-xl">₹{course.coursePrice}</h1>
      </div>
    </div>
  );
};

export default SearchResult;
