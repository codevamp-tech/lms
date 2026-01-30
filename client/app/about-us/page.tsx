"use client";

import { ArrowLeft, Award, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { getInitials } from "../../lib/utils";


export default function AboutUs() {
    const router = useRouter();

    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trainers/active`);
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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-6xl">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4 sm:mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm sm:text-base">Back</span>
            </button>

            {/* Breadcrumb */}
            <nav className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4" aria-label="Breadcrumb">
                Home <span className="mx-2">»</span> About Us
            </nav>

            <header className="mb-6 sm:mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">About Us</h1>
                <p className="text-base sm:text-lg text-gray-600">Where Passion Meets Purpose</p>
            </header>

            <section className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">Our Story</h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                    Mr. English Training Academy was founded with a vision: to enable individuals in Jammu & Kashmir to find their voice,
                    sharpen their identity, and build a future full of possibilities. In a region with immense potential, we realized that many young
                    minds were being held back by a lack of communication skills, low self-confidence, and limited exposure. We decided to change that.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    With humble beginnings and a big dream, we started our first center in Namblabal, Pampore. Today, we operate in Pulwama, Tral, Awantipora,
                    and Bijbehara, training students from all walks of life — from school and college students to business owners and working professionals.
                </p>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3">Why Choose Mr. English Training Academy?</h3>
                        <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-sm sm:text-base text-gray-700">
                            <li>Proven Track Record of Success</li>
                            <li>Experienced & Passionate Trainers</li>
                            <li>Personalized Attention for Every Learner</li>
                            <li>Practical speaking-first methodology</li>
                        </ul>
                    </div>

                </div>

                <aside className="space-y-4 sm:space-y-6">
                    <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow text-center">
                        <h4 className="text-lg sm:text-xl font-semibold mb-2">Support</h4>
                        <p className="text-gray-700">Email: <a href="mailto:info@themrenglisgacademy.com" className="text-blue-600 hover:underline">info@themrenglisgacademy.com</a></p>
                        <p className="text-gray-700">Phone: <a href="tel:+917006138299" className="text-blue-600 hover:underline">+91 70061 38299</a></p>
                        <p className="text-gray-700">+91 99069 33270</p>

                        <div className="mt-4">
                            <a
                                href={encodeURI("https://www.google.com/maps/search/?api=1&query=Mr+English+Training+Academy+Namblabal+Pampore")}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Open in Google Maps
                            </a>
                        </div>
                    </div>
                </aside>

            </section>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3">Course Instructors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                    {instructors.map((inst: any) => (
                        <div key={inst._id || inst.name} className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full overflow-hidden bg-gray-100">
                                {inst.photoUrl ? (
                                    <img src={inst.photoUrl} alt={inst.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl lg:text-3xl font-bold">
                                        {getInitials(inst.name)}
                                    </div>
                                )}
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
                    ))}
                </div>
            </div>

            <footer className="mt-12 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Mr English Training Academy. All rights reserved.
            </footer>
        </div>
    );
}
