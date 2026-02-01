import { create } from "zustand";
import type { RouteResult, RouteMode } from "@/lib/routes";

type LatLng = { lat: number; lng: number };

export type RouteRequestSnapshot = {
  start: LatLng;
  end: LatLng;
  mode: RouteMode;
  maxDetour: number;
  weights: { lights: number; cameras: number };
  useCctv: boolean;
  createdAt: number;
  routeId: string;
};

type RouteSessionState = {
  routeData: RouteResult | null;
  request: RouteRequestSnapshot | null;

  setSession: (req: RouteRequestSnapshot, data: RouteResult) => void;
  clear: () => void;
};

const STORAGE_KEY = "nightwatch:lastRouteSession";

function safeParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

export const useRouteSessionStore = create<RouteSessionState>((set) => {
  // hydrate from sessionStorage if available
  let initial: {
    request: RouteRequestSnapshot | null;
    routeData: RouteResult | null;
  } = {
    request: null,
    routeData: null,
  };

  if (typeof window !== "undefined") {
    const saved = safeParse<typeof initial>(
      sessionStorage.getItem(STORAGE_KEY),
    );
    if (saved?.request && saved?.routeData) initial = saved;
  }

  return {
    request: initial.request,
    routeData: initial.routeData,

    setSession: (request, routeData) => {
      set({ request, routeData });
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ request, routeData }),
        );
      }
    },

    clear: () => {
      set({ request: null, routeData: null });
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    },
  };
});
