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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { deleteCourses } from "@/features/api/courses/route";
import useCourses from "@/hooks/useCourses";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const CourseTab = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const { getCourseByIdQuery, editCourse, publishCourse, deleteCourse } = useCourses();

  // Fetch course data
  const {
    data: course,
    isLoading: isCourseLoading,
    error,
    refetch,
  } = getCourseByIdQuery(courseId);


  // Local state for form inputs
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [courseStatus, setCourseStatus] = useState();
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>("");

  const [categories, setCategories] = useState([
    ...new Set([
      "Next JS",
      "Data Science",
      "Frontend Development",
      "Fullstack Development",
      "MERN Stack Development",
      "Javascript",
      "Python",
      "Docker",
      "MongoDB",
      "HTML",
    ])
  ]);
  // Populate form with fetched course data
  useEffect(() => {
    if (course) {
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "",
        courseLevel: course.courseLevel || "",
        coursePrice: course.coursePrice || "",
      });
      setPreviewThumbnail(course.courseThumbnail || "");
      setCourseStatus(course.courseStatus);
      if (course.category && !categories.includes(course.category)) {
        setCategories((prev) => [...new Set([...prev, course.category])]);
      }
      refetch();
    }
  }, [refetch, course, categories]);


  // Handlers
  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const selectCategory = (value: string) =>
    setInput((prev) => ({ ...prev, category: value }));

  const selectCourseLevel = (value: string) =>
    setInput((prev) => ({ ...prev, courseLevel: value }));

  const selectThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const fileReader = new FileReader();
      fileReader.onloadend = () =>
        setPreviewThumbnail(fileReader.result as string);
      fileReader.readAsDataURL(file);
    }
  };

  const publishCourseHandler = async () => {
    const status = course.isPublished === true ? false : true
    await publishCourse(
      { courseId, publish: status },

      {
        onSuccess: () => {
          toast.success(
            `Course ${status ? "published" : "unpublished"} successfully.`
          );
          refetch();
        },
        onError: () => {
          toast.error("Failed to update publish state.");
        },
      }
    );
  };

  const updateCourseHandler = () => {
    if (!input.courseTitle || !input.category || !input.courseLevel) {
      toast.error("Please fill out all required fields.");
      return;
    }

    editCourse(
      { courseId, updatedData: input, thumbnail },
      {
        onSuccess: () => {
          toast.success(`Course ${courseId} updated successfully.`);
          router.push("/admin/courses");
        },
        onError: () => {
          toast.error(`Failed to update course ${courseId}.`);
        },
      }
    );
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
            Make changes to your course (ID: {courseId}). Click save when you're
            done.
          </CardDescription>
        </div>
        <Button
          disabled
          variant="outline"
          value={courseStatus}
        >
          {course?.courseStatus}
        </Button>
        <div className="space-x-2">
          <Button
            disabled={!course?.lectures?.length}
            variant="outline"
            onClick={publishCourseHandler}
          >
            {course?.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="default"
            onClick={(e) => {
              e.stopPropagation(),
                router.push("/admin/courses"),
                deleteCourse({ courseId });
            }}>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack developer"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={input.description}
              onChange={(e) => changeEventHandler(e as any)}
              placeholder="Course description here..."
              className="w-full border rounded-md p-2"
            />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    {["Beginner", "Medium", "Advance"].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="h-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div className="space-x-2">
            <Button
              onClick={() => router.push("/admin/courses")}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={updateCourseHandler}>Save</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
