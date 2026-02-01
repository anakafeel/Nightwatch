/**
 * Core route types for Nightwatch
 *
 * Exports: LatLng, CoverageLevel, RouteRequest, RouteData, RouteResult, SavedRoute, RouteInsights
 * Data flow: RouteRequest sent to API -> RouteResult returned with safest/shortest routes
 */
import type { GeoJSON } from "geojson";

/**
 * Geographic coordinate point
 */
export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Coverage level for safety analysis
 */
export type CoverageLevel = "high" | "medium" | "low";

/**
 * Route request payload - minimal fields for backend
 */
export interface RouteRequest {
  start: LatLng;
  end: LatLng;
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
