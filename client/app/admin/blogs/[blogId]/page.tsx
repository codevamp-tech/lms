"use client";
import React from "react";
import BlogForm from "@/components/admin/blog/BlogForm";
import { useParams } from "next/navigation";

const EditBlogPage = () => {
    const params = useParams();
    const blogId = params.blogId as string;

    return <BlogForm blogId={blogId} isEdit />;
};

export default EditBlogPage;
