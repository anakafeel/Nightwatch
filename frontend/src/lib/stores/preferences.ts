/**
 * User preferences store for Nightwatch
 *
 * Exports: usePreferencesStore
 * Data flow: Persisted to localStorage, used for accessibility/privacy settings
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * User preferences state - accessibility and privacy only
 */
interface PreferencesState {
  // Accessibility
  reduceMotion: boolean;
  largeText: boolean;

  // Privacy
  showCctvIndicators: boolean;

  // Actions
  setReduceMotion: (value: boolean) => void;
  setLargeText: (value: boolean) => void;
  setShowCctvIndicators: (value: boolean) => void;
  resetToDefaults: () => void;
}

const defaultPreferences = {
  reduceMotion: false,
  largeText: false,
  showCctvIndicators: false,
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
