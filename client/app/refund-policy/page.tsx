"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefundPolicy() {
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
      
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Refund & Cancellation Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Course Refund Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            At Mr. English Training Academy, we strive to provide high-quality education and ensure student satisfaction. Our refund policy is designed to be fair and transparent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Refund Eligibility</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Refund requests must be made within 7 days of course purchase</li>
            <li>The course content must not have been accessed more than 25%</li>
            <li>Valid reasons for refund must be provided</li>
            <li>Original payment proof must be submitted</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Cancellation Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            Course enrollments can be cancelled:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
            <li>Within 24 hours of purchase for full refund</li>
            <li>Before accessing any course content</li>
            <li>Subject to administrative review</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Refund Process</h2>
          <p className="text-gray-600 leading-relaxed">
            The refund process typically takes 5-7 business days:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
            <li>Submit refund request through our support system</li>
            <li>Provide necessary documentation</li>
            <li>Refund will be processed to original payment method</li>
            <li>Confirmation email will be sent once processed</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Non-Refundable Items</h2>
          <p className="text-gray-600 leading-relaxed">
            The following are not eligible for refund:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
            <li>Completed courses</li>
            <li>Downloaded course materials</li>
            <li>Special promotional offers</li>
            <li>Bundle discounts</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed">
            For refund requests or questions about this policy, please contact us at:
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