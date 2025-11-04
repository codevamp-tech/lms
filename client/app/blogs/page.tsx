"use client";

import Link from "next/link";


export default function Blogs() {


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-2xl font-semibold mb-3">Blogs</h3>
            </div>
            <Link
                href="/"
                className="text-blue-900 hover:text-blue-400 transition-colors duration-200 text-sm"
            >
                Go back to home
            </Link>
            <footer className="mt-12 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Mr English Training Academy. All rights reserved.
            </footer>
        </div>
    );
}
