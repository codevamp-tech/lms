"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContactUs() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<{ type: "idle" | "sending" | "success" | "error"; message?: string }>(
    { type: "idle" }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "sending" });

    try {
      // Try to post to an API route (implement on your server). If you don't have an API, you can replace
      // the fetch URL with a mailto fallback or other integration.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus({ type: "success", message: "Thanks — we received your message and will get back to you soon." });
        setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus({ type: "error", message: data?.error || "Something went wrong. Please try again later." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error. Please try again later." });
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Contact Us</h1>
        <p className="text-gray-600">Have questions? Don&apos;t hesitate to contact us</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Enter Your First Name"
                required
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Enter Your Last Name"
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address"
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone / Mobile</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Mobile Number"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your message here"
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status.type === "sending"}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {status.type === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status.type === "success" && <p className="text-green-600">{status.message}</p>}
            {status.type === "error" && <p className="text-red-600">{status.message}</p>}
          </div>
        </form>

        {/* Contact Details + Map */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-3">Our Location</h3>
            <p className="text-gray-700">Mr English Training Academy<br />Namblabal, Pampore</p>

            <h4 className="mt-4 font-semibold">Quick Contact</h4>
            <p className="text-gray-700">Email: <a href="mailto:amangowhar@gmail.com" className="text-blue-600 hover:underline">amangowhar@gmail.com</a></p>
            <p className="text-gray-700">Phone: <a href="tel:+917006138299" className="text-blue-600 hover:underline">+91 70061 38299</a>, <a href="tel:+919906933270" className="text-blue-600 hover:underline">+91 99069 33270</a></p>

            <div className="mt-4">
              <a
                href={encodeURI("https://www.google.com/maps/search/?api=1&query=Mr+English+Training+Academy+Namblabal+Pampore+Near+MEI+School+Pampore+Jammu+and+Kashmir+192121")}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="bg-white p-0 overflow-hidden rounded-2xl shadow">
            {/* Live Map Embed */}
            <iframe
              title="Mr English Training Academy - Map"
              src={"https://www.google.com/maps?q=Mr+English+Training+Academy+Namblabal+Pampore+Near+MEI+School+Pampore+Jammu+and+Kashmir+192121&output=embed"}
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Mr English Training Academy. All rights reserved.
      </footer>
    </div>
  );
}
