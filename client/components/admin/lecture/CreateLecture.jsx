"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Lecture from "./Lecture";

import useCourses from "@/hooks/useCourses";
import useLectures from "@/hooks/useLectures";
import { videoUpload } from "@/features/api/video-upload/route";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // single source
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { courseId } = useParams();
  const { getCourseLecturesQuery } = useCourses();
  const { createLecture } = useLectures();
  const fileInputRef = useRef(null);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (storedCompanyId) setCompanyId(storedCompanyId);
  }, []);

  const { data: lectures, isLoading, isError } = getCourseLecturesQuery(courseId);

  // Handle file upload
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setMediaProgress(true);
      setVideoUrl(""); // clear link if uploading video

      const onProgress = (event) => {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      };

      const video = await videoUpload(file, onProgress);
      if (video.success) {
        setVideoUrl(video.data.url); // save uploaded video url
      }
    } catch (error) {
      toast.error("Failed to upload video.");
      console.error(error);
    } finally {
      setMediaProgress(false);
    }
  };

  // Handle link input
  const linkChangeHandler = (e) => {
    setVideoUrl(e.target.value); // save link as videoUrl
    if (fileInputRef.current) fileInputRef.current.value = ""; // clear uploaded file if link entered
  };

  const createLectureHandler = async () => {
    if (!lectureTitle) {
      toast.error("Please provide a title.");
      return;
    }

    if (!videoUrl) {
      toast.error("Please provide a video or a link.");
      return;
    }

    const lectureData = {
      lectureTitle,
      videoInfo: { videoUrl }, // always save in videoUrl
    };

    try {
      await createLecture({ courseId, lectureData, companyId });
      setLectureTitle("");
      setVideoUrl("");
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Lecture created successfully!");
    } catch (error) {
      toast.error("Failed to create lecture.");
      console.error(error);
    }
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl text-blue-500">Add a new lecture</h1>
        <p className="text-sm">
          Provide basic details and upload a video or add a link for the lecture.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Lecture title"
          />
        </div>

        <div className="my-5">
          <Label>Video</Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-fit"
          />
        </div>

        <div className="my-5">
          <Label>Or Link</Label>
          <Input
            type="url"
            value={videoUrl}
            onChange={linkChangeHandler}
            placeholder="Paste a video URL here"
            className="w-fit"
          />
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/courses/${courseId}`)}
          >
            Back to course
          </Button>
          <Button onClick={createLectureHandler}>Create lecture</Button>
        </div>

        <div className="mt-10 overflow-y-auto h-96">
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
