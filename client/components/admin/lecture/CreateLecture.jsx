"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Lecture from "./Lecture";

import useCourses from "@/hooks/useCourses";
import useLectures from "@/hooks/useLectures";
import { Switch } from "@/components/ui/switch";
import { videoUpload } from "@/features/api/video-upload/route";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { courseId } = useParams();
  const { getCourseLecturesQuery } = useCourses();
  const { createLecture } = useLectures();
  const fileInputRef = useRef(null);

  const {
    data: lectures,
    isLoading,
    isError,
  } = getCourseLecturesQuery(courseId);

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setMediaProgress(true);

        // Video upload with progress tracking
        const onProgress = (event) => {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        };

        const video = await videoUpload(file, onProgress); // Pass onProgress function
        if (video.success) {
          setUploadVideoInfo({
            videoUrl: video.data.url,
            publicId: video.data.public_id,
          });
        }
      } catch (error) {
        toast.error("Failed to upload video.");
        console.error(error);
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const createLectureHandler = async () => {
    if (!lectureTitle || !uploadVideoInfo) {
      toast.error("Please provide all required fields.");
      return;
    }
    const companyId = localStorage.getItem("companyId");
    const lectureData = {
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
    };

    try {
      await createLecture({ courseId, lectureData, companyId });
      setLectureTitle("");
      setUploadVideoInfo(null);
      setIsFree(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input field
      }
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
          Provide basic details and upload a video for the lecture.
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
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} id="is-free" />
          <Label htmlFor="is-free">Is this video FREE</Label>
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
