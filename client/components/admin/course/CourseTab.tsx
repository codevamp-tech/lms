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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useCourses from "@/hooks/useCourses";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CourseTab = () => {
  const { courseId: rawCourseId } = useParams();
  const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;
  const router = useRouter();
  const { getCourseByIdQuery, editCourse, publishCourse, deleteCourse, privateCourse } = useCourses();

  const { data: course, isLoading: isCourseLoading, error, refetch } = getCourseByIdQuery(courseId);

  const [companyId, setCompanyId] = useState<string | null>(null);

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    courseLevel: "",
    coursePrice: "",
    courseMRP: "",
    companyId: "",
    is_3_month_validity: false,
    courseExpiryDate: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>("");

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      setInput(prev => ({ ...prev, companyId: storedCompanyId }));
    }
  }, []);

  useEffect(() => {
    if (course) {
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        courseLevel: course.courseLevel || "",
        coursePrice: course.coursePrice || "",
        courseMRP: course.courseMRP || "",
        companyId: course.companyId || companyId || "",
        is_3_month_validity: course.is_3_month_validity || false,
        courseExpiryDate: course.courseExpiryDate || "",
      });
      setPreviewThumbnail(course.courseThumbnail || "");
      refetch();
    }
  }, [course, companyId, refetch]);

  // Handlers
  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const selectCourseLevel = (value: string) =>
    setInput(prev => ({ ...prev, courseLevel: value }));

  const selectThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const publishCourseHandler = async () => {
    if (!courseId) return;
    const status = course?.isPublished ? false : true;
    await publishCourse({ courseId, publish: status, companyId }, {
      onSuccess: () => {
        toast.success(`Course ${status ? "published" : "unpublished"} successfully.`);
        refetch();
      },
      onError: () => toast.error("Failed to update publish state."),
    });
  };

  const privateCourseHandler = async () => {
    if (!courseId) return;
    const status = course?.isPrivate ? false : true;
    await privateCourse({ courseId, privated: status, companyId }, {
      onSuccess: () => {
        toast.success(`Course ${status ? "private" : "public"} successfully.`);
        refetch();
      },
      onError: () => toast.error("Failed to update privacy state."),
    });
  };

  const updateCourseHandler = () => {
    if (!courseId) return;
    if (!input.courseTitle || !input.courseLevel) {
      toast.error("Please fill out all required fields.");
      return;
    }

    editCourse({ courseId, updatedData: input, thumbnail: thumbnail || undefined }, {
      onSuccess: () => {
        toast.success(`Course ${courseId} updated successfully.`);
        router.push("/admin/courses");
      },
      onError: () => toast.error(`Failed to update course ${courseId}.`),
    });
  };

  if (isCourseLoading) {
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
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your course (ID: {courseId}). Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-1">
          <Button disabled={!course?.lectures?.length} variant="outline" onClick={publishCourseHandler}>
            {course?.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="default" onClick={() => { router.push("/admin/courses"); courseId && deleteCourse({ courseId }); }}>
            Remove Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label htmlFor="courseTitle">Title</Label>
            <Input id="courseTitle" type="text" name="courseTitle" value={input.courseTitle} onChange={changeEventHandler} placeholder="Ex. Fullstack developer" />
          </div>
          <div>
            <Label htmlFor="subTitle">Subtitle</Label>
            <Input id="subTitle" type="text" name="subTitle" value={input.subTitle} onChange={changeEventHandler} placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" value={input.description} onChange={changeEventHandler as any} placeholder="Course description here..." className="w-full border rounded-md p-2" />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Course Level</Label>
              <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    {["Beginner", "Medium", "Advance"].map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coursePrice">Offer Price (INR)</Label>
              <Input id="coursePrice" type="number" name="coursePrice" value={input.coursePrice} onChange={changeEventHandler} placeholder="199" className="w-fit" />
            </div>
            <div>
              <Label htmlFor="courseMRP">Price (INR)</Label>
              <Input id="courseMRP" type="number" name="courseMRP" value={input.courseMRP} onChange={changeEventHandler} placeholder="599" className="w-fit" />
            </div>
            {/* <div className="flex flex-col space-y-2">
              <div className="flex items-center mt-2 space-x-2 bg-slate-50 p-3 rounded-lg">
                <span className="text-sm font-medium">{course?.isPrivate ? 'Private Course' : 'Public Course'}</span>
                <Switch checked={course?.isPrivate} onCheckedChange={privateCourseHandler} className="data-[state=checked]:bg-blue-600" />
              </div>
            </div> */}
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="validity-mode"
              checked={input.is_3_month_validity}
              onCheckedChange={(checked) => setInput(prev => ({ ...prev, is_3_month_validity: checked }))}
            />
            <Label htmlFor="validity-mode">3 Month Validity</Label>
          </div>
          <div>
            <Label htmlFor="courseExpiryDate">Course Expiry Date</Label>
            <Input
              id="courseExpiryDate"
              type="date"
              name="courseExpiryDate"
              value={input.courseExpiryDate ? new Date(input.courseExpiryDate).toISOString().split('T')[0] : ''}
              onChange={changeEventHandler}
              className="w-fit"
            />
          </div>
          <div>
            <Label htmlFor="courseThumbnail">Course Thumbnail</Label>
            <Input id="courseThumbnail" type="file" onChange={selectThumbnail} accept="image/*" className="w-fit" />
            {previewThumbnail && <img src={previewThumbnail} className="h-64 my-2" alt="Course Thumbnail" />}
          </div>
          <div className="space-x-2">
            <Button onClick={() => router.push("/admin/courses")} variant="outline">Cancel</Button>
            <Button onClick={updateCourseHandler}>Save</Button>
          </div>
        </div>
      </CardContent>
    </Card >
  );
};

export default CourseTab;
