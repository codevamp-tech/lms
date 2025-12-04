"use client"

import type React from "react"
import { Mail, Phone, MapPin, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ContactUs() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" })
  const [status, setStatus] = useState<{ type: "idle" | "sending" | "success" | "error"; message?: string }>({
    type: "idle",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "sending" });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.firstName + " " + form.lastName,
          email: form.email,
          whatsapp: form.phone,
          message: form.message,
          type: "Contact",
        }),
      });

      if (res.ok) {
        setStatus({ type: "success", message: "Your enquiry has been submitted successfully!" });
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-5xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-foreground">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions about our training programs? We&apos;d love to hear from you.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-semibold text-foreground">
                  First Name <span className="text-primary">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="John"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-semibold text-foreground">
                  Last Name <span className="text-primary">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Email <span className="text-primary">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
                Phone / Mobile
              </label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-foreground">
                Message <span className="text-primary">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your inquiry..."
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={status.type === "sending"}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                {status.type === "sending" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>

              {status.type === "success" && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-100 border border-green-300">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                  <p className="text-sm text-green-700">{status.message}</p>
                </div>
              )}

              {status.type === "error" && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-100 border border-red-300">
                  <AlertCircle className="w-5 h-5 text-red-700" />
                  <p className="text-sm text-red-700">{status.message}</p>
                </div>
              )}
            </div>
          </form>

          {/* RIGHT SIDE CONTACT CARD (unchanged) */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Our Location</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Mr English Training Academy <br />
                    <span className="text-xs">Namblabal, Pampore</span> <br />
                    <span className="text-xs">Jammu & Kashmir</span>
                  </p>
                </div>
              </div>

              <a
                href={encodeURI(
                  "https://www.google.com/maps/search/?api=1&query=Mr+English+Training+Academy+Namblabal+Pampore+Near+MEI+School+Pampore+Jammu+and+Kashmir+192121"
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm"
              >
                Open in Maps
              </a>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a
                    href="https://mail.google.com/mail/?view=cm&to=info@themrenglisgacademy.com"
                    className="text-sm text-primary hover:underline"
                  >
                    info@themrenglisgacademy.com
                  </a>



                </div>
              </div>
            </div>


            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <div className="space-y-1">
                    <div>
                      <a href="tel:+917006138299" className="block text-sm text-primary hover:underline">
                        +91 70061 38299
                      </a>
                      <a
                        href={encodeURI("https://wa.me/917006138299?text=Hello%20Mr%20English%20Training%20Academy")}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mt-1 text-sm text-white bg-[#25D366] px-3 py-1 rounded-lg hover:opacity-90"
                      >
                        Chat on WhatsApp
                      </a>
                    </div>

                    <div>
                      <a href="tel:+919906933270" className="block text-sm text-primary hover:underline">
                        +91 99069 33270
                      </a>
                      <a
                        href={encodeURI("https://wa.me/919906933270?text=Hello%20Mr%20English%20Training%20Academy")}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mt-1 text-sm text-white bg-[#25D366] px-3 py-1 rounded-lg hover:opacity-90"
                      >
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </main>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <iframe
            title="Mr English Training Academy - Map"
            src="https://www.google.com/maps?q=Mr+English+Training+Academy+Namblabal+Pampore+Near+MEI+School+Pampore+Jammu+and+Kashmir+192121&output=embed"
            width="100%"
            height="400"
            className="w-full"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>

        <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mr English Training Academy. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
