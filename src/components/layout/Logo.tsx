"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: "size-6", text: "text-lg" },
    md: { icon: "size-8", text: "text-xl" },
    lg: { icon: "size-10", text: "text-2xl" },
  };

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 group cursor-pointer",
        className
      )}
    >
      <div className={cn("relative flex items-center justify-center", sizes[size].icon)}>
        <span className="material-symbols-outlined text-primary text-3xl absolute blur-sm opacity-50">
          light_mode
        </span>
        <span className="material-symbols-outlined text-noor-gold text-3xl relative z-10">
          light_mode
        </span>
      </div>
      {showText && (
        <h2 className={cn("text-white font-bold tracking-tight", sizes[size].text)}>
          Pathify{" "}
          <span className="text-noor-gold font-normal opacity-90">Noor</span>
        </h2>
      )}
    </Link>
  );
}

export { Logo };
