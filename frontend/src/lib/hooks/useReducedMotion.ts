"use client";

import { useState, useEffect } from "react";
import { usePreferencesStore } from "../stores/preferences";

/**
 * Hook to check if reduced motion should be enabled
 * Respects both user preference in settings AND system preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const userReduceMotion = usePreferencesStore((state) => state.reduceMotion);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Return true if either user setting OR system preference wants reduced motion
  return userReduceMotion || prefersReducedMotion;
}
