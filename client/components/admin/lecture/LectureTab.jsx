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
import { Switch } from "@/components/ui/switch";
// import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Using next/navigation instead of React Router
import { toast } from "sonner";
import useLectures from "@/hooks/useLectures";
import { videoUpload } from "@/features/api/video-upload/route";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const { lectureId, courseId } = useParams();
  const { getLectureByIdQuery, deleteLecture, editLecture } = useLectures();

  const { data: lecture, isLoading, error } = getLectureByIdQuery(lectureId);

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  // Commenting out the API hooks
  // const [edtiLecture, { data, isLoading, error, isSuccess }] =
  //   useEditLectureMutation();
  // const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();

  const router = useRouter();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setMediaProgress(true);

        const video = await videoUpload(file);
        if (video.success) {
          setUploadVideoInfo({
            videoUrl: video.data.url,
            publicId: video.data.public_id,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    const lectureData = {
      lectureTitle: lectureTitle,
      videoInfo: {
        videoUrl: uploadVideoInfo.videoUrl,
        publicId: uploadVideoInfo.publicId,
      },
      isPreviewFree: isFree,
    };
    // Commenting out the actual mutation
    await editLecture({courseId, lectureId, lectureData});
    toast.success("Lecture updated successfully (mock)");
  };

  const removeLectureHandler = async () => {
    await deleteLecture(lectureId);
    router.push(`/admin/courses/${courseId}/lecture`);
    toast.success("Lecture removed successfully (mock)");
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
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={false} // Mock value
            variant="destructive"
            onClick={removeLectureHandler}
          >
            {false ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            placeholder="Ex. Introduction to Javascript"
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={isFree}
            onCheckedChange={setIsFree}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-4">
          <Button disabled={false} onClick={editLectureHandler}>
            {false ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
