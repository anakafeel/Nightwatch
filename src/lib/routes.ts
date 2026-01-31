import type { GeoJSON } from "geojson";

/**
 * Geographic coordinate point
 */
export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Route mode (day or night)
 */
export type RouteMode = "day" | "night";

/**
 * Coverage level for safety analysis
 */
export type CoverageLevel = "high" | "medium" | "low";

/**
 * Safety weight preferences
 */
export interface SafetyWeights {
  lights: number; // 0-100, weight for street lighting
  cameras: number; // 0-100, weight for CCTV/observability
}

/**
 * Route request preferences
 */
export interface RoutePreferences {
  mode: RouteMode;
  maxDetour: number; // percentage, e.g., 15 means 15% max detour
  weights: SafetyWeights;
  useCctv: boolean;
}

/**
 * Route request payload
 */
export interface RouteRequest {
  start: LatLng;
  end: LatLng;
  mode: RouteMode;
  maxDetour: number;
  weights: SafetyWeights;
  useCctv: boolean;
}

/**
 * Individual route result
 */
export interface RouteData {
  geojson: GeoJSON.FeatureCollection;
  distance_m: number;
  eta_min: number;
  safety_score: number;
  coverage?: CoverageLevel;
  reasons?: string[];
}

/**
 * Complete route response
 */
export interface RouteResult {
  safest: RouteData;
  shortest: RouteData;
}

/**
 * Saved route for persistence
 */
export interface SavedRoute {
  id: string;
  name: string;
  start: LatLng;
  startAddress: string;
  end: LatLng;
  endAddress: string;
  distance_m: number;
  safety_score: number;
  isFavorite: boolean;
  createdAt: string;
  tags?: string[];
}

/**
 * Route insights data
 */
export interface RouteInsights {
  routeId: string;
  safetyScore: number;
  lightingPercentage: number;
  infrastructurePercentage: number;
  darkStretchSegments: {
    name: string;
    distance_m: number;
    severity: "warning" | "caution" | "safe";
  }[];
  metrics: {
    lightingQuality: "above" | "average" | "below";
    lightingDelta: number;
    crowdDensity: "above" | "average" | "below";
    crowdDelta: number;
    patrolProximity: "high" | "medium" | "low";
    patrolDistance: string;
  };
}
