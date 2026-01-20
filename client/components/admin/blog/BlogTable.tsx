"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useBlogs, useDeleteBlog, useTogglePublishBlog } from "@/hooks/useBlogs";
import { Edit, Trash2, X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Blog } from "@/features/api/blogs/route";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const BlogTable = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

    const { data, isLoading, error } = useBlogs(currentPage, ITEMS_PER_PAGE);
    const deleteMutation = useDeleteBlog();
    const togglePublishMutation = useTogglePublishBlog();

    const blogs = data?.blogs ?? [];
    const totalPages = data?.totalPages ?? 1;

    const filteredBlogs = blogs.filter((blog: Blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleNavigateToCreate = () => {
        router.push("/admin/blogs/create");
    };

    const handleNavigateToEdit = (id: string) => {
        router.push(`/admin/blogs/${id}`);
    };

    const handleSuggestionClick = (title: string) => {
        setSearchTerm(title);
        setShowSuggestions(false);
    };

    const clearSearch = () => setSearchTerm("");

    const openDeleteDialog = (blog: Blog) => {
        setBlogToDelete(blog);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!blogToDelete) return;

        try {
            await deleteMutation.mutateAsync(blogToDelete._id);
            toast.success("Blog deleted successfully");
            setDeleteDialogOpen(false);
            setBlogToDelete(null);
        } catch (error) {
            toast.error("Failed to delete blog");
        }
    };

    const handleTogglePublish = async (blogId: string, currentStatus: boolean) => {
        try {
            await togglePublishMutation.mutateAsync({
                blogId,
                publish: !currentStatus,
            });
            toast.success(`Blog ${!currentStatus ? "published" : "unpublished"} successfully`);
        } catch (error) {
            toast.error("Failed to update blog status");
        }
    };

    if (isLoading) {
        return <div>Loading blogs...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <Button onClick={handleNavigateToCreate}>Create New Blog</Button>
                <div className="flex-1 flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search blogs by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showSuggestions && searchTerm && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredBlogs.map((blog: Blog) => (
                                    <div
                                        key={blog._id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onMouseDown={() => handleSuggestionClick(blog.title)}
                                    >
                                        {blog.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {searchTerm && (
                        <Button variant="ghost" size="sm" onClick={clearSearch} className="px-2">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <Table>
                <TableCaption>
                    {searchTerm && filteredBlogs.length === 0
                        ? "No blogs found. Try a different search."
                        : blogs.length === 0
                            ? "No blogs here. Start by creating your first blog."
                            : "A list of your blogs."}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(searchTerm ? filteredBlogs : blogs).map((blog: Blog) => (
                        <TableRow key={blog._id}>
                            <TableCell className="font-medium">{blog.title}</TableCell>
                            <TableCell>{blog.category || "—"}</TableCell>
                            <TableCell>
                                <Badge>{blog.isPublished ? "Published" : "Draft"}</Badge>
                            </TableCell>
                            <TableCell>
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
                                        title={blog.isPublished ? "Unpublish" : "Publish"}
                                    >
                                        {blog.isPublished ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleNavigateToEdit(blog._id)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500"
                                        onClick={() => openDeleteDialog(blog)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Blog</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{blogToDelete?.title}"? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center mt-4 gap-3">
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={handlePreviousPage}
                    >
                        Previous
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={handleNextPage}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BlogTable;
