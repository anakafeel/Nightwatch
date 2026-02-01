/**
 * Mock data for Nightwatch demo mode
 *
 * Exports: mockRouteResult, mockSavedRoutes, mockRouteInsights, simulateDelay
 * Used when NEXT_PUBLIC_USE_MOCK=true to provide sample route data
 */
import type { RouteResult, SavedRoute, RouteInsights } from "./routes";

/**
 * Mock GeoJSON for safest route (New York area simulation)
 */
const mockSafestGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.9857, 40.7484], // Start: Empire State Building area
          [-73.9832, 40.7502],
          [-73.9798, 40.7521],
          [-73.9762, 40.7545],
          [-73.9734, 40.7568],
          [-73.9705, 40.7589],
          [-73.9678, 40.7612], // End: Bryant Park area
        ],
      },
      properties: {
        type: "safest",
        name: "Safest Route",
      },
    },
  ],
};

/**
 * Mock GeoJSON for shortest route
 */
const mockShortestGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.9857, 40.7484], // Start
          [-73.982, 40.751],
          [-73.978, 40.754],
          [-73.9678, 40.7612], // End
        ],
      },
      properties: {
        type: "shortest",
        name: "Shortest Route",
      },
    },
  ],
};

/**
 * Mock route result for development
 */
export const mockRouteResult: RouteResult = {
  safest: {
    geojson: mockSafestGeoJSON,
    distance_m: 2400,
    eta_min: 12,
    safety_score: 98,
    coverage: "high",
    reasons: [
      "Well-lit main avenues",
      "High pedestrian activity",
      "12+ streetlights along route",
      "CCTV coverage at intersections",
    ],
  },
  shortest: {
    geojson: mockShortestGeoJSON,
    distance_m: 1800,
    eta_min: 9,
    safety_score: 45,
    coverage: "low",
    reasons: ["Some unlit segments", "Lower foot traffic"],
  },
};

/**
 * Mock saved routes for the saved routes page
 */
export const mockSavedRoutes: SavedRoute[] = [
  {
    id: "route-1",
    name: "Home to Office",
    start: { lat: 40.7484, lng: -73.9857 },
    startAddress: "123 Maple Ave",
    end: { lat: 40.7612, lng: -73.9678 },
    endAddress: "Tech Park B",
    distance_m: 8200,
    safety_score: 94,
    isFavorite: false,
    createdAt: "2024-01-15T08:30:00Z",
  },
  {
    id: "route-2",
    name: "Gym to Home",
    start: { lat: 40.752, lng: -73.977 },
    startAddress: "Iron Gym",
    end: { lat: 40.7484, lng: -73.9857 },
    endAddress: "123 Maple Ave",
    distance_m: 3500,
    safety_score: 88,
    isFavorite: true,
    createdAt: "2024-01-14T19:00:00Z",
  },
  {
    id: "route-3",
    name: "Weekend Route",
    start: { lat: 40.758, lng: -73.9855 },
    startAddress: "Downtown",
    end: { lat: 40.7812, lng: -73.9665 },
    endAddress: "Lake View Point",
    distance_m: 12000,
    safety_score: 98,
    isFavorite: false,
    createdAt: "2024-01-12T10:00:00Z",
    tags: ["Scenic Drive"],
  },
];

/**
 * Mock route insights
 */
export const mockRouteInsights: RouteInsights = {
  routeId: "#829-DXB-Marina",
  safetyScore: 82,
  lightingPercentage: 70,
  infrastructurePercentage: 30,
  darkStretchSegments: [
    { name: "Segment A - Industrial Zone", distance_m: 400, severity: "warning" },
    { name: "Segment B - Park Ave", distance_m: 150, severity: "caution" },
    { name: "Segment C - Underpass", distance_m: 80, severity: "safe" },
  ],
  metrics: {
    lightingQuality: "above",
    lightingDelta: 15,
    crowdDensity: "below",
    crowdDelta: -5,
    patrolProximity: "high",
    patrolDistance: "1km",
  },
};

/**
 * Simulate API delay
 */
export function simulateDelay(ms: number = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
