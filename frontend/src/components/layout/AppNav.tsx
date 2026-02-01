"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Put avatar at: frontend/public/images/avatar.png
  const avatarUrl = "/images/avatar.png";

  // Optional: fallback if the image fails to load
  const [avatarOk, setAvatarOk] = useState(true);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header
      className="flex items-center justify-between whitespace-nowrap
                 bg-gradient-to-r from-[#0F2326]/95 to-[#1A363B]/90
                 backdrop-blur-xl border-b border-[#0F7A82]/30
                 px-8 py-2 z-30 shrink-0 shadow-lg ring-1 ring-[#0F7A82]/20"
    >
      <div className="flex items-center gap-4 text-white">
        <BrandLogo variant="lockup" size={32} href="/" />
      </div>

      <div className="flex flex-1 justify-end gap-8 items-center">
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
                    : "text-text-muted hover:text-white hover:bg-white/5",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="h-8 w-px bg-border-dark mx-2 hidden md:block" />

        {/* User Avatar + Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open user menu"
            className="relative overflow-hidden rounded-full size-9
                       ring-2 ring-border-dark bg-surface-dark cursor-pointer
                       hover:ring-[#0F7A82]/50 transition-all duration-200"
          >
            {avatarOk ? (
              <Image
                src={avatarUrl}
                alt="User avatar"
                fill
                sizes="36px"
                className="object-cover"
                onError={() => setAvatarOk(false)}
                priority={false}
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white/80">
                Us
              </span>
            )}
          </button>

          {menuOpen && (
            <div
              role="dialog"
              aria-label="User menu"
              className="absolute right-0 top-12 w-56 rounded-xl
                         bg-[#0F2326]/95 backdrop-blur-xl border border-[#0F7A82]/30
                         shadow-xl ring-1 ring-[#0F7A82]/20 overflow-hidden"
            >
              <div className="px-4 py-4 border-b border-[#0F7A82]/20 flex flex-col items-center gap-3">
                <div className="relative size-24 rounded-full overflow-hidden ring-2 ring-[#0F7A82]/40 bg-surface-dark">
                  {avatarOk ? (
                    <Image
                      src={avatarUrl}
                      alt="User avatar"
                      fill
                      sizes="96px"
                      className="object-cover"
                      onError={() => setAvatarOk(false)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white/80">
                      Us
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-xs text-text-muted">Signed in</p>
                  <p className="text-sm text-white font-medium truncate">
                    anakafeel@gmail.com
                  </p>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/saved"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-muted
                             hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-lg">
                    bookmark
                  </span>
                  Saved Routes
                </Link>

                <button
                  onClick={() => {
                    console.log("logout");
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-muted
                             hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-lg">
                    logout
                  </span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { AppNav };
