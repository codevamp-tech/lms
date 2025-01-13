"use client"
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const {courseId} = useParams();
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Link href={`/admin/courses/${courseId}/lecture`}>
            <Button size="icon" variant="outline" className="rounded-full">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="font-bold text-xl text-blue-500">Update Your Lecture</h1>
        </div>
      </div>
      <LectureTab />
    </div>
  );
};

export default EditLecture;
