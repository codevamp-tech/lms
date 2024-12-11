// course/course-detail/[courseId]/page.tsx
"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useParams } from "next/navigation";

// Mock data (replace with API call or actual data fetching logic)
const mockCourses = [
  {
    id: 1,
    courseTitle: "React for Beginners",
    description: "<p>Learn React from scratch and build amazing apps!</p>",
    creator: { name: "John Doe" },
    createdAt: "2024-01-01T12:00:00Z",
    enrolledStudents: [1, 2, 3],
    lectures: [
      { lectureTitle: "Introduction to React", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { lectureTitle: "State and Props", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    ],
    purchased: false, // Mock purchased state
  },
  {
    id: 2,
    courseTitle: "Advanced JavaScript",
    description: "<p>Deep dive into JavaScript and become a pro!</p>",
    creator: { name: "Jane Smith" },
    createdAt: "2024-01-10T12:00:00Z",
    enrolledStudents: [4, 5, 6],
    lectures: [
      { lectureTitle: "JavaScript Basics", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { lectureTitle: "Async Programming", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    ],
    purchased: true,
  }
];

const CourseDetail = () => {
  const { courseId } = useParams(); // Get the courseId from the URL

  // Find the course data based on the courseId
  const course = mockCourses.find((course) => course.id === parseInt(courseId));

  // If course not found
  if (!course) {
    return <h1>Course not found</h1>;
  }

  const handleContinueCourse = () => {
    if (course.purchased) {
      // Navigate to the course progress page
      router.push(`/course/course-progress/${courseId}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">{course?.courseTitle}</h1>
          <p className="text-base md:text-lg">Course Sub-title</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{course.lectures.length} lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>{course.purchased ? <PlayCircle size={14} /> : <Lock size={14} />}</span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width="100%"
                  height={"100%"}
                  url={course.lectures[0].videoUrl}
                  controls={true}
                />
              </div>
              <h1>Lecture title</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {course.purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>
              ) : (
                <Button className="w-full">Buy Course</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
