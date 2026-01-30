"use client";

import { ArrowLeft, Award, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OurTeam() {
    const router = useRouter();
    const instructors = [
        {
            name: "Aafreen Nissar",
            title: "IELTS & TOEFL Expert",
            img: "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Aafreen-Nissar.png",
            experience: "3+ years",
            students: "1350+",
            rating: 4.8
        },
        {
            name: "Mir Mohammad Wahid",
            title: "Business English Specialist",
            img: "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Mir-Wahid.png",
            experience: "3+ years",
            students: "1400+",
            rating: 4.9
        },
        {
            name: "Waqas Masoodi",
            title: "IELTS & TOEFL Expert",
            img: "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Waqas-Masoodi.png",
            experience: "2+ years",
            students: "1300+",
            rating: 4.7
        },
        {
            name: "Mir Tazeem",
            title: "Business English Specialist",
            img: "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Mir-Tazeem.png",
            experience: "1+ years",
            students: "1200+",
            rating: 4.8
        },
        {
            name: "Mursaleen Nisar",
            title: "Conversation & Fluency Coach",
            img: "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Mursaleen-Nisar-1.png",
            experience: "3+ years",
            students: "1300+",
            rating: 4.8
        },
        {
            name: "Aman Gowhar",
            title: "Conversation & Fluency Coach",
            img: "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Aman-Gowhar.png",
            experience: "1+ years",
            students: "1200+",
            rating: 4.7
        },
        {
            name: "Asra Rehman",
            title: "Business English Specialist",
            img: "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Asra-Rehman.png",
            experience: "2+ years",
            students: "1300+",
            rating: 4.8
        },
        {
            name: "Tufail",
            title: "Conversation & Fluency Coach",
            img: "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Tufail.png",
            experience: "3+ years",
            students: "1400+",
            rating: 4.7
        },
        {
            name: "Zubana Zair",
            title: "Conversation & Fluency Coach",
            img: "https://cornflowerblue-snake-295407.hostingersite.com/wp-content/uploads/2025/07/Zubana-Zair.png",
            experience: "2+ years",
            students: "1250+",
            rating: 4.8
        },
    ];
    const gallery = [
        "/images/gallery/1.jpg",
        "/images/gallery/2.jpg",
        "/images/gallery/3.jpg",
        "/images/gallery/4.jpg",
        "/images/gallery/5.jpg",
        "/images/gallery/6.jpg",
    ];
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">Course Instructors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {instructors.map((inst) => (
                        <div key={inst.name} className="text-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-gray-100">
                                {/* replace with next/image paths in production */}
                                <img src={inst.img} alt={inst.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="mt-2 text-xs sm:text-sm lg:text-base text-gray-800 font-medium">{inst.name}</div>
                            <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">{inst.title}</div>
                            <div className="space-y-1 sm:space-y-2 lg:space-y-3 text-xs sm:text-sm">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                    <Award className="w-4 h-4" />
                                    <span>{inst.experience} Experience</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>{inst.students} Students Taught</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-foreground">{inst.rating}/5.0</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}