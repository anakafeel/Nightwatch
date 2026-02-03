"use client";

import { useState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { BrandLogo } from "./BrandLogo";

const navLinks = [
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/about", label: "About" },
  { href: "/app", label: "App" },
];

function MarketingNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#0F2326]/95 to-[#1A363B]/90
                    backdrop-blur-xl border-b border-[#0F7A82]/30
                    shadow-lg ring-1 ring-[#0F7A82]/20 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <BrandLogo variant="lockup" size={32} href="/" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted
                        hover:text-white hover:bg-white/5 transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#0F7A82]/50"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {/* GitHub Icon */}
          <a
            href="https://github.com/SrivathsanMurali/Pathify"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-[#0F7A82]/50"
          >
            <Github className="w-5 h-5" />
          </a>

          <Link href="/app">
            <Button
              size="md"
              className="bg-gradient-to-r from-[#0F7A82] via-[#37B8A6] to-[#1AC6E6]
                        text-black font-bold rounded-xl shadow-lg hover:shadow-xl
                        transition-all duration-300 hover:-translate-y-0.5
                        focus:ring-2 focus:ring-[#0F7A82]/50 focus:ring-offset-2
                        focus:ring-offset-[#0F2326]"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Right Section */}
        <div className="flex md:hidden items-center gap-2">
          {/* GitHub Icon (Mobile) */}
          <a
            href="https://github.com/SrivathsanMurali/Pathify"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-[#0F7A82]/50"
          >
            <Github className="w-5 h-5" />
          </a>

          {/* Mobile Menu Button */}
          <button
            className="text-white p-2 rounded-lg hover:bg-white/5 transition-colors
                      focus:outline-none focus:ring-2 focus:ring-[#0F7A82]/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-4 sm:px-6 pb-6 space-y-2 bg-[#0F2326]/95 backdrop-blur-lg border-t border-[#0F7A82]/20">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-text-muted hover:text-white
                        hover:bg-white/5 rounded-lg px-4 py-3 transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#0F7A82]/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/app" className="block pt-2">
            <Button
              className="w-full bg-gradient-to-r from-[#0F7A82] via-[#37B8A6] to-[#1AC6E6]
                              text-black font-bold rounded-xl"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export { MarketingNav };
