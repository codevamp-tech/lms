"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useCreateBlog, useUpdateBlog, useBlogById } from "@/hooks/useBlogs";
import { getUserIdFromToken } from "@/utils/helpers";
import toast from "react-hot-toast";
import Image from "next/image";
import { Upload, X } from "lucide-react";

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
    const [isPublished, setIsPublished] = useState(false);
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
            setIsPublished(blog.isPublished || false);
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

            router.push("/admin/blogs");
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
        "list",        // ✅ only list
        "indent",
        "link",
        "image",
        "video",
        "color",
        "background",
        "align",
    ];


    if (isEdit && blogLoading) {
        return <div>Loading blog...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? "Edit Blog" : "Create New Blog"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter blog title"
                        required
                    />
                </div>

                {/* Thumbnail */}
                <div className="space-y-2">
                    <Label>Thumbnail</Label>
                    <div className="flex items-center gap-4">
                        {thumbnailPreview ? (
                            <div className="relative">
                                <Image
                                    src={thumbnailPreview}
                                    alt="Thumbnail preview"
                                    width={200}
                                    height={120}
                                    className="rounded-lg object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={removeThumbnail}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary of the blog"
                        rows={3}
                    />
                </div>

                {/* Category */}
                {/* <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Technology, Education, News"
                    />
                </div>  */}

                {/* Tags */}
                <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Comma-separated tags (e.g., react, javascript, web)"
                    />
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <Label>Content *</Label>
                    <div className="bg-white dark:bg-gray-900 rounded-lg">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            placeholder="Write your blog content here..."
                            className="h-96"
                        />
                    </div>
                </div>

                {/* Publish Toggle */}
                {isEdit && (
                    <div className="flex items-center space-x-2 pt-12">
                        <Switch
                            id="publish"
                            checked={isPublished}
                            onCheckedChange={setIsPublished}
                        />
                        <Label htmlFor="publish">
                            {isPublished ? "Published" : "Draft"}
                        </Label>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-14">
                    <Button type="submit" disabled={isSubmitting}>
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
                        onClick={() => router.push("/admin/blogs")}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;
