"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

function Footer() {
  return (
    <footer
      className="w-full bg-gradient-to-b from-[#0F2326] to-[#050A14]
                      border-t border-[#0F7A82]/30 pt-12 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-sm">
            <BrandLogo variant="lockup" size={36} href="/" />
            <p className="text-sm text-text-muted leading-relaxed">
              AI-powered night safety navigation. Because safety shouldn&apos;t
              stop when the sun goes down.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <Link
              href="/app"
              className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#0F7A82]/50 focus:ring-offset-2
                        focus:ring-offset-[#0F2326] rounded"
            >
              Try App
            </Link>
            <a
              href="#how-it-works"
              className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#0F7A82]/50 focus:ring-offset-2
                        focus:ring-offset-[#0F2326] rounded"
            >
              How it Works
            </a>
            <Link
              href="/about"
              className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#0F7A82]/50 focus:ring-offset-2
                        focus:ring-offset-[#0F2326] rounded"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-6
                        border-t border-[#0F7A82]/20 gap-4 text-sm"
        >
          <p className="text-text-muted/60 font-medium">
            &copy; 2026 Nightwatch. All rights reserved.
          </p>
          <p className="text-text-muted/60 flex items-center gap-1">
            Made with{" "}
            <span className="text-rose-400/80" aria-label="love">
              ♥
            </span>
            <span></span>
            {"  "}
            by{" "}
            <a
              href="https://www.linkedin.com/in/saim-hashmi-2230b6243"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#37B8A6] hover:text-[#37B8A6]/80 transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#0F7A82]/50 rounded"
            >
              Saim Hashmi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
