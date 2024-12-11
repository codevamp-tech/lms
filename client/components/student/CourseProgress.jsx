"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Use Next.js router

// Mock Data
const coursesData = [
  {
    id: "1",
    courseTitle: "React Basics",
    completed: false,
    lectures: [
      { _id: "1", lectureTitle: "Introduction to React", videoUrl: "/videos/intro-to-react.mp4" },
      { _id: "2", lectureTitle: "State and Props", videoUrl: "/videos/state-and-props.mp4" },
    ],
  },
  {
    id: "2",
    courseTitle: "Advanced JavaScript",
    completed: false,
    lectures: [
      { _id: "1", lectureTitle: "JavaScript ES6", videoUrl: "/videos/es6-features.mp4" },
      { _id: "2", lectureTitle: "Async Programming", videoUrl: "/videos/async-programming.mp4" },
    ],
  },
  // Add more courses as needed
];

const CourseProgress = () => {
  const router = useRouter();
  const { courseId } = useParams(); // Get courseId from URL params
  
  const course = coursesData.find(course => course.id === courseId); // Find course by ID
  
  const [currentLecture, setCurrentLecture] = useState(course?.lectures[0]);
  
  const isLectureCompleted = (lectureId) => {
    return false; // Since we're using mock data, set to false or handle mock logic here.
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  const handleCompleteCourse = () => {
    // Simulate marking course as complete
    console.log("Course completed:", course.courseTitle);
  };

  const handleInCompleteCourse = () => {
    // Simulate marking course as incomplete
    console.log("Course marked as incomplete:", course.courseTitle);
  };

  if (!course) {
    return <p>Course not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Display course name  */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{course.courseTitle}</h1>
        <Button
          onClick={course.completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={course.completed ? "outline" : "default"}
        >
          {course.completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>{" "}
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section  */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
            />
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {`Lecture ${
                course.lectures.findIndex(
                  (lec) => lec._id === currentLecture?._id
                ) + 1
              } : ${currentLecture?.lectureTitle}`}
            </h3>
          </div>
        </div>

        {/* Lecture Sidebar  */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {course.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id ? "bg-gray-200 dark:bg-gray-800" : ""
                } `}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge variant={"outline"} className="bg-green-200 text-green-600">
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
