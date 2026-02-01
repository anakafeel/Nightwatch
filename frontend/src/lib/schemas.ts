/**
 * Zod validation schemas for Nightwatch API
 *
 * Exports: latLngSchema, routeRequestSchema, routeDataSchema, routeResultSchema
 * Used by: API client for request/response validation
 */
import { z } from "zod";

/**
 * Coordinate validation schema
 */
export const latLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * Route request validation - minimal payload
 */
export const routeRequestSchema = z.object({
  start: latLngSchema,
  end: latLngSchema,
});

/**
 * Route data validation (from API response)
 */
export const routeDataSchema = z.object({
  geojson: z.any(), // GeoJSON validation is complex, accept any

  // Use coerce to be resilient if backend sends strings
  distance_m: z.coerce.number().min(0),
  eta_min: z.coerce.number().min(0),
  safety_score: z.coerce.number().min(0).max(100),

  // ✅ FIX: backend returns values like "graph+routing_engine" / "mock+lights"
  // so this cannot be enum(["high","medium","low"])
  coverage: z.string().optional(),

  // Default to [] so components can safely render
  reasons: z.array(z.string()).optional().default([]),
});

/**
 * Route result validation
 */
export const routeResultSchema = z.object({
  safest: routeDataSchema,
  shortest: routeDataSchema,
});

export type RouteRequestInput = z.infer<typeof routeRequestSchema>;
export type RouteResultInput = z.infer<typeof routeResultSchema>;
