"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { Heart, Clock, ChevronRight, Search, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePublishedBlogs } from "@/hooks/useBlogs";
import { Blog } from "@/features/api/blogs/route";

const CATEGORIES = ["All", "Grammar", "Vocabulary", "Speaking", "Writing", "Listening", "Business"];

export default function Blogs() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [likedBlogs, setLikedBlogs] = useState(new Set<string>());
    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
    const leftColumnRef = useRef<HTMLDivElement | null>(null);

    // Fetch published blogs from API
    const { data: blogsData, isLoading, isError } = usePublishedBlogs(1, 50);

    const blogs = blogsData?.blogs || [];

    // Set initial selected blog when data loads
    useEffect(() => {
        if (blogs.length > 0 && !selectedBlogId) {
            setSelectedBlogId(blogs[0]._id);
        }
    }, [blogs, selectedBlogId]);

    useEffect(() => {
        // scroll left column to top whenever selected blog changes
        if (leftColumnRef.current) leftColumnRef.current.scrollTop = 0;
    }, [selectedBlogId]);

    // Filter blogs based on category and search query
    const filteredBlogs = useMemo(() => {
        return blogs.filter((blog) => {
            const categoryMatch = selectedCategory === "All" || blog.category === selectedCategory;
            const searchMatch =
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                (blog.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);
            return categoryMatch && searchMatch;
        });
    }, [blogs, selectedCategory, searchQuery]);

    const toggleLike = (id: string) => {
        setLikedBlogs((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleImgError = (e: any) => {
        e.currentTarget.src = "https://via.placeholder.com/900x500?text=Mr+English+Blog";
    };

    const selectedBlog = blogs.find((b) => b._id === selectedBlogId) || blogs[0];

    // Calculate read time based on content length (rough estimate: 200 words per minute)
    const calculateReadTime = (content: string) => {
        const wordCount = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(wordCount / 200));
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
                    <p className="text-gray-600">Loading blogs...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Failed to load blogs</p>
                    <button
                        onClick={() => router.refresh()}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (blogs.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 sm:mb-6 group p-4"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm sm:text-base">Back</span>
                </button>
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-gray-500 text-lg">No blogs published yet.</p>
                    <p className="text-gray-400 mt-2">Check back later for new content!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 sm:mb-6 group p-4"
            >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm sm:text-base">Back</span>
            </button>

            {/* Header Section */}
            <div className="bg-white text-gray-900 py-10 border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-gray-900">
                            Mr English — Learning Blog
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            Tips, lessons and insights to master English — grammar, speaking, vocabulary and more.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content: Left = Open Post, Right = List */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search + Filters */}
                <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full lg:w-2/3">
                        <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search blogs by title, keyword, or tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end w-full lg:w-auto">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                    ? "bg-gray-900 text-white"
                                    : "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredBlogs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No blogs found matching your search criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Active Blog (span 2 cols on large screens) */}
                        <div className="lg:col-span-2" ref={leftColumnRef}>
                            {selectedBlog && (
                                <motion.article
                                    key={selectedBlog._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                                >
                                    <div className="relative h-72 md:h-96 bg-gray-100">
                                        <img
                                            src={selectedBlog.thumbnail || "https://via.placeholder.com/900x500?text=Mr+English+Blog"}
                                            alt={selectedBlog.title}
                                            onError={handleImgError}
                                            className="w-full h-full object-cover"
                                        />
                                        {selectedBlog.category && (
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                    {selectedBlog.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedBlog.title}</h2>
                                        <p className="text-sm text-gray-500 mb-4">
                                            By {selectedBlog.author?.name || "Unknown Author"} • {formatDate(selectedBlog.publishedAt || selectedBlog.createdAt)}
                                        </p>

                                        <div className="blog-content text-gray-800">

                                            {selectedBlog.excerpt && (
                                                <p className="text-lg text-gray-600 mb-4">{selectedBlog.excerpt}</p>
                                            )}
                                            <div
                                                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                                                className="blog-content"
                                            />
                                        </div>

                                        <div className="mt-6 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={selectedBlog.author?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedBlog.author?.name || 'user'}`}
                                                    alt={selectedBlog.author?.name || "Author"}
                                                    className="w-10 h-10 rounded-full"
                                                    onError={handleImgError}
                                                />
                                                <div>
                                                    <div className="text-sm font-medium">{selectedBlog.author?.name || "Unknown Author"}</div>
                                                    <div className="text-xs text-gray-500">{formatDate(selectedBlog.publishedAt || selectedBlog.createdAt)}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{calculateReadTime(selectedBlog.content)} min</span>
                                                </div>
                                                <button
                                                    onClick={() => toggleLike(selectedBlog._id)}
                                                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${likedBlogs.has(selectedBlog._id) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
                                                >
                                                    <Heart className={`w-4 h-4 inline-block mr-2 ${likedBlogs.has(selectedBlog._id) ? 'fill-current' : ''}`} />
                                                    Like
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                                            <div className="mt-6 flex flex-wrap gap-2">
                                                {selectedBlog.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.article>
                            )}
                        </div>

                        {/* Right: Blog List */}
                        <aside className="lg:col-span-1">
                            <div className="space-y-4">
                                {filteredBlogs.map((blog) => (
                                    <motion.div
                                        key={blog._id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25 }}
                                        whileHover={{ scale: 1.02 }}
                                        className={`flex gap-3 items-center p-3 rounded-lg cursor-pointer transition-shadow ${blog._id === selectedBlogId ? 'bg-gray-100 ring-1 ring-gray-400' : 'bg-white shadow-sm'
                                            }`}
                                        onClick={() => setSelectedBlogId(blog._id)}
                                    >
                                        <div className="w-20 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                            <img
                                                src={blog.thumbnail || "https://via.placeholder.com/200x120?text=Blog"}
                                                alt={blog.title}
                                                onError={handleImgError}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`text-sm font-semibold line-clamp-2 ${blog._id === selectedBlogId ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {blog.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {blog.author?.name || "Unknown"} • {calculateReadTime(blog.content)} min
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </aside>
                    </div>
                )}

                {/* Footer link */}
                <div className="mt-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 bg-white text-gray-600 py-8 text-center border-t border-gray-200">
                <p className="text-sm">© {new Date().getFullYear()} Mr English Training Academy. All rights reserved.</p>
            </footer>
        </div>
    );
}
