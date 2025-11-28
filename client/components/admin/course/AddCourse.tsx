"use client";
import { Button } from "@/components/ui/button";
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
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import useCourses from "@/hooks/useCourses";
import { getUserIdFromToken } from "@/utils/helpers";
import toast from "react-hot-toast";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [categories, setCategories] = useState([
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
  ]);

  const { createNewCourse, isLoading } = useCourses();
  const userId = getUserIdFromToken();
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
    }
  }, []);

  const handleAddCategory = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && addCategory.trim() !== "") {
      const newCategory = addCategory.trim();

      if (!categories.includes(newCategory)) {
        setCategories((prev) => [...prev, newCategory]); // Add new category
        setCategory(newCategory); // Automatically select the new category
        setAddCategory(""); // Clear input
        toast.success(`Category "${newCategory}" added.`);
      } else {
        toast.error("Category already exists.");
      }
    }
  };
  const createCourseHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!category || !courseTitle.trim()) {
    //   toast.error("Please provide all required fields.");
    //   return;
    // }

    try {
      await createNewCourse({ courseTitle, creatorId: userId, companyId: companyId || "" });
      toast.success("Course created successfully.");

      // Keep all categories, and pre-select the current category
      setCourseTitle(""); // Clear course title
      setAddCategory(""); // Clear addCategory input
      setCategory(""); // Reset selected category
      router.push("/admin/courses");
    } catch (error) {
      toast.error("Failed to create course.");
    }
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add a course, add some basic course details for your new course
        </h1>
        <p className="text-sm">
          Provide the necessary information to create a new course.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="courseTitle">Title</Label>
          <Input
            id="courseTitle"
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your Course Name"
          />
        </div>
        {/* <div>
          <Label>Category</Label>
          <Select onValueChange={(value) => setCategory(value)} value={category}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <Input
                  type="text"
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value)}
                  onKeyDown={handleAddCategory}
                  placeholder="Add a new category"
                  className="p-2"
                />
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/courses")}
          >
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
