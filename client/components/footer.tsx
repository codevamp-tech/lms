"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Linkedin, Facebook, Instagram, Youtube, School } from "lucide-react";

export function LMSFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <School className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">LMS Platform</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              Empowering learners worldwide with accessible, high-quality education.
            </p>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Stay Updated</h3>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-secondary border-secondary-border"
                />
                <Button type="submit" className="shrink-0">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

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
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LMS Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="https://github.com" icon={Github} label="GitHub" />
              <SocialLink href="https://twitter.com" icon={Twitter} label="Twitter" />
              <SocialLink href="https://linkedin.com" icon={Linkedin} label="LinkedIn" />
              <SocialLink href="https://facebook.com" icon={Facebook} label="Facebook" />
              <SocialLink href="https://instagram.com" icon={Instagram} label="Instagram" />
              <SocialLink href="https://youtube.com" icon={Youtube} label="YouTube" />
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
  <div className="lg:col-span-2">
    <h3 className="text-sm font-semibold mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {link.label}
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
    className="text-muted-foreground hover:text-primary transition-colors"
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
  </Link>
);
