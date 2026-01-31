import { z } from "zod";

/**
 * Coordinate validation schema
 */
export const latLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * Safety weights validation
 */
export const safetyWeightsSchema = z.object({
  lights: z.number().min(0).max(100),
  cameras: z.number().min(0).max(100),
});

/**
 * Route request validation
 */
export const routeRequestSchema = z.object({
  start: latLngSchema,
  end: latLngSchema,
  mode: z.enum(["day", "night"]),
  maxDetour: z.number().min(0).max(50),
  weights: safetyWeightsSchema,
  useCctv: z.boolean(),
});

/**
 * Route data validation (from API response)
 */
export const routeDataSchema = z.object({
  geojson: z.any(), // GeoJSON validation is complex, accept any
  distance_m: z.number().min(0),
  eta_min: z.number().min(0),
  safety_score: z.number().min(0).max(100),
  coverage: z.enum(["high", "medium", "low"]).optional(),
  reasons: z.array(z.string()).optional(),
});

/**
 * Route result validation
 */
export const routeResultSchema = z.object({
  safest: routeDataSchema,
  shortest: routeDataSchema,
});

/**
 * User preferences validation
 */
export const userPreferencesSchema = z.object({
  reduceMotion: z.boolean(),
  showCctvIndicators: z.boolean(),
  preferredMode: z.enum(["day", "night"]),
  defaultMaxDetour: z.number().min(0).max(50),
  defaultWeights: safetyWeightsSchema,
});

export type RouteRequestInput = z.infer<typeof routeRequestSchema>;
export type RouteResultInput = z.infer<typeof routeResultSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
