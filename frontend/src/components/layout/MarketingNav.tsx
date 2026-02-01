"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { BrandLogo } from "./BrandLogo";

const navLinks = [
  { href: "#how-it-works", label: "How it Works" },
  { href: "#app", label: "App" },
  { href: "#ethics", label: "Ethics" },
];

function MarketingNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#0F2326]/95 to-[#1A363B]/90
                    backdrop-blur-xl border-b border-[#0F7A82]/30
                    shadow-lg ring-1 ring-[#0F7A82]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <BrandLogo variant="lockup" size={32} href="/" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted
                        hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link href="/app" className="hidden md:block">
          <Button
            size="md"
            className="bg-gradient-to-r from-[#0F7A82] via-[#37B8A6] to-[#1AC6E6]
                      text-black font-bold rounded-xl shadow-lg hover:shadow-xl
                      transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Started
          </Button>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 pb-6 space-y-2 bg-[#0F2326]/95 backdrop-blur-lg border-t border-[#0F7A82]/20">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-text-muted hover:text-white
                        hover:bg-white/5 rounded-lg px-4 py-3 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/app" className="block pt-2">
            <Button className="w-full bg-gradient-to-r from-[#0F7A82] via-[#37B8A6] to-[#1AC6E6]
                              text-black font-bold rounded-xl">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export { MarketingNav };
