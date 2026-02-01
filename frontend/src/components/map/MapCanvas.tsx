"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type {
  StyleSpecification,
  Map as MapLibreMap,
  GeoJSONSource,
} from "maplibre-gl";
import type { RouteResult } from "@/lib/routes";
import type { FeatureCollection, LineString } from "geojson";

type LatLng = { lat: number; lng: number };
type SelectedRoute = "safest" | "shortest";

interface MapCanvasProps {
  routeData?: RouteResult | null;
  start?: LatLng;
  end?: LatLng;
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  className?: string;

  /** HIGHLIGHTING THE ROUTE */
  selectedRoute?: SelectedRoute;

  /**
   * AI GENERATED , WAS HAVING AUTO ZOOM ISSUES
   * Keep false so dropdown changes don't zoom.
   * Set true if you want the map to fit to the route after calculation.
   */
  fitOnRoute?: boolean;
}

/**
 * DARK UI
 */
const CARTO_RASTER_STYLE_DARK: StyleSpecification = {
  version: 8,
  sources: {
    "carto-tiles": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [{ id: "carto-tiles", type: "raster", source: "carto-tiles" }],
};

const LAYERS = {
  shortest: "shortest-route",
  safest: "safest-route",
  safestGlow: "safest-route-glow",
} as const;

const SOURCES = {
  shortest: "shortest-route",
  safest: "safest-route",
} as const;

function ensureRouteLayers(map: MapLibreMap) {
  // sources
  if (!map.getSource(SOURCES.shortest)) {
    map.addSource(SOURCES.shortest, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }
  if (!map.getSource(SOURCES.safest)) {
    map.addSource(SOURCES.safest, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }

  // layers
  if (!map.getLayer(LAYERS.shortest)) {
    map.addLayer({
      id: LAYERS.shortest,
      type: "line",
      source: SOURCES.shortest,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#94a3b8",
        "line-width": 3,
        "line-dasharray": [2, 2],
        "line-opacity": 0.6,
      },
    });
  }

  if (!map.getLayer(LAYERS.safestGlow)) {
    map.addLayer({
      id: LAYERS.safestGlow,
      type: "line",
      source: SOURCES.safest,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#13c8ec",
        "line-width": 12,
        "line-blur": 8,
        "line-opacity": 0.35,
      },
    });
  }

  if (!map.getLayer(LAYERS.safest)) {
    map.addLayer({
      id: LAYERS.safest,
      type: "line",
      source: SOURCES.safest,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#13c8ec", "line-width": 6 },
    });
  }
}

function fitToCoords(map: MapLibreMap, coords: [number, number][]) {
  if (!coords.length) return;
  const bounds = coords.reduce(
    (b, c) => b.extend(c),
    new maplibregl.LngLatBounds(coords[0], coords[0]),
  );
  map.fitBounds(bounds, { padding: 80, duration: 450 });
}

/** Run fn once style is actually ready (idle is the safest signal). */
function whenStyleReady(map: MapLibreMap, fn: () => void) {
  if (map.isStyleLoaded()) {
    fn();
    return;
  }
  const handler = () => {
    if (!map.isStyleLoaded()) return;
    map.off("idle", handler);
    fn();
  };
  map.on("idle", handler);
}

/** Show ONLY the selected route. */
function applySelectedRouteVisibility(
  map: MapLibreMap,
  selected: SelectedRoute,
) {
  const showSafest = selected === "safest";

  // safest layers
  if (map.getLayer(LAYERS.safest)) {
    map.setLayoutProperty(
      LAYERS.safest,
      "visibility",
      showSafest ? "visible" : "none",
    );
  }
  if (map.getLayer(LAYERS.safestGlow)) {
    map.setLayoutProperty(
      LAYERS.safestGlow,
      "visibility",
      showSafest ? "visible" : "none",
    );
  }

  // shortest layer
  if (map.getLayer(LAYERS.shortest)) {
    map.setLayoutProperty(
      LAYERS.shortest,
      "visibility",
      showSafest ? "none" : "visible",
    );
  }
}

function MapCanvas({
  routeData,
  start,
  end,
  center = [-75.6972, 45.4215],
  zoom = 13,
  className,
  selectedRoute = "safest",
  fitOnRoute = false,
}: MapCanvasProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const startMarker = useRef<maplibregl.Marker | null>(null);
  const endMarker = useRef<maplibregl.Marker | null>(null);

  // Init map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: CARTO_RASTER_STYLE_DARK, // ✅ dark tiles
      center,
      zoom,
      attributionControl: false,
    });

    mapRef.current = m;

    m.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    m.on("error", (e) => {
      const err = (e as { error?: unknown }).error ?? e;
      console.error("[MapCanvas] map error:", err);
    });

    const ro = new ResizeObserver(() => m.resize());
    ro.observe(mapContainer.current);

    m.on("load", () => {
      whenStyleReady(m, () => {
        try {
          ensureRouteLayers(m);
          applySelectedRouteVisibility(m, selectedRoute);
        } catch (e) {
          console.warn("[MapCanvas] ensureRouteLayers (init) failed:", e);
        }
      });
      m.resize();
    });

    return () => {
      ro.disconnect();
      m.remove();
      mapRef.current = null;
    };
    // intentionally only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers (NO auto-zoom on dropdown change)
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;

    if (start) {
      if (!startMarker.current) {
        startMarker.current = new maplibregl.Marker({ color: "#ffffff" })
          .setLngLat([start.lng, start.lat])
          .addTo(m);
      } else {
        startMarker.current.setLngLat([start.lng, start.lat]);
      }
    }

    if (end) {
      if (!endMarker.current) {
        endMarker.current = new maplibregl.Marker({ color: "#13c8ec" })
          .setLngLat([end.lng, end.lat])
          .addTo(m);
      } else {
        endMarker.current.setLngLat([end.lng, end.lat]);
      }
    }
  }, [start?.lat, start?.lng, end?.lat, end?.lng]);

  // Toggle visibility when user clicks Safest/Shortest
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;

    whenStyleReady(m, () => {
      try {
        ensureRouteLayers(m);
        applySelectedRouteVisibility(m, selectedRoute);
      } catch (e) {
        console.warn("[MapCanvas] applySelectedRouteVisibility failed:", e);
      }
    });
  }, [selectedRoute]);

  // Draw / update route lines
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;

    whenStyleReady(m, () => {
      try {
        ensureRouteLayers(m);
      } catch (e) {
        console.warn("[MapCanvas] ensureRouteLayers (update) failed:", e);
        return;
      }

      const emptyFC: FeatureCollection = {
        type: "FeatureCollection",
        features: [],
      };

      const shortestGeo = (routeData?.shortest?.geojson ?? emptyFC) as
        | FeatureCollection<LineString>
        | FeatureCollection;

      const safestGeo = (routeData?.safest?.geojson ?? emptyFC) as
        | FeatureCollection<LineString>
        | FeatureCollection;

      const shortestSource = m.getSource(SOURCES.shortest) as
        | GeoJSONSource
        | undefined;
      const safestSource = m.getSource(SOURCES.safest) as
        | GeoJSONSource
        | undefined;

      if (shortestSource) shortestSource.setData(shortestGeo as any);
      if (safestSource) safestSource.setData(safestGeo as any);

      // Apply selection after data updates too (safety)
      applySelectedRouteVisibility(m, selectedRoute);

      if (!fitOnRoute) return;

      // Fit only when we actually have a route
      const safestCoords =
        (safestGeo as FeatureCollection<LineString>)?.features?.[0]?.geometry
          ?.coordinates ?? [];
      const shortestCoords =
        (shortestGeo as FeatureCollection<LineString>)?.features?.[0]?.geometry
          ?.coordinates ?? [];

      const all = [...safestCoords, ...shortestCoords] as [number, number][];
      if (all.length) fitToCoords(m, all);
    });
  }, [routeData, fitOnRoute, selectedRoute]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 300,
      }}
    >
      <div ref={mapContainer} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

export { MapCanvas };
