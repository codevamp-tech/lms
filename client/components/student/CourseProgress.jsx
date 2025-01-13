"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Use Next.js router
import { getUserIdFromToken } from "@/utils/helpers";
import useCourseProgress from "@/hooks/useCourseProgress";

const CourseProgress = () => {
  const router = useRouter();
  const { courseId } = useParams();

  const userId = getUserIdFromToken();
  const {
    getCourseProgressQuery,
    markAsComplete,
    markAsInComplete,
    updateLectureProgress,
  } = useCourseProgress();

  const { data, isLoading, error } = getCourseProgressQuery(courseId, userId);
  const [currentLecture, setCurrentLecture] = useState(null);

  useEffect(() => {
    if (data) {
      setCurrentLecture(data?.courseDetails.lectures[0]);
    }
  }, [data]);

  const isLectureCompleted = (lectureId) => {
    const lectureProgress = data?.progress.find(
      (lecture) => lecture.lectureId === lectureId
    );
    return lectureProgress ? lectureProgress.viewed : false;
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  const handleCompleteCourse = () => {
    markAsComplete({ courseId, userId });
  };

  const handleInCompleteCourse = () => {
    markAsInComplete({ courseId, userId });
  };

  if (!data) {
    return <p>Course not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Display course name  */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-500">
          {data?.courseDetails.courseTitle}
        </h1>
        <Button
          onClick={
            data?.completed ? handleInCompleteCourse : handleCompleteCourse
          }
          variant={data?.courseDetails.completed ? "outline" : "default"}
        >
          {data?.completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />{" "}
              <span>Mark as InCompleted</span>{" "}
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
                data?.courseDetails.lectures.findIndex(
                  (lec) => lec._id === currentLecture?._id
                ) + 1
              } : ${currentLecture?.lectureTitle}`}
            </h3>
            {!isLectureCompleted(currentLecture?._id) && (
              <Button
                variant={"outline"}
                onClick={() => {
                  updateLectureProgress({
                    courseId,
                    userId,
                    lectureId: currentLecture._id,
                  });
                }}
              >
                Mark lecture as complete
              </Button>
            )}
          </div>
        </div>

        {/* Lecture Sidebar  */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-400 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4 text-blue-500">
            Course Lecture
          </h2>
          <div className="flex-1 overflow-y-auto">
            {data?.courseDetails.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
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
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
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
