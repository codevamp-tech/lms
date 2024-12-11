"use client"
// import RichTextEditor from "@/components/RichTextEditor";
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
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// Mock Courses Data
//to be done rich text editor

const mockCoursesData = {
  '1': {
    id: '1',
    courseTitle: "Mastering Next.js 14 Full-Stack Development",
    subTitle: "Build Production-Ready Web Applications with Next.js and Modern Web Technologies",
    description: "A comprehensive course covering everything from basics to advanced Next.js techniques, including server-side rendering, API routes, and full-stack application development.",
    category: "Next JS",
    courseLevel: "Medium",
    coursePrice: "299",
    isPublished: false,
    lectures: [
      { id: '1', title: "Introduction to Next.js" },
      { id: '2', title: "React Foundations" }
    ],
    // courseThumbnail: "/path/to/next-js-course-thumbnail.jpg"
  },
  '2': {
    id: '2',
    courseTitle: "Python for Data Science",
    subTitle: "From Beginner to Advanced Data Analysis",
    description: "Learn Python programming with a focus on data science, machine learning, and data visualization.",
    category: "Data Science",
    courseLevel: "Beginner",
    coursePrice: "199",
    isPublished: true,
    lectures: [
      { id: '1', title: "Python Basics" },
      { id: '2', title: "Data Manipulation with Pandas" }
    ],
    // courseThumbnail: "/path/to/python-data-science-thumbnail.jpg"
  }
};

const CourseTab = () => {
  const {courseId} = useParams();
  const router = useRouter();

  // Get course data or default to first course
  const courseData = mockCoursesData[courseId] || mockCoursesData['1'];

  const [input, setInput] = useState({
    courseTitle: courseData.courseTitle,
    subTitle: courseData.subTitle,
    description: courseData.description,
    category: courseData.category,
    courseLevel: courseData.courseLevel,
    coursePrice: courseData.coursePrice,
    courseThumbnail: null as File | null,
  });

  const [previewThumbnail, setPreviewThumbnail] = useState(courseData.courseThumbnail ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const selectCategory = (value: string) => {
    setInput(prev => ({ ...prev, category: value }));
  };

  const selectCourseLevel = (value: string) => {
    setInput(prev => ({ ...prev, courseLevel: value }));
  };

  const selectThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput(prev => ({ ...prev, courseThumbnail: file }));
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result as string);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with mock data update
      mockCoursesData[courseId] = {
        ...mockCoursesData[courseId],
        ...input,
        courseThumbnail: previewThumbnail || mockCoursesData[courseId].courseThumbnail
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Course ${courseId} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update course ${courseId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const publishStatusHandler = () => {
    try {
      // Toggle publish status in mock data
      mockCoursesData[courseId].isPublished = !mockCoursesData[courseId].isPublished;
      
      const status = mockCoursesData[courseId].isPublished ? "published" : "unpublished";
      toast.success(`Course ${courseId} ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to change publish status for course ${courseId}`);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your course (ID: {courseId}). Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button 
            disabled={courseData.lectures.length === 0} 
            variant="outline" 
            onClick={publishStatusHandler}
          >
            {courseData.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="destructive">Remove Course</Button>
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
            {/* <RichTextEditor input={input} setInput={setInput} /> */}
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select
                value={input.category}
                onValueChange={selectCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
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
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
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
            <Button 
              onClick={updateCourseHandler} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;