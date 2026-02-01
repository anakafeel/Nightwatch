"use client";

import { useMemo, useState } from "react";
import { AppNav } from "@/components/layout/AppNav";
import { Button, Slider } from "@/components/ui";
import { MapCanvas } from "@/components/map/MapCanvas";
import { MapControls } from "@/components/map/MapControls";
import { RouteCard } from "@/components/map/RouteCard";
import { WhyThisRoute } from "@/components/map/WhyThisRoute";
import { useRouteQuery } from "@/lib/hooks/useRouteQuery";
import { usePreferencesStore } from "@/lib/stores/preferences";
import { isDemoMode } from "@/lib/api";
import type { RouteMode } from "@/lib/routes";

/**
 * Demo: Ottawa-only dropdown choices measured from Carleton University.
 * No geocoding required — each option includes lat/lng.
 */
type DemoLocation = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

const CARLETON: DemoLocation = {
  id: "carleton",
  label: "Carleton University",
  lat: 45.3876,
  lng: -75.696,
};

const OTTAWA_LOCATIONS: DemoLocation[] = [
  CARLETON,
  { id: "uottawa", label: "University of Ottawa", lat: 45.4231, lng: -75.6831 },
  { id: "rideau", label: "CF Rideau Centre", lat: 45.4256, lng: -75.6924 },
  { id: "byward", label: "ByWard Market", lat: 45.4277, lng: -75.6922 },
  { id: "parliament", label: "Parliament Hill", lat: 45.4236, lng: -75.7009 },
  { id: "lansdowne", label: "Lansdowne Park", lat: 45.3989, lng: -75.6833 },
  {
    id: "ottawa_station",
    label: "Ottawa Station (VIA Rail)",
    lat: 45.4166,
    lng: -75.6513,
  },
];

/** Simple distance helpers (for “X km from Carleton”) */
function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s));
}

function formatKm(meters: number) {
  const km = meters / 1000;
  return km >= 10 ? `${km.toFixed(0)} km` : `${km.toFixed(1)} km`;
}

export default function AppPage() {
  const [mode, setMode] = useState<RouteMode>("night");
  const [maxDetour, setMaxDetour] = useState(15);
  const [lightsWeight, setLightsWeight] = useState(80);
  const [observabilityWeight, setObservabilityWeight] = useState(45);
  const [selectedRoute, setSelectedRoute] = useState<"safest" | "shortest">(
    "safest",
  );

  // Ottawa dropdown state
  const [startId, setStartId] = useState<string>("carleton");
  const [endId, setEndId] = useState<string>("byward");

  const { fetchRoute, data: routeData, isLoading } = useRouteQuery();
  const showCctv = usePreferencesStore((state) => state.showCctvIndicators);

  const startLoc = useMemo(
    () => OTTAWA_LOCATIONS.find((l) => l.id === startId) ?? CARLETON,
    [startId],
  );

  const endChoices = useMemo(
    () => OTTAWA_LOCATIONS.filter((l) => l.id !== startId),
    [startId],
  );

  const endLoc = useMemo(() => {
    const found = endChoices.find((l) => l.id === endId);
    return found ?? endChoices[0] ?? CARLETON;
  }, [endChoices, endId]);

  const onSubmit = () => {
    // reset selection so UI consistently highlights safest when a new request runs
    setSelectedRoute("safest");

    fetchRoute({
      start: { lat: startLoc.lat, lng: startLoc.lng },
      end: { lat: endLoc.lat, lng: endLoc.lng },
      mode,
      maxDetour,
      weights: {
        lights: lightsWeight,
        cameras: observabilityWeight,
      },
      useCctv: showCctv,
    });
  };

  const getDetourLabel = (value: number) => {
    if (value <= 5) return "5%";
    if (value <= 10) return "10%";
    if (value <= 15) return "15%";
    if (value <= 20) return "20%";
    return `${value}%`;
  };

  const getWeightLabel = (value: number) => {
    if (value <= 30) return "Low";
    if (value <= 60) return "Medium";
    return "High";
  };

  return (
    <div className="bg-background-dark text-white font-display overflow-hidden h-screen flex flex-col">
      <AppNav />

      {/* Demo Mode Badge */}
      {isDemoMode && (
        <div className="absolute top-16 right-4 z-50 px-3 py-1 rounded-full bg-noor-gold/20 border border-noor-gold/30 text-noor-gold text-xs font-medium">
          Demo Mode
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-full md:w-[420px] flex flex-col z-20 glass-panel border-r border-border-dark h-full overflow-y-auto custom-scrollbar shadow-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="p-6 space-y-8"
          >
            {/* Navigation Inputs */}
            <div className="space-y-4">
              <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider">
                Navigation
              </h3>

              {/* Start Location Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white block">
                  Start Location
                </label>
                <select
                  value={startId}
                  onChange={(e) => {
                    const nextStart = e.target.value;
                    setStartId(nextStart);

                    // If destination equals new start, reset destination to first valid option
                    if (endId === nextStart) {
                      const nextEnd = OTTAWA_LOCATIONS.find(
                        (l) => l.id !== nextStart,
                      )?.id;
                      if (nextEnd) setEndId(nextEnd);
                    }
                  }}
                  className="w-full rounded-lg border border-border-dark bg-surface-dark px-3 py-3 text-white outline-none"
                >
                  {OTTAWA_LOCATIONS.map((loc) => {
                    const d = haversineMeters(CARLETON, loc);
                    return (
                      <option key={loc.id} value={loc.id}>
                        {loc.label}
                        {loc.id === "carleton"
                          ? ""
                          : ` • ${formatKm(d)} from Carleton`}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Destination Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white block">
                  Destination
                </label>
                <select
                  value={endLoc.id}
                  onChange={(e) => setEndId(e.target.value)}
                  className="w-full rounded-lg border border-border-dark bg-surface-dark px-3 py-3 text-white outline-none"
                >
                  {endChoices.map((loc) => {
                    const d = haversineMeters(CARLETON, loc);
                    return (
                      <option key={loc.id} value={loc.id}>
                        {loc.label} • {formatKm(d)} from Carleton
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="h-px bg-border-dark w-full" />

            {/* Preferences Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider">
                  Preferences
                </h3>

                {/* Day/Night Toggle */}
                <div className="flex bg-surface-dark p-1 rounded-lg border border-border-dark">
                  <button
                    type="button"
                    onClick={() => setMode("day")}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      mode === "day"
                        ? "bg-border-dark text-white shadow-sm"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      light_mode
                    </span>
                    Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("night")}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      mode === "night"
                        ? "bg-border-dark text-white shadow-sm"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      dark_mode
                    </span>
                    Night
                  </button>
                </div>
              </div>

              {/* Max Detour Slider */}
              <Slider
                label="Max Detour"
                valueLabel={getDetourLabel(maxDetour)}
                min={0}
                max={30}
                value={maxDetour}
                onChange={(e) => setMaxDetour(Number(e.target.value))}
              />

              {/* Safety Weights */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white block">
                  Safety Priorities
                </label>

                {/* Lighting Slider */}
                <div className="bg-surface-dark p-3 rounded-lg border border-border-dark">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-text-muted">
                      <span className="material-symbols-outlined text-[18px]">
                        lightbulb
                      </span>
                      <span className="text-xs font-medium">
                        Street Lighting
                      </span>
                    </div>
                    <span className="text-xs text-white">
                      {getWeightLabel(lightsWeight)}
                    </span>
                  </div>
                  <div className="relative flex items-center h-2 w-full">
                    <div className="absolute h-1 w-full bg-border-dark rounded-full" />
                    <div
                      className="absolute h-1 bg-primary/70 rounded-full"
                      style={{ width: `${lightsWeight}%` }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={lightsWeight}
                      onChange={(e) => setLightsWeight(Number(e.target.value))}
                      className="absolute w-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute size-3 bg-primary rounded-full"
                      style={{
                        left: `${lightsWeight}%`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </div>
                </div>

                {/* Observability Slider */}
                <div className="bg-surface-dark p-3 rounded-lg border border-border-dark">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-text-muted">
                      <span className="material-symbols-outlined text-[18px]">
                        visibility
                      </span>
                      <span className="text-xs font-medium">Observability</span>
                    </div>
                    <span className="text-xs text-white">
                      {getWeightLabel(observabilityWeight)}
                    </span>
                  </div>
                  <div className="relative flex items-center h-2 w-full">
                    <div className="absolute h-1 w-full bg-border-dark rounded-full" />
                    <div
                      className="absolute h-1 bg-primary/70 rounded-full"
                      style={{ width: `${observabilityWeight}%` }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={observabilityWeight}
                      onChange={(e) =>
                        setObservabilityWeight(Number(e.target.value))
                      }
                      className="absolute w-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute size-3 bg-primary rounded-full"
                      style={{
                        left: `${observabilityWeight}%`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action */}
            <Button
              type="submit"
              className="w-full py-4"
              isLoading={isLoading}
              leftIcon={
                <span className="material-symbols-outlined">security</span>
              }
            >
              Find Safest Route
            </Button>
          </form>
        </aside>

        {/* Map View */}
        <main className="flex-1 relative bg-[#0b1215] overflow-hidden hidden md:block">
          {/* ✅ Map Canvas — required wiring */}
          <MapCanvas
            routeData={routeData}
            start={{ lat: startLoc.lat, lng: startLoc.lng }}
            end={{ lat: endLoc.lat, lng: endLoc.lng }}
            center={[CARLETON.lng, CARLETON.lat]}
            zoom={13}
            selectedRoute={selectedRoute}
            fitOnRoute={false}
            className="absolute inset-0 z-10"
          />

          {/* Route Recommendation Card */}
          {routeData && (
            <RouteCard
              safest={routeData.safest}
              shortest={routeData.shortest}
              selectedRoute={selectedRoute}
              onSelectRoute={setSelectedRoute}
              className="absolute top-8 left-8 z-20"
            />
          )}

          {/* Why This Route Tooltip */}
          {routeData && selectedRoute === "safest" && (
            <div className="absolute top-[35%] left-[50%] z-20 transform -translate-x-1/2 -translate-y-full">
              <WhyThisRoute reasons={routeData.safest.reasons} />
            </div>
          )}

          {/* Map Controls */}
          <MapControls
            className="absolute bottom-8 right-8 z-20"
            onZoomIn={() => console.log("Zoom in")}
            onZoomOut={() => console.log("Zoom out")}
            onRecenter={() => console.log("Recenter")}
          />
        </main>

        {/* Mobile Map (UI placeholder) */}
        <div className="flex-1 relative bg-[#0b1215] md:hidden">
          <div className="absolute inset-0 bg-map-pattern" />
          <div className="absolute bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-lg border-t border-border-dark rounded-t-3xl p-6 z-20">
            <div className="w-12 h-1 bg-border-dark rounded-full mx-auto mb-4" />
            {routeData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold text-lg">
                    Safest Route
                  </span>
                  <span className="text-white font-bold">
                    {routeData.safest.eta_min} min
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-surface-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${routeData.safest.safety_score}%` }}
                    />
                  </div>
                  <span className="text-primary font-bold text-xs">
                    {routeData.safest.safety_score}% Safety
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-text-muted text-center">
                Pick locations and find your safest route
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
