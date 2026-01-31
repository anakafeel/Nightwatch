"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { RouteResult } from "@/lib/routes";

// Set Mapbox token from environment
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
const MAP_PROVIDER = process.env.NEXT_PUBLIC_MAP_PROVIDER || "mapbox";

interface MapCanvasProps {
  routeData?: RouteResult | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

function MapCanvas({
  routeData,
  center = [-73.9857, 40.7484], // Default: NYC
  zoom = 13,
  className,
}: MapCanvasProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Configure Mapbox
    if (MAP_PROVIDER === "mapbox" && MAPBOX_TOKEN) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom,
      attributionControl: true,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Cleanup
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center, zoom]);

  // Draw routes when data changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !routeData) return;

    const currentMap = map.current;

    // Remove existing layers and sources
    ["safest-route", "shortest-route"].forEach((id) => {
      if (currentMap.getLayer(id)) currentMap.removeLayer(id);
      if (currentMap.getSource(id)) currentMap.removeSource(id);
    });

    // Add shortest route (dashed gray)
    currentMap.addSource("shortest-route", {
      type: "geojson",
      data: routeData.shortest.geojson,
    });

    currentMap.addLayer({
      id: "shortest-route",
      type: "line",
      source: "shortest-route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#94a3b8",
        "line-width": 3,
        "line-dasharray": [2, 2],
        "line-opacity": 0.6,
      },
    });

    // Add safest route (glowing teal)
    currentMap.addSource("safest-route", {
      type: "geojson",
      data: routeData.safest.geojson,
    });

    // Glow effect layer
    currentMap.addLayer({
      id: "safest-route-glow",
      type: "line",
      source: "safest-route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#13c8ec",
        "line-width": 12,
        "line-blur": 8,
        "line-opacity": 0.4,
      },
    });

    currentMap.addLayer({
      id: "safest-route",
      type: "line",
      source: "safest-route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#13c8ec",
        "line-width": 6,
      },
    });

    // Fit bounds to show both routes
    const coordinates = [
      ...(routeData.safest.geojson.features[0]?.geometry as GeoJSON.LineString)
        ?.coordinates || [],
      ...(routeData.shortest.geojson.features[0]?.geometry as GeoJSON.LineString)
        ?.coordinates || [],
    ];

    if (coordinates.length > 0) {
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(
          coordinates[0] as [number, number],
          coordinates[0] as [number, number]
        )
      );

      currentMap.fitBounds(bounds, { padding: 80 });
    }
  }, [routeData, mapLoaded]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full" />
      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-dark/80 backdrop-blur">
          <div className="text-center p-6">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-2 block">
              map
            </span>
            <p className="text-text-muted text-sm">
              Add NEXT_PUBLIC_MAPBOX_TOKEN to enable the map
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export { MapCanvas };
