/**
 * Insights Page - Route safety analysis and comparison
 *
 * Exports: default InsightsPage component
 * Data flow: Reads routeData from routeSessionStore -> Displays safety metrics and map
 */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, Badge } from "@/components/ui";
import { useRouteSessionStore } from "@/lib/stores/routeSession";
import { useSavedRoutesStore } from "@/lib/stores/savedRoutes";
import type { RouteData } from "@/lib/routes";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeNumber(val: unknown, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function safeArray(val: unknown): string[] {
  return Array.isArray(val) ? val.filter((x) => typeof x === "string") : [];
}

function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

function formatCoverage(coverage: string): string {
  if (!coverage || coverage === "Not provided") return "N/A";
  // Clean up backend values like "graph+routing_engine"
  const cleaned = coverage.toLowerCase().replace(/[_+]/g, " ");
  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function getCoverageVariant(coverage: string): "success" | "warning" | "danger" | "info" {
  const c = coverage.toLowerCase();
  if (c === "high" || c.includes("good")) return "success";
  if (c === "medium" || c.includes("moderate")) return "warning";
  if (c === "low" || c.includes("poor")) return "danger";
  return "info";
}

export default function InsightsPage() {
  const request = useRouteSessionStore((s) => s.request);
  const routeData = useRouteSessionStore((s) => s.routeData);

  const hasReal = Boolean(request && routeData);

  const routeId = request?.routeId ?? "N/A";

  // Safest route data
  const safest: RouteData | null = routeData?.safest ?? null;
  const safetyScoreRaw = safest?.safety_score;
  const safetyScore = clamp(safeNumber(safetyScoreRaw, 0), 0, 100);
  const safestDistance = safeNumber(safest?.distance_m, 0);
  const safestEta = safeNumber(safest?.eta_min, 0);
  const safestCoverage = safest?.coverage ?? "Not provided";
  const safestReasons = safeArray(safest?.reasons);

  // Shortest route data
  const shortest: RouteData | null = routeData?.shortest ?? null;
  const shortestSafetyScore = clamp(safeNumber(shortest?.safety_score, 0), 0, 100);
  const shortestDistance = safeNumber(shortest?.distance_m, 0);
  const shortestEta = safeNumber(shortest?.eta_min, 0);
  const shortestCoverage = shortest?.coverage ?? "Not provided";
  const shortestReasons = safeArray(shortest?.reasons);

  // Delta calculations
  const distanceDelta = safestDistance - shortestDistance;
  const etaDelta = safestEta - shortestEta;
  const safetyDelta = safetyScore - shortestSafetyScore;

  // Radial chart
  const CIRC = 502;
  const compositeOffset = CIRC - (safetyScore / 100) * CIRC;

  // Debug section toggle
  const [showDebug, setShowDebug] = useState(false);

  // Save route state
  const [isSaved, setIsSaved] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const saveRoute = useSavedRoutesStore((s) => s.saveRoute);
  const savedRoutes = useSavedRoutesStore((s) => s.savedRoutes);

  // Check if current route is already saved
  useEffect(() => {
    if (request?.routeId) {
      const exists = savedRoutes.some((r) => r.id === request.routeId);
      setIsSaved(exists);
    }
  }, [request?.routeId, savedRoutes]);

  const handleSaveRoute = () => {
    if (!request || !safest) return;

    const routeIdClean = request.routeId?.replace("#", "") || "Unknown";
    const routeName = `Route ${routeIdClean}`;

    // Create saved route with the same ID as the session routeId
    saveRoute({
      id: request.routeId || `route-${Date.now()}`,
      name: routeName,
      start: request.start,
      startAddress: "Start Location",
      end: request.end,
      endAddress: "End Location",
      distance_m: safest.distance_m,
      safety_score: safest.safety_score,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    });

    setIsSaved(true);
    setSaveNotice("Route saved!");
    setTimeout(() => setSaveNotice(null), 2000);
  };

  // Map ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // already initialized

    let isMounted = true;

    async function initMap() {
      try {
        const maplibregl = await import("maplibre-gl");
        // @ts-expect-error - CSS import has no types
        await import("maplibre-gl/dist/maplibre-gl.css");

        if (!isMounted || !mapContainerRef.current) return;

        const map = new maplibregl.default.Map({
          container: mapContainerRef.current,
          style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
          center: [0, 0],
          zoom: 2,
        });

        mapRef.current = map;

        map.on("load", () => {
          if (!isMounted) return;

          const bounds = new maplibregl.default.LngLatBounds();
          let hasBounds = false;

          // Add safest route if valid geojson
          const safestGeoJson = safest?.geojson;
          if (safestGeoJson && isValidGeoJson(safestGeoJson)) {
            try {
              map.addSource("safest-route", {
                type: "geojson",
                data: safestGeoJson as GeoJSON.GeoJSON,
              });
              map.addLayer({
                id: "safest-route-line",
                type: "line",
                source: "safest-route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#10B981", // emerald/green for safest
                  "line-width": 5,
                  "line-opacity": 0.9,
                },
              });
              extendBoundsFromGeoJson(bounds, safestGeoJson);
              hasBounds = true;
            } catch (e) {
              console.warn("Failed to add safest route to map:", e);
            }
          }

          // Add shortest route if valid geojson
          const shortestGeoJson = shortest?.geojson;
          if (shortestGeoJson && isValidGeoJson(shortestGeoJson)) {
            try {
              map.addSource("shortest-route", {
                type: "geojson",
                data: shortestGeoJson as GeoJSON.GeoJSON,
              });
              map.addLayer({
                id: "shortest-route-line",
                type: "line",
                source: "shortest-route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#F59E0B", // amber for shortest
                  "line-width": 4,
                  "line-opacity": 0.8,
                },
              });
              extendBoundsFromGeoJson(bounds, shortestGeoJson);
              hasBounds = true;
            } catch (e) {
              console.warn("Failed to add shortest route to map:", e);
            }
          }

          // Add start marker
          if (request?.start) {
            const startEl = document.createElement("div");
            startEl.className = "start-marker";
            startEl.style.width = "16px";
            startEl.style.height = "16px";
            startEl.style.backgroundColor = "#10B981";
            startEl.style.borderRadius = "50%";
            startEl.style.border = "3px solid white";
            startEl.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

            new maplibregl.default.Marker({ element: startEl })
              .setLngLat([request.start.lng, request.start.lat])
              .addTo(map);

            bounds.extend([request.start.lng, request.start.lat]);
            hasBounds = true;
          }

          // Add end marker
          if (request?.end) {
            const endEl = document.createElement("div");
            endEl.className = "end-marker";
            endEl.style.width = "16px";
            endEl.style.height = "16px";
            endEl.style.backgroundColor = "#EF4444";
            endEl.style.borderRadius = "50%";
            endEl.style.border = "3px solid white";
            endEl.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

            new maplibregl.default.Marker({ element: endEl })
              .setLngLat([request.end.lng, request.end.lat])
              .addTo(map);

            bounds.extend([request.end.lng, request.end.lat]);
            hasBounds = true;
          }

          // Fit to bounds
          if (hasBounds && !bounds.isEmpty()) {
            map.fitBounds(bounds, { padding: 60, maxZoom: 16 });
          }
        });
      } catch (err) {
        console.error("Map initialization error:", err);
        if (isMounted) {
          setMapError("Failed to load map");
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [safest?.geojson, shortest?.geojson, request?.start, request?.end]);

  return (
    <div className="bg-background-dark min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#7C5CFF]/30
                        bg-gradient-to-r from-[#0B1220]/95 to-[#14213A]/90
                        backdrop-blur-xl shadow-lg ring-1 ring-[#7C5CFF]/20">
        <div className="px-4 sm:px-6 md:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg
                           bg-[#7C5CFF]/20 text-[#8B74FF] border border-[#7C5CFF]/40">
              <span className="material-symbols-outlined text-lg sm:text-xl">insights</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold leading-tight tracking-tight text-white truncate">
                Route Safety Insights
              </h1>
              <p className="text-xs text-text-muted font-medium truncate">
                Route ID: {routeId}
                {!hasReal && (
                  <span className="ml-2 text-[11px] text-secondary">
                    (no data)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {hasReal && (
              <Button
                variant={isSaved ? "ghost" : "primary"}
                size="sm"
                onClick={handleSaveRoute}
                disabled={isSaved}
                className={!isSaved ? `bg-gradient-to-r from-[#7C5CFF] via-[#8B74FF] to-[#4C7DFF]
                          text-white font-bold rounded-xl shadow-lg hover:shadow-xl
                          transition-all duration-300 flex-1 sm:flex-none` : "flex-1 sm:flex-none"}
                leftIcon={
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                    {isSaved ? "bookmark" : "bookmark_border"}
                  </span>
                }
              >
                <span className="hidden sm:inline">{isSaved ? "Saved" : "Save Route"}</span>
                <span className="sm:hidden">{isSaved ? "Saved" : "Save"}</span>
              </Button>
            )}
            <Link href="/app" className="flex-1 sm:flex-none">
              <Button
                variant="ghost"
                size="sm"
                className="w-full hover:bg-[#14213A]/50 border border-transparent hover:border-[#7C5CFF]/40
                          rounded-xl transition-all duration-200"
                leftIcon={
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                    map
                  </span>
                }
              >
                <span className="hidden sm:inline">Back to Map</span>
                <span className="sm:hidden">Map</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Save Notice */}
        {saveNotice && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2
                         rounded-xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/40
                         text-[#8B74FF] text-sm font-medium animate-pulse">
            {saveNotice}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-10 space-y-8">
        {!hasReal ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-text-muted mb-4">
              route
            </span>
            <h2 className="text-xl font-bold text-white mb-2">No Route Data</h2>
            <p className="text-text-muted max-w-md">
              Run a route comparison on the map page first to see real insights here.
            </p>
            <Link href="/app" className="mt-6">
              <Button>Go to Map</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Safety Score Card */}
            <div className="lg:col-span-4 flex flex-col rounded-xl border border-[#7C5CFF]/40
                           bg-gradient-to-br from-[#14213A]/80 to-[#0B1220]/60
                           backdrop-blur-sm p-5 shadow-lg shadow-[#7C5CFF]/5
                           hover:border-[#7C5CFF]/60 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                    Safety Score
                  </h3>
                  <p className="text-2xl font-bold mt-0.5 text-white">
                    {safetyScore}
                    <span className="text-base text-text-muted font-medium">
                      /100
                    </span>
                  </p>
                </div>
                <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                  <span className="material-symbols-outlined text-emerald-500 text-[20px]">
                    {safetyScore >= 70 ? "trending_up" : safetyScore >= 50 ? "trending_flat" : "trending_down"}
                  </span>
                </div>
              </div>

              {/* Radial Chart */}
              <div className="relative flex items-center justify-center py-2 flex-1">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    className="text-slate-700/40"
                    cx="80"
                    cy="80"
                    r="65"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                  />
                  <circle
                    className={safetyScore >= 70 ? "text-emerald-500" : safetyScore >= 50 ? "text-amber-500" : "text-red-500"}
                    cx="80"
                    cy="80"
                    r="65"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={408}
                    strokeDashoffset={408 - (safetyScore / 100) * 408}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">
                    Rating
                  </span>
                  <span className={`text-xl font-bold ${safetyScore >= 70 ? "text-emerald-400" : safetyScore >= 50 ? "text-amber-400" : "text-red-400"}`}>
                    {safetyScore >= 80
                      ? "Good"
                      : safetyScore >= 60
                        ? "Fair"
                        : "Risky"}
                  </span>
                </div>
              </div>

              {/* Shortest comparison */}
              <div className="mt-3 p-2.5 rounded-lg bg-background-dark/50 border border-border-dark">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">Shortest Score</span>
                  <span className="text-sm font-bold text-amber-400">{shortestSafetyScore}/100</span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">Difference</span>
                  <Badge variant={safetyDelta > 0 ? "success" : safetyDelta < 0 ? "danger" : "info"} className="text-[10px]">
                    {safetyDelta > 0 ? "+" : ""}{safetyDelta} pts
                  </Badge>
                </div>
              </div>

            </div>

            {/* Route Comparison */}
            <div className="lg:col-span-5 flex flex-col rounded-xl border border-[#7C5CFF]/40
                           bg-gradient-to-br from-[#14213A]/80 to-[#0B1220]/60
                           backdrop-blur-sm p-5 shadow-lg shadow-[#7C5CFF]/5
                           hover:border-[#7C5CFF]/60 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                    Route Comparison
                  </h3>
                  <p className="text-base font-bold mt-0.5 text-white">Safest vs Shortest</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-text-muted">Safe</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[10px] text-text-muted">Short</span>
                  </div>
                </div>
              </div>

              {/* Comparison rows */}
              <div className="flex flex-col gap-3 flex-1">
                {/* Distance */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-background-dark/50 border border-border-dark">
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-wide">Safest</p>
                    <p className="text-sm font-bold text-emerald-400">{formatDistance(safestDistance)}</p>
                  </div>
                  <div className="text-center flex flex-col items-center justify-center border-x border-border-dark/50">
                    <span className="text-[10px] text-text-muted uppercase tracking-wide">Distance</span>
                    <Badge variant={distanceDelta > 0 ? "warning" : "success"} className="mt-1 text-[10px]">
                      {distanceDelta > 0 ? "+" : ""}{formatDistance(Math.abs(distanceDelta))}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-wide">Shortest</p>
                    <p className="text-sm font-bold text-amber-400">{formatDistance(shortestDistance)}</p>
                  </div>
                </div>

                {/* ETA */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-background-dark/50 border border-border-dark">
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-wide">Safest</p>
                    <p className="text-sm font-bold text-emerald-400">{safestEta} min</p>
                  </div>
                  <div className="text-center flex flex-col items-center justify-center border-x border-border-dark/50">
                    <span className="text-[10px] text-text-muted uppercase tracking-wide">ETA</span>
                    <Badge variant={etaDelta > 0 ? "warning" : "success"} className="mt-1 text-[10px]">
                      {etaDelta > 0 ? "+" : ""}{etaDelta} min
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-wide">Shortest</p>
                    <p className="text-sm font-bold text-amber-400">{shortestEta} min</p>
                  </div>
                </div>

                {/* Coverage */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-background-dark/50 border border-border-dark">
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-wide">Safest</p>
                    <Badge variant={getCoverageVariant(safestCoverage)} className="text-[10px]">
                      {formatCoverage(safestCoverage)}
                    </Badge>
                  </div>
                  <div className="text-center flex flex-col items-center justify-center border-x border-border-dark/50">
                    <span className="text-[10px] text-text-muted uppercase tracking-wide">Coverage</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-wide">Shortest</p>
                    <Badge variant={getCoverageVariant(shortestCoverage)} className="text-[10px]">
                      {formatCoverage(shortestCoverage)}
                    </Badge>
                  </div>
                </div>

                {/* Reasons */}
                <div className="p-3 rounded-lg bg-background-dark/50 border border-border-dark">
                  <p className="text-[10px] text-text-muted mb-2 uppercase tracking-wide font-medium">Reasons (Safest)</p>
                  {safestReasons.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {safestReasons.map((r, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          title={r}
                        >
                          {r.length > 30 ? r.slice(0, 30) + "…" : r}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted/60 italic">No reasons provided</p>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-background-dark/50 border border-border-dark">
                  <p className="text-[10px] text-text-muted mb-2 uppercase tracking-wide font-medium">Reasons (Shortest)</p>
                  {shortestReasons.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {shortestReasons.map((r, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          title={r}
                        >
                          {r.length > 30 ? r.slice(0, 30) + "…" : r}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted/60 italic">No reasons provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics Cards (using real data) */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              {/* Distance Card */}
              <div className="flex-1 rounded-xl border border-[#7C5CFF]/40
                             bg-gradient-to-br from-[#14213A]/80 to-[#0B1220]/60
                             backdrop-blur-sm p-4 shadow-lg shadow-[#7C5CFF]/5
                             hover:border-[#7C5CFF]/60 transition-all duration-200
                             flex flex-col justify-center min-h-[120px]">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                    <span className="material-symbols-outlined text-[18px]">
                      straighten
                    </span>
                  </div>
                  <Badge
                    variant={distanceDelta > 0 ? "warning" : "success"}
                    className="text-[10px]"
                  >
                    {distanceDelta > 0 ? "+" : ""}{formatDistance(Math.abs(distanceDelta))}
                  </Badge>
                </div>
                <p className="text-text-muted text-[10px] font-medium uppercase tracking-wide">
                  Route Distance
                </p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {formatDistance(safestDistance)}
                </p>
                <p className="text-[10px] text-text-muted/60 mt-0.5">Safest route</p>
              </div>

              {/* ETA Card */}
              <div className="flex-1 rounded-xl border border-[#7C5CFF]/40
                             bg-gradient-to-br from-[#14213A]/80 to-[#0B1220]/60
                             backdrop-blur-sm p-4 shadow-lg shadow-[#7C5CFF]/5
                             hover:border-[#7C5CFF]/60 transition-all duration-200
                             flex flex-col justify-center min-h-[120px]">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                    <span className="material-symbols-outlined text-[18px]">
                      schedule
                    </span>
                  </div>
                  <Badge
                    variant={etaDelta > 0 ? "warning" : "success"}
                    className="text-[10px]"
                  >
                    {etaDelta > 0 ? "+" : ""}{etaDelta} min
                  </Badge>
                </div>
                <p className="text-text-muted text-[10px] font-medium uppercase tracking-wide">
                  Estimated Time
                </p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {safestEta} min
                </p>
                <p className="text-[10px] text-text-muted/60 mt-0.5">Safest route</p>
              </div>

              {/* Coverage Card */}
              <div className="flex-1 rounded-xl border border-[#7C5CFF]/40
                             bg-gradient-to-br from-[#14213A]/80 to-[#0B1220]/60
                             backdrop-blur-sm p-4 shadow-lg shadow-[#7C5CFF]/5
                             hover:border-[#7C5CFF]/60 transition-all duration-200
                             flex flex-col justify-center min-h-[120px]">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                    <span className="material-symbols-outlined text-[18px]">
                      shield
                    </span>
                  </div>
                  <Badge
                    variant={getCoverageVariant(safestCoverage)}
                    className="text-[10px]"
                  >
                    {formatCoverage(safestCoverage)}
                  </Badge>
                </div>
                <p className="text-text-muted text-[10px] font-medium uppercase tracking-wide">
                  Coverage
                </p>
                <p className="text-lg font-bold text-white mt-0.5 truncate" title={safestCoverage}>
                  {formatCoverage(safestCoverage)}
                </p>
                <p className="text-[10px] text-text-muted/60 mt-0.5">Safest route</p>
              </div>
            </div>

            {/* Route Visualization Map */}
            <div className="lg:col-span-12 rounded-xl border border-[#7C5CFF]/40
                           bg-gradient-to-br from-[#14213A]/50 to-[#0B1220]/50
                           backdrop-blur-sm overflow-hidden flex flex-col relative h-[400px]
                           shadow-lg shadow-[#7C5CFF]/5">
              <div className="absolute top-3 left-3 z-10 bg-[#0B1220]/95 backdrop-blur-sm
                             px-3 py-2.5 rounded-lg border border-[#7C5CFF]/40 shadow-xl">
                <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">
                  Legend
                </h3>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-[3px] rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-slate-300">Safest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-[3px] rounded-full bg-amber-500" />
                    <span className="text-[11px] text-slate-300">Shortest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                    <span className="text-[11px] text-slate-300">Start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
                    <span className="text-[11px] text-slate-300">End</span>
                  </div>
                </div>
              </div>

              <div
                ref={mapContainerRef}
                className="w-full h-full relative rounded-lg overflow-hidden"
              >
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-text-muted text-sm">
                    {mapError}
                  </div>
                )}
              </div>
            </div>

            {/* Debug Section */}
            <div className="lg:col-span-12 rounded-xl border border-[#7C5CFF]/30 bg-[#14213A]/30 p-3">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="flex items-center gap-2 text-xs text-text-muted/70
                          hover:text-text-muted transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {showDebug ? "expand_less" : "expand_more"}
                </span>
                Debug: Raw Backend Response
              </button>
              {showDebug && (
                <pre className="mt-3 p-3 bg-[#0B1220]/80 rounded-lg border border-[#7C5CFF]/30
                               overflow-auto text-[10px] text-text-muted/60 max-h-[300px] font-mono">
                  {JSON.stringify(routeData, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper to check if geojson is valid enough to render
function isValidGeoJson(geojson: unknown): boolean {
  if (!geojson || typeof geojson !== "object") return false;
  const g = geojson as Record<string, unknown>;
  // Accept FeatureCollection, Feature, or geometry types
  const validTypes = [
    "FeatureCollection",
    "Feature",
    "LineString",
    "MultiLineString",
    "Point",
    "MultiPoint",
    "Polygon",
    "MultiPolygon",
    "GeometryCollection",
  ];
  return typeof g.type === "string" && validTypes.includes(g.type);
}

// Extend bounds from geojson coordinates
function extendBoundsFromGeoJson(
  bounds: maplibregl.LngLatBounds,
  geojson: unknown
): void {
  try {
    const g = geojson as Record<string, unknown>;

    if (g.type === "FeatureCollection" && Array.isArray(g.features)) {
      for (const feature of g.features) {
        extendBoundsFromGeoJson(bounds, feature);
      }
    } else if (g.type === "Feature" && g.geometry) {
      extendBoundsFromGeoJson(bounds, g.geometry);
    } else if (g.type === "LineString" && Array.isArray(g.coordinates)) {
      for (const coord of g.coordinates as [number, number][]) {
        if (Array.isArray(coord) && coord.length >= 2) {
          bounds.extend([coord[0], coord[1]]);
        }
      }
    } else if (g.type === "MultiLineString" && Array.isArray(g.coordinates)) {
      for (const line of g.coordinates as [number, number][][]) {
        for (const coord of line) {
          if (Array.isArray(coord) && coord.length >= 2) {
            bounds.extend([coord[0], coord[1]]);
          }
        }
      }
    } else if (g.type === "Point" && Array.isArray(g.coordinates)) {
      const coord = g.coordinates as [number, number];
      if (coord.length >= 2) {
        bounds.extend([coord[0], coord[1]]);
      }
    }
  } catch (e) {
    console.warn("Error extending bounds from geojson:", e);
  }
}
