"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefundPolicy() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Cancellation & Refund Policy
      </h1>
      <p className="text-gray-500 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-slate max-w-none">
        <p className="text-gray-600 leading-relaxed mb-6">
          At <strong>Mr. English Training Academy</strong>, we value your trust and are committed to
          providing quality spoken English training. Please read our refund terms carefully before enrolling.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. General Terms</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>All course fees are non-transferable.</li>
            <li>Refunds are only applicable as per the conditions below.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Eligibility for Refunds</h2>

          <h3 className="text-xl font-semibold mb-2 text-gray-700">Before Course Start:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
            <li>If you request a cancellation at least 7 days before the course start date, you will receive a 100% refund.</li>
            <li>If you cancel within 7 days but before the course starts, you will receive an 80% refund (20% retained as administrative charges).</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 text-gray-700">After Course Start:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
            <li>Once classes have begun or course materials have been shared, no refund will be issued.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 text-gray-700">Course Cancelled by Academy:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>If <strong>Mr. English Training Academy</strong> cancels a course or batch, you will receive a full refund of fees paid.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Refund Timeline</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Approved refunds will be processed within <strong>7–10 business days</strong> from the date of approval.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Refunds will be credited to the original mode of payment (bank account, UPI, card, etc.).
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. How to Request a Refund</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            To request a refund, please email us at <strong>info@themrenglish.com</strong> with the following details:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Your full name</li>
            <li>Course name</li>
            <li>Payment receipt or transaction details</li>
            <li>Reason for cancellation</li>
          </ul>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            For refund or cancellation-related queries, please contact:
          </p>
          <ul className="list-none text-gray-600 space-y-1">
            <li><strong>Mr. English Training Academy</strong></li>
            <li>Email: info@themrenglish.com</li>
            <li>Website: <a href="https://themrenglish.com" className="text-blue-600 hover:underline">https://themrenglish.com</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
