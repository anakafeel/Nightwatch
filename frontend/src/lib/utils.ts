import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// src/lib/utils.ts

export type CoverageLevel = "high" | "medium" | "low" | "none";

export function getCoverageColor(level: CoverageLevel) {
  switch (level) {
    case "high":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
    case "medium":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20";
    case "low":
      return "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20";
    case "none":
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
