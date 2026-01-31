"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/app", label: "Route" },
  { href: "/insights", label: "Insights" },
  { href: "/saved", label: "Saved" },
  { href: "/settings", label: "Settings" },
];

function AppNav() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border-dark bg-background-dark px-6 py-3 z-30 shrink-0">
      <div className="flex items-center gap-4 text-white">
        <Link href="/" className="size-8 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            />
          </svg>
        </Link>
        <Link href="/">
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight hover:text-primary transition-colors">
            Pathify Noor
          </h2>
        </Link>
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
                    : "text-text-muted hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="h-8 w-px bg-border-dark mx-2 hidden md:block" />

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-border-dark bg-surface-dark"
            role="img"
            aria-label="User profile"
          />
        </div>
      </div>
    </header>
  );
}

export { AppNav };
