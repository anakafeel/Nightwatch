"use client";

import { forwardRef } from "react";
import { cn, getCoverageColor } from "@/lib/utils";
import type { CoverageLevel } from "@/lib/routes";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "coverage" | "info" | "warning" | "success" | "danger";
  coverage?: CoverageLevel;
  pulse?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      coverage,
      pulse = false,
      children,
      ...props
    },
    ref
  ) => {
    // If coverage prop is provided, use coverage colors
    if (variant === "coverage" && coverage) {
      const colors = getCoverageColor(coverage);
      return (
        <span
          ref={ref}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
            colors.bg,
            colors.text,
            colors.border,
            coverage === "high" && "shadow-glow-success",
            coverage === "medium" && "shadow-glow-warning",
            coverage === "low" && "shadow-glow-danger",
            className
          )}
          {...props}
        >
          {pulse && (
            <span
              className={cn(
                "size-1.5 rounded-full",
                coverage === "high" && "bg-emerald-400 animate-pulse",
                coverage === "medium" && "bg-amber-400",
                coverage === "low" && "bg-rose-400"
              )}
            />
          )}
          {children}
        </span>
      );
    }

    const variants = {
      default:
        "bg-white/10 text-white border border-white/20",
      info:
        "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      warning:
        "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-glow-warning",
      success:
        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-glow-success",
      danger:
        "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-glow-danger",
      coverage: "",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
          variants[variant],
          className
        )}
        {...props}
      >
        {pulse && (
          <span className="size-1.5 rounded-full bg-current animate-pulse" />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
export type { BadgeProps };
