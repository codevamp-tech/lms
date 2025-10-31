"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
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
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Effective Date: 24-06-2025</p>

      <div className="prose prose-slate max-w-none">
        <p className="text-gray-600 leading-relaxed mb-6">
          Welcome to <strong>themrenglish.com</strong> (“we”, “our”, or “us”). Your privacy is very important to us. 
          This Privacy Policy outlines how we collect, use, protect, and disclose your personal information when 
          you visit our website and use our services.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may collect and process the following types of personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              <strong>Personal Identification Information:</strong> Name, email address, phone number, and any other information you voluntarily provide through forms or account registration.
            </li>
            <li>
              <strong>Payment Information:</strong> If you make purchases, we may collect billing details via secure third-party payment processors.
            </li>
            <li>
              <strong>Usage Data:</strong> IP address, browser type, device type, pages visited, time on site, and other analytics via tools like Google Analytics.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> For improving user experience and functionality (see “Cookies” below).
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>To provide and manage our English language learning services</li>
            <li>To respond to your inquiries and customer service requests</li>
            <li>To process payments and send transactional communications</li>
            <li>To send updates, newsletters, or promotional content (you can opt out anytime)</li>
            <li>To improve our website and user experience through analytics</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Sharing Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We do not sell, rent, or trade your personal data. We may share your data with trusted third parties only when necessary:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Payment processors (e.g., Stripe, PayPal)</li>
            <li>Email marketing tools (e.g., Mailchimp, ConvertKit)</li>
            <li>Analytics providers (e.g., Google Analytics)</li>
            <li>Legal authorities, if required by law</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We take appropriate technical and organizational measures to protect your data. While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Access and review the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            To exercise any of these rights, please contact us at <strong>info@themrenglish.com</strong>.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website uses cookies to enhance user experience. You can choose to disable cookies through your browser settings, but some features may not function properly.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Third-Party Links</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website may contain links to external websites. We are not responsible for the privacy practices of those websites and encourage you to read their privacy policies.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Children’s Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Changes to This Privacy Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this policy occasionally. Any changes will be posted on this page with a new effective date.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact:
          </p>
          <ul className="list-none text-gray-600 space-y-1">
            <li><strong>Mr. English</strong></li>
            <li>Email: info@themrenglish.com</li>
            <li>Website: <a href="https://themrenglish.com" className="text-blue-600 hover:underline">https://themrenglish.com</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
