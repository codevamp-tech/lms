"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Lecture from "./Lecture";
import useCourses from "@/hooks/useCourses";
import useLectures from "@/hooks/useLectures";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const router = useRouter();
  const { courseId } = useParams();
  const { getCourseLecturesQuery } = useCourses();
  const { createLecture } = useLectures()

  const { data: lectures, isLoading, isError } = getCourseLecturesQuery(courseId);

  const createLectureHandler = async () => {
    if (lectureTitle) {
      try {
        await createLecture({ courseId, lectureTitle });
        toast.success("Lecture created successfully!");
        setLectureTitle(""); // Reset input field
      } catch (error) {
        toast.error("Failed to create lecture");
      }
    } else {
      toast.error("Please provide a lecture title.");
    }
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl text-blue-500">
          Let's add lectures, add some basic details for your new lecture
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/courses/${courseId}`)}
          >
            Back to course
          </Button>
          <Button onClick={createLectureHandler}>
            {false ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {isLoading ? (
            <p>Loading lectures...</p>
          ) : isError ? (
            <p>Failed to load lectures.</p>
          ) : !lectures?.lectures || lectures.lectures.length === 0 ? (
            <p>No lectures available</p>
          ) : (
            lectures.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={String(courseId)}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;