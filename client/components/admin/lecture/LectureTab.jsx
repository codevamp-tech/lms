"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import useLectures from "@/hooks/useLectures";
import { videoUpload } from "@/features/api/video-upload/route";
import toast from "react-hot-toast";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // single source for video or link
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFree, setIsFree] = useState(false);

  const { lectureId, courseId } = useParams();
  const { getLectureByIdQuery, deleteLecture, editLecture } = useLectures();
  const router = useRouter();

  const { data: lecture, isLoading, error, refetch } = getLectureByIdQuery(lectureId);

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setVideoUrl(lecture.videoInfo?.videoUrl || lecture.link || "");
      refetch();
    }
  }, [lecture, refetch]);

  // Handle video upload
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setMediaProgress(true);

      const video = await videoUpload(file);
      if (video.success) {
        setVideoUrl(video.data.url); // save uploaded video url in videoUrl
      }
    } catch (error) {
      console.error(error);
      toast.error("Video upload failed");
    } finally {
      setMediaProgress(false);
    }
  };

  // Handle link input
  const linkChangeHandler = (e) => {
    setVideoUrl(e.target.value); // save link url in videoUrl
  };

  const editLectureHandler = async () => {
    if (!lectureTitle) {
      toast.error("Please provide a title");
      return;
    }

    if (!videoUrl) {
      toast.error("Please provide a video or a link");
      return;
    }

    const lectureData = {
      lectureTitle,
      videoInfo: {
        videoUrl: videoUrl,
      },
      isPreviewFree: isFree,
    };

    await editLecture({ courseId, lectureId, lectureData });
    toast.success("Lecture updated successfully");
    router.push(`/admin/courses/${courseId}/lecture`);
  };

  const removeLectureHandler = async () => {
    await deleteLecture(lectureId);
    toast.success("Lecture removed successfully (mock)");
    router.push(`/admin/courses/${courseId}/lecture`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading course data...
      </div>
    );
  }

  if (error) {
    return <div>Error loading course data: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>Provide basic details and upload a video or add a link for the lectures.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={removeLectureHandler}>Remove Lecture</Button>
        </div>
      </CardHeader>

      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Ex. Introduction to Javascript"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>

        <div className="my-5">
          <Label>Video Upload</Label>
          <Input
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
            placeholder="Paste a video URL here"
            value={videoUrl}
            onChange={linkChangeHandler}
            className="w-fit"
          />
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}


        <div className="mt-4">
          <Button onClick={editLectureHandler}>Update Lecture</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
