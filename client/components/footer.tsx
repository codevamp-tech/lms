"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function LMSFooter() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info Column */}
          <div>
            <div className="mb-6">
              <Image
                src="/img/MrLogo.png"
                alt="Mr English Training Academy"
                width={250}
                height={80}
                className="mb-6"
              />
            </div>
            <p className="text-slate-200 text-sm leading-relaxed mb-6">
              At Mr. English Training Academy, we go beyond textbooks and grammar rules. We are Jammu & Kashmir's leading spoken English and personality.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <SocialLink href="https://www.facebook.com/MrEnglissh" icon={Facebook} label="Facebook" color="blue" />
              <SocialLink href="https://www.instagram.com/mr_english_training_academy/?hl=en" icon={Instagram} label="Instagram" color="pink" />
              <SocialLink href="https://www.youtube.com/@mrenglishtrainingacademy" icon={Youtube} label="YouTube" color="red" />
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">
              Quick Link
              <div className="w-12 h-1 bg-blue-500 mt-2"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-slate-200 hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Home
                </Link>
              </li>
            </ul>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="text-slate-200 hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  About us
                </Link>
              </li>
            </ul>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/courses"
                  className="text-slate-200 hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Courses
                </Link>
              </li>
            </ul>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blogs"
                  className="text-slate-200 hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Blogs
                </Link>
              </li>
            </ul>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact-us"
                  className="text-slate-200 hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>


          {/* Contact Column */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">
              Contact us
              <div className="w-12 h-1 bg-blue-500 mt-2"></div>
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-white shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Phone</p>
                  <a href="tel:+917006138299" className="text-slate-200 hover:text-blue-400 transition-colors text-sm">
                    +917006138299
                  </a>
                  <span className="text-slate-200 text-sm">, </span>
                  <a href="tel:+919906933270" className="text-slate-200 hover:text-blue-400 transition-colors text-sm">
                    +919906933270
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-white shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Email</p>
                  <a
                    href="mailto:info@themrenglisgacademy.com"
                    className="text-slate-200 hover:text-blue-400 transition-colors text-sm"
                  >
                    info@themrenglisgacademy.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Address</p>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    Mr English Training Academy<br />Namblabal, Pampore
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-600/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-300 text-center md:text-left">
              <p>
                © The Mr. English 2025. All Rights Reserved.
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-slate-300 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="text-slate-300 hover:text-blue-400 transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/refund-policy"
                className="text-slate-300 hover:text-blue-400 transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  color: "blue" | "pink" | "red";
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, label, color }) => {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    pink: "bg-pink-600 hover:bg-pink-700",
    red: "bg-white hover:bg-gray-100"
  };

  const iconColorClasses = {
    blue: "text-white",
    pink: "text-white",
    red: "text-red-600"
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${colorClasses[color]} p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg`}
      aria-label={label}
    >
      <Icon className={`h-5 w-5 ${iconColorClasses[color]}`} />
    </Link>
  );
};