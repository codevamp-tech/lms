"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCreateBlog, useUpdateBlog, useBlogById } from "@/hooks/useBlogs";
import { getUserIdFromToken } from "@/utils/helpers";
import toast from "react-hot-toast";
import Image from "next/image";
import { Upload, X, ArrowLeft, FileText, Tag, Image as ImageIcon, AlignLeft } from "lucide-react";

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface BlogFormProps {
  blogId?: string;
  isEdit?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({ blogId, isEdit = false }) => {
  const router = useRouter();
  const userId = getUserIdFromToken();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: blog, isLoading: blogLoading } = useBlogById(blogId || "");
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();

  useEffect(() => {
    if (isEdit && blog) {
      setTitle(blog.title || "");
      setContent(blog.content || "");
      setExcerpt(blog.excerpt || "");
      setCategory(blog.category || "");
      setTags(blog.tags?.join(", ") || "");
      if (blog.thumbnail) {
        setThumbnailPreview(blog.thumbnail);
      }
    }
  }, [isEdit, blog]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      if (isEdit && blogId) {
        await updateMutation.mutateAsync({
          blogId,
          data: {
            title,
            content,
            excerpt,
            category,
            tags: tagsArray,
          },
          thumbnail: thumbnail || undefined,
        });
        toast.success("Blog updated successfully");
      } else {
        await createMutation.mutateAsync({
          blogData: {
            title,
            content,
            excerpt,
            category,
            tags: tagsArray,
            authorId: userId || "",
          },
          thumbnail: thumbnail || undefined,
        });
        toast.success("Blog created successfully");
      }

      router.push("/create-blog");
    } catch (error) {
      toast.error(isEdit ? "Failed to update blog" : "Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
  ];

  if (isEdit && blogLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/create-blog")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Blogs</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEdit ? "Edit Blog" : "Create New Blog"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit
              ? "Update your blog post details below"
              : "Share your thoughts and ideas with the world"}
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Title Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <Label htmlFor="title" className="text-base font-semibold text-gray-900 dark:text-white">
                    Blog Title
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Give your blog a catchy title</p>
                </div>
              </div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title..."
                className="text-lg py-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 rounded-xl"
                required
              />
            </div>

            {/* Thumbnail Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900 dark:text-white">
                    Cover Image
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add a thumbnail for your blog</p>
                </div>
              </div>

              {thumbnailPreview ? (
                <div className="relative inline-block">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    width={300}
                    height={180}
                    className="rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload image</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Excerpt Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                  <AlignLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <Label htmlFor="excerpt" className="text-base font-semibold text-gray-900 dark:text-white">
                    Excerpt
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">A brief summary of your blog</p>
                </div>
              </div>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a short summary that appears in blog previews..."
                rows={3}
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 rounded-xl resize-none"
              />
            </div>

            {/* Tags Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <Label htmlFor="tags" className="text-base font-semibold text-gray-900 dark:text-white">
                    Tags
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add tags to help readers find your blog</p>
                </div>
              </div>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, javascript, web development (comma-separated)"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 rounded-xl"
              />
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900 dark:text-white">
                    Content
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Write your blog content below</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Start writing your amazing content..."
                  className="min-h-[400px]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-8 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50"
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Blog"
                  : "Create Blog"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/create-blog")}
              className="flex-1 sm:flex-none py-3 px-8 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
