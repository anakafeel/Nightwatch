"use client";

import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  filled?: boolean;
}

function Icon({ name, className, size = "md", filled = false }: IconProps) {
  const sizes = {
    sm: "text-[16px]",
    md: "text-[20px]",
    lg: "text-[24px]",
    xl: "text-[32px]",
  };

  return (
    <span
      className={cn(
        "material-symbols-outlined select-none",
        sizes[size],
        className
      )}
      style={{
        fontVariationSettings: filled
          ? '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
          : '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export { Icon };
export type { IconProps };
