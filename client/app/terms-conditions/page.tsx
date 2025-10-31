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
        <p className="mb-6 text-gray-600">Effective Date: 24-06-2025</p>
        <p className="mb-8 text-gray-600">
          Website:{" "}
          <a
            href="https://themrenglish.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://themrenglish.com
          </a>
        </p>

        <p className="text-gray-600 leading-relaxed mb-8">
          Please read these Terms and Conditions (“Terms”, “Terms and Conditions”) carefully before using the{" "}
          <strong>themrenglish.com</strong> website operated by <strong>Mr. English</strong> (“we”, “us”, or “our”).
          By accessing or using this website, you agree to be bound by these Terms. If you disagree with any part of
          the terms, please do not use our services.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Use of the Website</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>You must be at least 13 years old to use this website.</li>
            <li>
              You agree to use the website only for lawful purposes and in a way that does not infringe the rights of
              others or restrict their use.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Services Offered</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We offer English language coaching, training programs, and other educational content through this website.
            Access to some services may require payment or account registration.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify or discontinue any part of our services without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Payments and Refunds</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Payments for courses or services are processed securely via third-party payment gateways.</li>
            <li>All prices are listed in INR and are subject to change without notice.</li>
            <li>
              Refunds are offered only according to our{" "}
              <a href="/refund-policy" className="text-blue-600 hover:underline">
                Refund Policy
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>You may be required to create an account to access certain services.</li>
            <li>You are responsible for maintaining the confidentiality of your account information.</li>
            <li>
              We reserve the right to suspend or terminate your account if you violate these Terms and Conditions.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            All content on{" "}
            <a
              href="https://themrenglish.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              themrenglish.com
            </a>
            , including videos, text, images, logos, and course material, is the property of Mr. English or its content
            creators and is protected by copyright laws.
          </p>
          <p className="text-gray-600 leading-relaxed">
            You may not reproduce, distribute, or resell any part of the website’s content without written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            We strive to provide accurate and effective content, but we make no guarantees about results. Your use of
            the website and services is at your own risk. We are not liable for any direct, indirect, or incidental
            damages resulting from your use of our website or services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Third-Party Links</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the content, terms, or
            privacy practices of these websites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Termination</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to terminate or suspend access to our website or services immediately, without prior
            notice, for conduct that we believe violates these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Changes to These Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            We may revise these Terms from time to time. Any changes will be posted on this page with an updated
            effective date. Your continued use of the website after changes implies acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you have any questions about these Terms and Conditions, please contact:
          </p>
          <ul className="list-none space-y-2 text-gray-600">
            <li>
              <strong>Mr. English</strong>
            </li>
            <li>
              Email:{" "}
              <a href="mailto:info@themrenglish.com" className="text-blue-600 hover:underline">
                info@themrenglish.com
              </a>
            </li>
            <li>
              Website:{" "}
              <a
                href="https://themrenglish.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://themrenglish.com
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
