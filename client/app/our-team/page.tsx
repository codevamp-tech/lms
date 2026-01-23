"use client";

import { ArrowLeft, Award, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OurTeam() {
    const router = useRouter();
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trainers`);
                if (response.data.success) {
                    setInstructors(response.data.trainers);
                }
            } catch (error) {
                console.error("Failed to fetch instructors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    const gallery = [
        "/images/gallery/1.jpg",
        "/images/gallery/2.jpg",
        "/images/gallery/3.jpg",
        "/images/gallery/4.jpg",
        "/images/gallery/5.jpg",
        "/images/gallery/6.jpg",
    ];

    if (loading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
                <p>Loading team...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4 sm:mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm sm:text-base">Back</span>
            </button>
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">Course Instructors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {instructors.length > 0 ? (
                        instructors.map((inst) => (
                            <div key={inst._id || inst.email} className="text-center">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-gray-100">
                                    {/* replace with next/image paths in production if using internal images */}
                                    <img
                                        src={inst.photoUrl || "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Aafreen-Nissar.png"} // Fallback image
                                        alt={inst.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="mt-2 text-xs sm:text-sm lg:text-base text-gray-800 font-medium">{inst.name}</div>
                                <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">{inst.expertise}</div>
                                <div className="space-y-1 sm:space-y-2 lg:space-y-3 text-xs sm:text-sm">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Award className="w-4 h-4" />
                                        <span>{inst.experience} Experience</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        <span>{inst.studentsTaught} Students Taught</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold text-foreground">{inst.rating}/5.0</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">No instructors found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
