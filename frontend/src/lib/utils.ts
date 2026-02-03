import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CoverageLevel } from "./routes"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCoverageColor(coverage: CoverageLevel) {
  const colors = {
    high: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    medium: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
    },
    low: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
    },
  }
  return colors[coverage]
}
