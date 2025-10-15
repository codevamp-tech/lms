"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Linkedin, Facebook, Instagram, Youtube, School, ArrowRight, Mail } from "lucide-react";

export function LMSFooter() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl mr-3 shadow-lg">
                <School className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                MR ENGLISH TRAINING
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Your gateway to quality education. Learn, grow, and succeed with
              us. Transform your future with expert-led courses.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Stay Updated</h3>
              </div>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500 backdrop-blur-sm"
                />
                <Button 
                  type="submit" 
                  className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <FooterLinkColumn
            title="About"
            links={[
              { href: "/", label: "About Us" },
              { href: "/", label: "Careers" },
              { href: "/", label: "Blog" },
              { href: "/", label: "Partnerships" },
            ]}
          />
          <FooterLinkColumn
            title="Learn"
            links={[
              { href: "/", label: "Home" },
              { href: "/courses", label: "All Courses" },
              { href: "/", label: "Instructors" },
              { href: "/", label: "Pricing" },
            ]}
          />
          <FooterLinkColumn
            title="Support"
            links={[
              { href: "/", label: "Contact Us" },
              { href: "/", label: "Help Center" },
              { href: "/", label: "FAQ" },
              { href: "/", label: "Community" },
            ]}
          />
          <FooterLinkColumn
            title="Legal"
            links={[
              { href: "/", label: "Terms of Service" },
              { href: "/", label: "Privacy Policy" },
              { href: "/", label: "Cookie Policy" },
              { href: "/", label: "Refund Policy" },
            ]}
          />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-slate-400">
              <p>
                © {new Date().getFullYear()}{" "}
                <span className="text-yellow-400 font-semibold">MR ENGLISH TRAINING</span>. All
                rights reserved.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 mr-2">Follow us:</span>
              <SocialLink href="#" icon={Github} label="GitHub" />
              <SocialLink href="#" icon={Twitter} label="Twitter" />
              <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
              <SocialLink href="#" icon={Facebook} label="Facebook" />
              <SocialLink href="#" icon={Instagram} label="Instagram" />
              <SocialLink href="#" icon={Youtube} label="YouTube" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterLink {
  href: string;
  label: string;
}

interface FooterLinkColumnProps {
  title: string;
  links: FooterLink[];
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-bold mb-4 text-white uppercase tracking-wider">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <Link 
            href={link.href} 
            className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 inline-flex items-center group"
          >
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              {link.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

interface SocialLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, label }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-slate-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm"
    aria-label={label}
  >
    <Icon className="h-4 w-4" />
  </Link>
);