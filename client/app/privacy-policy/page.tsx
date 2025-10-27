"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
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
      
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to Mr. English Training Academy. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect and process the following information when you use our services:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
            <li>Personal identification information (Name, email address, phone number)</li>
            <li>Educational background and learning preferences</li>
            <li>Course progress and performance data</li>
            <li>Payment and transaction information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use the collected information for:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
            <li>Providing and improving our educational services</li>
            <li>Processing your course enrollments and payments</li>
            <li>Communicating with you about courses and updates</li>
            <li>Personalizing your learning experience</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted and stored securely.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
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