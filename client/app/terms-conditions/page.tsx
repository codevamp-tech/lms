"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsConditions() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>
      
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Terms & Conditions</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to Mr. English Training Academy. By accessing and using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>&quot;Website&quot; refers to Mr. English Training Academy&apos;s online platform</li>
            <li>&quot;Services&quot; refers to our educational courses and related materials</li>
            <li>&quot;User,&quot; &quot;You,&quot; and &quot;Your&quot; refers to students and website visitors</li>
            <li>&quot;We,&quot; &quot;Us,&quot; and &quot;Our&quot; refers to Mr. English Training Academy</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. User Account</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>You must be at least 13 years old to create an account</li>
            <li>You are responsible for maintaining account security</li>
            <li>Accurate and complete information must be provided</li>
            <li>Account sharing is not permitted</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Course Enrollment</h2>
          <p className="text-gray-600 leading-relaxed">
            By enrolling in our courses:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
            <li>You agree to pay the specified fees</li>
            <li>Access is for personal, non-commercial use</li>
            <li>Course materials cannot be shared or distributed</li>
            <li>Enrollment may be subject to prerequisites</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed">
            All content on our platform is protected by copyright and other intellectual property rights:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
            <li>Course materials are our exclusive property</li>
            <li>Unauthorized reproduction is prohibited</li>
            <li>Users may not modify or redistribute content</li>
            <li>Trademarks and logos are protected</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. User Conduct</h2>
          <p className="text-gray-600 leading-relaxed">
            Users must:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
            <li>Respect other users and instructors</li>
            <li>Not engage in disruptive behavior</li>
            <li>Not attempt to breach website security</li>
            <li>Not use the platform for unauthorized purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed">
            For questions about these Terms & Conditions, please contact us at:
          </p>
          <ul className="list-none mt-4 space-y-2 text-gray-600">
            <li>Email: info@mrenglisgacademy.com</li>
            <li>Phone: +917006138299, +919906933270</li>
            <li>Address: Mr English Training Academy Namblabal Pampore</li>
          </ul>
        </section>
      </div>
    </div>
  );
}