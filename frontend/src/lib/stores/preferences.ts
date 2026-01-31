"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { RouteMode, SafetyWeights } from "../routes";

/**
 * User preferences state
 */
interface PreferencesState {
  // Accessibility
  reduceMotion: boolean;
  largeText: boolean;

  // Privacy
  showCctvIndicators: boolean;

  // Route preferences
  preferredMode: RouteMode;
  defaultMaxDetour: number;
  defaultWeights: SafetyWeights;

  // Actions
  setReduceMotion: (value: boolean) => void;
  setLargeText: (value: boolean) => void;
  setShowCctvIndicators: (value: boolean) => void;
  setPreferredMode: (mode: RouteMode) => void;
  setDefaultMaxDetour: (value: number) => void;
  setDefaultWeights: (weights: SafetyWeights) => void;
  resetToDefaults: () => void;
}

/**
 * Default preferences
 */
const defaultPreferences = {
  reduceMotion: false,
  largeText: false,
  showCctvIndicators: false,
  preferredMode: "night" as RouteMode,
  defaultMaxDetour: 15,
  defaultWeights: {
    lights: 80,
    cameras: 45,
  },
};

/**
 * Preferences store with localStorage persistence
 * SSR-safe: Only hydrates on client side
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultPreferences,

      setReduceMotion: (value) => set({ reduceMotion: value }),
      setLargeText: (value) => set({ largeText: value }),
      setShowCctvIndicators: (value) => set({ showCctvIndicators: value }),
      setPreferredMode: (mode) => set({ preferredMode: mode }),
      setDefaultMaxDetour: (value) => set({ defaultMaxDetour: value }),
      setDefaultWeights: (weights) => set({ defaultWeights: weights }),
      resetToDefaults: () => set(defaultPreferences),
    }),
    {
      name: "pathify-preferences",
      storage: createJSONStorage(() => {
        // SSR safety check
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    }
  )
);
