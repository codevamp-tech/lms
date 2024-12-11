"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Use Next.js useRouter for navigation
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const router = useRouter();
  const { courseId } = useParams() // Get courseId from query params

  // Mock lecture data (replace with your actual data fetching logic)
  const mockLectureData = {
    lectures: [
      { _id: "1", title: "Introduction to React" },
      { _id: "2", title: "Advanced JavaScript" },
    ],
  };

  // Simulate loading and error states
  const lectureLoading = false;
  const lectureError = false;

  const createLectureHandler = async () => {
    // Simulate creating a lecture (replace with actual logic)
    if (lectureTitle) {
      toast.success("Lecture created successfully!");
      setLectureTitle(""); // Reset input field
    } else {
      toast.error("Please provide a lecture title.");
    }
  };

  useEffect(() => {
    // In a real scenario, you'd refetch data or handle success/error states
  }, []);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
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
            onClick={() => router.push(`/admin/courses/${courseId}`)} // Use Next.js router.push for navigation
          >
            Back to course
          </Button>
          <Button onClick={createLectureHandler}>
            {false ? ( // Simulate loading state with a constant `false`
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
          {lectureLoading ? (
            <p>Loading lectures...</p>
          ) : lectureError ? (
            <p>Failed to load lectures.</p>
          ) : mockLectureData.lectures.length === 0 ? (
            <p>No lectures available</p>
          ) : (
            mockLectureData.lectures.map((lecture, index) => (
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
