"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StyleSpecification, Map as MapLibreMap } from "maplibre-gl";
import type { RouteResult } from "@/lib/routes";
import type { FeatureCollection, LineString } from "geojson";

interface MapCanvasProps {
  routeData?: RouteResult | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

/**
 * Primary: OSM raster tiles (no token)
 */
const OSM_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm-tiles", type: "raster", source: "osm-tiles" }],
};

function MapCanvas({
  routeData,
  center = [-75.6972, 45.4215],
  zoom = 13,
  className,
}: MapCanvasProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Init map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const rect = mapContainer.current.getBoundingClientRect();
    console.log("[MapCanvas] container rect:", rect);

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_RASTER_STYLE,
      center,
      zoom,
      // ✅ FIX: maplibre types don't allow `true` here
      // Use default (undefined) OR pass options OR false to disable.
      attributionControl: undefined,
    });

    map.current = m;

    // ✅ You already show custom MapControls in your UI, but keeping this is fine
    m.addControl(new maplibregl.NavigationControl(), "top-right");

    m.on("load", () => {
      console.log("[MapCanvas] map load fired");
      setMapLoaded(true);
      m.resize();
    });

    m.on("error", (e) => {
      // MapLibre event error typing can vary; keep it safe without `any`
      const err = (e as { error?: unknown }).error ?? e;
      console.error("[MapCanvas] map error:", err);
    });

    // Resize fixes
    requestAnimationFrame(() => m.resize());
    const t = window.setTimeout(() => m.resize(), 250);

    const ro = new ResizeObserver(() => m.resize());
    ro.observe(mapContainer.current);

    return () => {
      window.clearTimeout(t);
      ro.disconnect();
      m.remove();
      map.current = null;
    };

    // ✅ IMPORTANT: don't depend on the array object identity
  }, [center?.[0], center?.[1], zoom]);

  // Draw route layers
  useEffect(() => {
    if (!map.current || !mapLoaded || !routeData) return;

    const currentMap = map.current;

    // Remove existing layers/sources (safe even if they don't exist)
    ["safest-route-glow", "safest-route", "shortest-route"].forEach((id) => {
      if (currentMap.getLayer(id)) currentMap.removeLayer(id);
    });

    ["safest-route", "shortest-route"].forEach((id) => {
      if (currentMap.getSource(id)) currentMap.removeSource(id);
    });

    // Type guard your geojson as FeatureCollection<LineString>
    const shortestGeo = routeData.shortest
      .geojson as FeatureCollection<LineString>;
    const safestGeo = routeData.safest.geojson as FeatureCollection<LineString>;

    // Add shortest route
    currentMap.addSource("shortest-route", {
      type: "geojson",
      data: shortestGeo,
    });

    currentMap.addLayer({
      id: "shortest-route",
      type: "line",
      source: "shortest-route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#94a3b8",
        "line-width": 3,
        "line-dasharray": [2, 2],
        "line-opacity": 0.6,
      },
    });

    // Add safest route
    currentMap.addSource("safest-route", {
      type: "geojson",
      data: safestGeo,
    });

    currentMap.addLayer({
      id: "safest-route-glow",
      type: "line",
      source: "safest-route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#13c8ec",
        "line-width": 12,
        "line-blur": 8,
        "line-opacity": 0.35,
      },
    });

    currentMap.addLayer({
      id: "safest-route",
      type: "line",
      source: "safest-route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#13c8ec", "line-width": 6 },
    });

    // Fit bounds
    const safestCoords = safestGeo.features?.[0]?.geometry?.coordinates ?? [];
    const shortestCoords =
      shortestGeo.features?.[0]?.geometry?.coordinates ?? [];
    const coords = [...safestCoords, ...shortestCoords];

    if (coords.length) {
      const bounds = coords.reduce(
        (b, c) => b.extend(c as [number, number]),
        new maplibregl.LngLatBounds(
          coords[0] as [number, number],
          coords[0] as [number, number],
        ),
      );
      currentMap.fitBounds(bounds, { padding: 80 });
    }
  }, [routeData, mapLoaded]);

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
