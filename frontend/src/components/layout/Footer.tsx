"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#0F2326] to-[#050A14]
                      border-t border-[#0F7A82]/30 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          {/* Brand */}
          <div className="flex flex-col gap-6 max-w-sm">
            <BrandLogo variant="lockup" size={40} href="/" />
            <p className="text-base text-text-muted leading-relaxed">
              Empowering communities with safe, light-guided navigation. Because
              safety shouldn&apos;t stop when the sun goes down.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl
                           bg-[#1A363B]/50 border border-[#0F7A82]/40 w-fit">
              <span className="material-symbols-outlined text-[#37B8A6] text-sm">
                hotel_class
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                AI for Good Initiative
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-20">
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-bold text-lg">Product</h4>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/app"
                  className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200 text-base"
                >
                  Try App
                </Link>
                <a
                  href="#how-it-works"
                  className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200 text-base"
                >
                  Features
                </a>
                <Link
                  href="/insights"
                  className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200 text-base"
                >
                  Insights
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-bold text-lg">Company</h4>
              <nav className="flex flex-col gap-4">
                <a
                  href="#"
                  className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200 text-base"
                >
                  About Us
                </a>
                <a
                  href="#ethics"
                  className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200 text-base"
                >
                  Ethics
                </a>
                <a
                  href="#"
                  className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200 text-base"
                >
                  Contact
                </a>
              </nav>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-bold text-lg">Legal</h4>
              <nav className="flex flex-col gap-4">
                <a
                  href="#"
                  className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200 text-base"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-text-muted hover:text-[#37B8A6] transition-colors duration-200 text-base"
                >
                  Terms
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-[#0F7A82]/20 gap-6">
          <p className="text-text-muted/60 text-sm font-medium">
            &copy; 2024 Nightwatch Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-text-muted/60 hover:text-[#37B8A6] transition-colors duration-200"
              aria-label="Social"
            >
              <span className="material-symbols-outlined">social_leaderboard</span>
            </a>
            <a
              href="#"
              className="text-text-muted/60 hover:text-[#37B8A6] transition-colors duration-200"
              aria-label="Chat"
            >
              <span className="material-symbols-outlined">chat</span>
            </a>
            <a
              href="#"
              className="text-text-muted/60 hover:text-[#37B8A6] transition-colors duration-200"
              aria-label="Email"
            >
              <span className="material-symbols-outlined">mail</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
