"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";

const navLinks = [
  { href: "/app", label: "Route" },
  { href: "/insights", label: "Insights" },
  { href: "/saved", label: "Saved" },
];

function AppNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="flex flex-col bg-gradient-to-r from-[#0B1220]/95 to-[#14213A]/90
                 backdrop-blur-xl border-b border-[#7C5CFF]/30
                 z-30 shrink-0 shadow-lg ring-1 ring-[#7C5CFF]/20"
    >
      {/* Main nav bar */}
      <div className="flex items-center justify-between whitespace-nowrap px-4 sm:px-8 py-2">
        <div className="flex items-center gap-4 text-white">
          <BrandLogo variant="lockup" size={32} href="/" />
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium leading-normal transition-colors",
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-text-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors
                      focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 space-y-1 border-t border-[#7C5CFF]/20">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-text-muted hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export { AppNav };
