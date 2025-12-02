"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { Heart, Clock, User, ChevronRight, Search } from "lucide-react";
import { motion } from "framer-motion";

// Dummy blog data for English learning
const DUMMY_BLOGS = [
    // {
    //     id: 1,
    //     title: "10 Essential English Grammar Rules You Must Master",
    //     excerpt: "Learn the fundamental grammar rules that form the foundation of English communication. From tenses to articles, we break down complex concepts.",
    //     category: "Grammar",
    //     author: "Sarah Johnson",
    //     authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    //     readTime: 8,
    //     date: "2024-11-25",
    //     image: "https://images.unsplash.com/photo-1456406146555-c142cee21a51?w=600&h=400&fit=crop",
    //     content: "Master the essential grammar rules that will elevate your English proficiency...",
    //     likes: 234,
    //     isLiked: false,
    //     tags: ["Grammar", "Intermediate", "Rules"]
    // },
    // {
    //     id: 2,
    //     title: "Daily Vocabulary Builders: 20 Words to Enhance Your Lexicon",
    //     excerpt: "Expand your vocabulary with these 20 powerful words used in everyday English. Perfect for intermediate learners.",
    //     category: "Vocabulary",
    //     author: "Michael Chen",
    //     authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    //     readTime: 6,
    //     date: "2024-11-22",
    //     image: "https://images.unsplash.com/photo-1507842217343-583f20270057?w=600&h=400&fit=crop",
    //     content: "Building a strong vocabulary is key to becoming a confident English speaker...",
    //     likes: 189,
    //     isLiked: false,
    //     tags: ["Vocabulary", "Daily", "Learning"]
    // },
    // {
    //     id: 3,
    //     title: "Speaking Fluently: Overcome Common Pronunciation Mistakes",
    //     excerpt: "Stop making pronunciation errors that affect your communication. This guide covers the most common mistakes and how to fix them.",
    //     category: "Speaking",
    //     author: "Emma Wilson",
    //     authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    //     readTime: 10,
    //     date: "2024-11-20",
    //     image: "https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=600&h=400&fit=crop",
    //     content: "Pronunciation is crucial for effective communication in English...",
    //     likes: 412,
    //     isLiked: false,
    //     tags: ["Speaking", "Pronunciation", "Intermediate"]
    // },
    // {
    //     id: 4,
    //     title: "Writing Tips: How to Structure a Perfect Essay",
    //     excerpt: "Learn the structure and techniques to write compelling essays. From introduction to conclusion, master the art of essay writing.",
    //     category: "Writing",
    //     author: "David Brown",
    //     authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    //     readTime: 12,
    //     date: "2024-11-18",
    //     image: "https://images.unsplash.com/photo-1455390883262-48beede51552?w=600&h=400&fit=crop",
    //     content: "A well-structured essay is the foundation of effective written communication...",
    //     likes: 356,
    //     isLiked: false,
    //     tags: ["Writing", "Essays", "Advanced"]
    // },
    {
        id: 5,
        title: "Idioms That Native Speakers Use Daily",
        excerpt: "Discover common English idioms that will make you sound more like a native speaker. Perfect for conversational English.",
        category: "Vocabulary",
        author: "Jessica Lee",
        authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
        readTime: 7,
        date: "2024-11-15",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
        content: "Idioms are phrases or expressions whose meaning cannot be easily understood...",
        likes: 298,
        isLiked: false,
        tags: ["Idioms", "Slang", "Beginner"]
    },
    {
        id: 6,
        title: "Listening Skills: Improve Your English Comprehension",
        excerpt: "Enhance your listening abilities with proven techniques. Learn how to understand different accents and speaking speeds.",
        category: "Listening",
        author: "Robert Martinez",
        authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
        readTime: 9,
        date: "2024-11-12",
        image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=400&fit=crop",
        content: "Listening comprehension is one of the most challenging aspects of learning English...",
        likes: 267,
        isLiked: false,
        tags: ["Listening", "Comprehension", "All Levels"]
    },
    {
        id: 7,
        title: "Business English: Professional Communication Guide",
        excerpt: "Master business English terminology and communication styles. Essential for professional growth and career advancement.",
        category: "Business",
        author: "Amanda Foster",
        authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
        readTime: 11,
        date: "2024-11-10",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
        content: "In today's global business environment, proficiency in English is invaluable...",
        likes: 445,
        isLiked: false,
        tags: ["Business", "Professional", "Advanced"]
    },
    // {
    //     id: 8,
    //     title: "Tenses Explained: Simple Past, Present, and Future",
    //     excerpt: "Understand English tenses with clear examples and practical exercises. Master the basics that every English learner needs.",
    //     category: "Grammar",
    //     author: "Thomas Anderson",
    //     authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
    //     readTime: 8,
    //     date: "2024-11-08",
    //     image: "https://images.unsplash.com/photo-1434625885557-eb1149cebe00?w=600&h=400&fit=crop",
    //     content: "Tenses are the backbone of English grammar, allowing us to express time...",
    //     likes: 523,
    //     isLiked: false,
    //     tags: ["Tenses", "Grammar", "Beginner"]
    // }
];

const CATEGORIES = ["All", "Grammar", "Vocabulary", "Speaking", "Writing", "Listening", "Business"];

export default function Blogs() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [likedBlogs, setLikedBlogs] = useState(new Set<number>());
    const [selectedBlogId, setSelectedBlogId] = useState<number>(DUMMY_BLOGS[0].id);
    const leftColumnRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // scroll left column to top whenever selected blog changes
        if (leftColumnRef.current) leftColumnRef.current.scrollTop = 0;
    }, [selectedBlogId]);

    // Filter blogs based on category and search query
    const filteredBlogs = useMemo(() => {
        return DUMMY_BLOGS.filter((blog) => {
            const categoryMatch = selectedCategory === "All" || blog.category === selectedCategory;
            const searchMatch =
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return categoryMatch && searchMatch;
        });
    }, [selectedCategory, searchQuery]);

    const toggleLike = (id: number) => {
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

    const selectedBlog = DUMMY_BLOGS.find((b) => b.id === selectedBlogId) || DUMMY_BLOGS[0];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header Section */}
            <div className="bg-white text-gray-900 py-10 border-b border-yellow-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">
                            Mr English — Learning Blog
                        </h1>
                        <p className="text-sm sm:text-base text-yellow-600 max-w-2xl mx-auto">
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
                        <Search className="absolute left-4 top-3.5 text-yellow-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search blogs by title, keyword, or tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-yellow-200 bg-white text-gray-900 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end w-full lg:w-auto">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedCategory === category
                                        ? "bg-yellow-500 text-black"
                                                : "bg-transparent border border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Active Blog (span 2 cols on large screens) */}
                            <div className="lg:col-span-2" ref={leftColumnRef}>
                        <motion.article
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                                    <div className="relative h-72 md:h-96 bg-gray-100">
                                <img
                                    src={selectedBlog.image}
                                    alt={selectedBlog.title}
                                    onError={handleImgError}
                                            className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                            <span className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                                        {selectedBlog.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedBlog.title}</h2>
                                        <p className="text-sm text-gray-500 mb-4">By {selectedBlog.author} • {new Date(selectedBlog.date).toLocaleDateString()}</p>

                                        <div className="prose max-w-none text-gray-800">
                                            <p>{selectedBlog.content}</p>
                                            <p>Read time: {selectedBlog.readTime} minutes</p>
                                            <hr className="my-4 border-yellow-100" />
                                    <p>
                                        {/* Expand the content a bit for the detailed view */}
                                        {selectedBlog.content} — This article dives deeper into examples, exercises and practical tips. Use these lessons in daily practice to see improvement quickly.
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                                <img src={selectedBlog.authorImage} alt={selectedBlog.author} className="w-10 h-10 rounded-full" onError={handleImgError} />
                                        <div>
                                            <div className="text-sm font-medium">{selectedBlog.author}</div>
                                                    <div className="text-xs text-gray-500">{new Date(selectedBlog.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{selectedBlog.readTime} min</span>
                                        </div>
                                                <button
                                                    onClick={() => toggleLike(selectedBlog.id)}
                                                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${likedBlogs.has(selectedBlog.id) ? 'bg-yellow-500 text-black' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    <Heart className="w-4 h-4 inline-block mr-2" /> {selectedBlog.likes + (likedBlogs.has(selectedBlog.id) ? 1 : 0)} Like
                                                </button>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    </div>

                    {/* Right: Blog List */}
                    <aside className="lg:col-span-1">
                        <div className="space-y-4">
                            {filteredBlogs.map((blog) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex gap-3 items-center p-3 rounded-lg cursor-pointer transition-shadow ${
                                        blog.id === selectedBlogId ? 'bg-yellow-50 ring-1 ring-yellow-300' : 'bg-white shadow-sm'
                                    }`}
                                    onClick={() => setSelectedBlogId(blog.id)}
                                >
                                    <div className="w-20 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                        <img src={blog.image} alt={blog.title} onError={handleImgError} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-semibold ${blog.id === selectedBlogId ? 'text-yellow-600' : 'text-gray-900'}`}>{blog.title}</h4>
                                        <p className="text-xs text-gray-500">{blog.author} • {blog.readTime} min</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </aside>
                </div>

                {/* Footer link */}
                <div className="mt-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 bg-white text-gray-600 py-8 text-center border-t border-yellow-100">
                <p className="text-sm">© {new Date().getFullYear()} Mr English Training Academy. All rights reserved.</p>
            </footer>
        </div>
    );
}
