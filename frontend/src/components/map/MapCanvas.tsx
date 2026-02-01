"use client";

import { useEffect, useRef, useState } from "react";
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

interface MapCanvasProps {
  routeData?: RouteResult | null;
  start?: LatLng;
  end?: LatLng;
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
  // Add sources if missing (must only run when style is ready)
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

  // Add layers if missing
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

function fitToPoints(map: MapLibreMap, points: [number, number][]) {
  if (!points.length) return;

  const bounds = points.reduce(
    (b, c) => b.extend(c),
    new maplibregl.LngLatBounds(points[0], points[0]),
  );
  map.fitBounds(bounds, { padding: 80, duration: 500 });
}

function MapCanvas({
  routeData,
  start,
  end,
  center = [-75.6972, 45.4215],
  zoom = 13,
  className,
}: MapCanvasProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);

  const startMarker = useRef<maplibregl.Marker | null>(null);
  const endMarker = useRef<maplibregl.Marker | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleReady, setStyleReady] = useState(false);

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
      attributionControl: undefined,
    });

    map.current = m;

    m.addControl(new maplibregl.NavigationControl(), "top-right");

    const onLoad = () => {
      console.log("[MapCanvas] map load fired");
      setMapLoaded(true);
      // After load, style is usually ready, but during Fast Refresh it can lag.
      setStyleReady(m.isStyleLoaded());
      m.resize();
    };

    const onStyleData = () => {
      // Fires multiple times; we only care that the style is now actually usable.
      if (m.isStyleLoaded()) setStyleReady(true);
    };

    m.on("load", onLoad);
    m.on("styledata", onStyleData);

    m.on("error", (e) => {
      const err = (e as { error?: unknown }).error ?? e;
      console.error("[MapCanvas] map error:", err);
    });

    requestAnimationFrame(() => m.resize());
    const t = window.setTimeout(() => m.resize(), 250);

    const ro = new ResizeObserver(() => m.resize());
    ro.observe(mapContainer.current);

    return () => {
      window.clearTimeout(t);
      ro.disconnect();
      m.off("load", onLoad);
      m.off("styledata", onStyleData);
      m.remove();
      map.current = null;
    };
  }, [center?.[0], center?.[1], zoom]);

  // Update markers for selected dropdown start/end (even before routing)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const m = map.current;

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

    // If there is no route yet, fit to the selected points
    if (!routeData && start && end) {
      fitToPoints(m, [
        [start.lng, start.lat],
        [end.lng, end.lat],
      ]);
    }
  }, [mapLoaded, routeData, start?.lat, start?.lng, end?.lat, end?.lng]);

  // Draw/Update route layers
  useEffect(() => {
    if (!map.current || !mapLoaded || !styleReady) return;

    const m = map.current;

    // Ensure sources/layers exist once style is ready
    try {
      ensureRouteLayers(m);
    } catch (e) {
      // If style flips during refresh, this can still happen once; just bail.
      console.warn("[MapCanvas] ensureRouteLayers failed:", e);
      return;
    }

    // Update route data (setData instead of remove/add)
    const shortestGeo = (routeData?.shortest?.geojson ??
      ({ type: "FeatureCollection", features: [] } as FeatureCollection)) as
      | FeatureCollection<LineString>
      | FeatureCollection;

    const safestGeo = (routeData?.safest?.geojson ??
      ({ type: "FeatureCollection", features: [] } as FeatureCollection)) as
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

    // Fit to route bounds if route exists, otherwise to points
    const safestCoords =
      (safestGeo as FeatureCollection<LineString>)?.features?.[0]?.geometry
        ?.coordinates ?? [];
    const shortestCoords =
      (shortestGeo as FeatureCollection<LineString>)?.features?.[0]?.geometry
        ?.coordinates ?? [];

    const allRouteCoords = [...safestCoords, ...shortestCoords] as [
      number,
      number,
    ][];

    if (allRouteCoords.length) {
      fitToPoints(m, allRouteCoords);
      return;
    }

    if (start && end) {
      fitToPoints(m, [
        [start.lng, start.lat],
        [end.lng, end.lat],
      ]);
    }
  }, [
    mapLoaded,
    styleReady,
    routeData,
    start?.lat,
    start?.lng,
    end?.lat,
    end?.lng,
  ]);

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
