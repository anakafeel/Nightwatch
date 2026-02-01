/**
 * Saved routes store for Nightwatch
 *
 * Exports: useSavedRoutesStore, RerunData, HistoryEntry, createSavedRouteFromSession
 * Data flow: Routes saved/history stored in localStorage, rerunData passed transiently to app page
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SavedRoute, LatLng } from "../routes";

/**
 * Rerun data stored temporarily to hand off route params to the app page
 */
export interface RerunData {
  start: LatLng;
  end: LatLng;
  startAddress: string;
  endAddress: string;
  routeId?: string;
}

/**
 * History entry - route that was run but not necessarily saved
 */
export interface HistoryEntry {
  id: string;
  start: LatLng;
  startAddress: string;
  end: LatLng;
  endAddress: string;
  distance_m: number;
  safety_score: number;
  createdAt: string;
}

/**
 * Saved routes store state
 */
interface SavedRoutesState {
  savedRoutes: SavedRoute[];
  history: HistoryEntry[];
  rerunData: RerunData | null;

  // Actions for saved routes
  saveRoute: (route: SavedRoute) => void;
  removeRoute: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateRouteName: (id: string, name: string) => void;

  // Actions for history
  addToHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;

  // Actions for rerun
  setRerunData: (data: RerunData) => void;
  clearRerunData: () => void;
  consumeRerunData: () => RerunData | null;
}

const MAX_HISTORY_ITEMS = 20;

/**
 * Generate a unique ID for routes
 */
function generateId(): string {
  return `route-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Saved routes store with localStorage persistence
 * SSR-safe: Only hydrates on client side
 */
export const useSavedRoutesStore = create<SavedRoutesState>()(
  persist(
    (set, get) => ({
      savedRoutes: [],
      history: [],
      rerunData: null,

      saveRoute: (route) => {
        const existing = get().savedRoutes.find((r) => r.id === route.id);
        if (existing) {
          // Update existing route
          set((state) => ({
            savedRoutes: state.savedRoutes.map((r) =>
              r.id === route.id ? { ...r, ...route } : r
            ),
          }));
        } else {
          // Add new route with generated ID if missing
          const routeWithId: SavedRoute = {
            ...route,
            id: route.id || generateId(),
          };
          set((state) => ({
            savedRoutes: [routeWithId, ...state.savedRoutes],
          }));
        }
      },

      removeRoute: (id) => {
        set((state) => ({
          savedRoutes: state.savedRoutes.filter((r) => r.id !== id),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          savedRoutes: state.savedRoutes.map((r) =>
            r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
          ),
        }));
      },

      updateRouteName: (id, name) => {
        set((state) => ({
          savedRoutes: state.savedRoutes.map((r) =>
            r.id === id ? { ...r, name } : r
          ),
        }));
      },

      addToHistory: (entry) => {
        const entryWithId: HistoryEntry = {
          ...entry,
          id: entry.id || generateId(),
        };
        set((state) => {
          // Remove duplicate if exists (same start/end within short time)
          const filtered = state.history.filter(
            (h) =>
              !(
                h.start.lat === entry.start.lat &&
                h.start.lng === entry.start.lng &&
                h.end.lat === entry.end.lat &&
                h.end.lng === entry.end.lng
              )
          );
          // Add to front and limit size
          return {
            history: [entryWithId, ...filtered].slice(0, MAX_HISTORY_ITEMS),
          };
        });
      },

      clearHistory: () => {
        set({ history: [] });
      },

      setRerunData: (data) => {
        set({ rerunData: data });
      },

      clearRerunData: () => {
        set({ rerunData: null });
      },

      consumeRerunData: () => {
        const data = get().rerunData;
        if (data) {
          set({ rerunData: null });
        }
        return data;
      },
    }),
    {
      name: "pathify:savedRoutes",
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
      // Only persist these fields (not rerunData which is transient)
      partialize: (state) => ({
        savedRoutes: state.savedRoutes,
        history: state.history,
      }),
    }
  )
);

/**
 * Helper to create a SavedRoute from route session data
 */
export function createSavedRouteFromSession(params: {
  name: string;
  start: LatLng;
  startAddress: string;
  end: LatLng;
  endAddress: string;
  distance_m: number;
  safety_score: number;
  tags?: string[];
}): SavedRoute {
  return {
    id: generateId(),
    name: params.name,
    start: params.start,
    startAddress: params.startAddress,
    end: params.end,
    endAddress: params.endAddress,
    distance_m: params.distance_m,
    safety_score: params.safety_score,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    tags: params.tags,
  };
}
