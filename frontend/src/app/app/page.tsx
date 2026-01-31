"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AppNav } from "@/components/layout/AppNav";
import { Button, Input, Slider } from "@/components/ui";
import { MapCanvas } from "@/components/map/MapCanvas";
import { MapControls } from "@/components/map/MapControls";
import { RouteCard } from "@/components/map/RouteCard";
import { WhyThisRoute } from "@/components/map/WhyThisRoute";
import { useRouteQuery } from "@/lib/hooks/useRouteQuery";
import { usePreferencesStore } from "@/lib/stores/preferences";
import { isDemoMode } from "@/lib/api";
import type { RouteMode } from "@/lib/routes";

interface RouteFormData {
  start: string;
  end: string;
}

export default function AppPage() {
  const [mode, setMode] = useState<RouteMode>("night");
  const [maxDetour, setMaxDetour] = useState(15);
  const [lightsWeight, setLightsWeight] = useState(80);
  const [observabilityWeight, setObservabilityWeight] = useState(45);
  const [selectedRoute, setSelectedRoute] = useState<"safest" | "shortest">("safest");

  const { fetchRoute, data: routeData, isLoading } = useRouteQuery();
  const showCctv = usePreferencesStore((state) => state.showCctvIndicators);

  const { register, handleSubmit } = useForm<RouteFormData>({
    defaultValues: {
      start: "Central Station",
      end: "Riverside Plaza",
    },
  });

  const onSubmit = (data: RouteFormData) => {
    // In a real app, we'd geocode these addresses first
    fetchRoute({
      start: { lat: 40.7484, lng: -73.9857 },
      end: { lat: 40.7612, lng: -73.9678 },
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
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Navigation Inputs */}
            <div className="space-y-4">
              <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider">
                Navigation
              </h3>

              {/* Start Location */}
              <Input
                label="Start Location"
                placeholder="Enter start point..."
                leftIcon={
                  <span className="material-symbols-outlined text-[20px]">
                    my_location
                  </span>
                }
                rightIcon={
                  <button
                    type="button"
                    className="p-1 text-primary hover:bg-primary/10 rounded-md transition-colors"
                    title="Locate Me"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      gps_fixed
                    </span>
                  </button>
                }
                {...register("start")}
              />

              {/* Destination */}
              <Input
                label="Destination"
                placeholder="Where to?"
                leftIcon={
                  <span className="material-symbols-outlined text-[20px]">
                    location_on
                  </span>
                }
                {...register("end")}
              />
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
                      <span className="text-xs font-medium">Street Lighting</span>
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
                      style={{ left: `${lightsWeight}%`, transform: "translateX(-50%)" }}
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
                      onChange={(e) => setObservabilityWeight(Number(e.target.value))}
                      className="absolute w-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute size-3 bg-primary rounded-full"
                      style={{ left: `${observabilityWeight}%`, transform: "translateX(-50%)" }}
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
          {/* Map Canvas or Fallback */}
          <MapCanvas
            routeData={routeData}
            className="absolute inset-0 z-0"
          />

          {/* Fallback Map Background (shown when no Mapbox token) */}
          <div className="absolute inset-0 z-0 bg-map-pattern">
            {/* SVG Route Visualization */}
            {routeData && (
              <svg
                className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="safeRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#13c8ec", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#0ea5e9", stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Shortest Route (Dashed Gray) */}
                <path
                  d="M 450 600 Q 600 550 700 650 T 1100 400"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="3"
                  strokeDasharray="8,8"
                  strokeOpacity="0.6"
                />
                {/* Safest Route (Glowing Teal) */}
                <path
                  d="M 450 600 C 500 500, 650 350, 800 400 S 1000 300, 1100 400"
                  fill="none"
                  stroke="url(#safeRouteGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                {/* Start Point */}
                <circle cx="450" cy="600" r="8" fill="#13c8ec" stroke="white" strokeWidth="3" />
                {/* End Point */}
                <circle cx="1100" cy="400" r="8" fill="#ef4444" stroke="white" strokeWidth="3" />
              </svg>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-background-dark/80 via-transparent to-transparent pointer-events-none" />

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

          {/* Map Attribution */}
          <div className="absolute bottom-2 right-2 z-10 text-[10px] text-gray-500 opacity-50 px-2 pointer-events-none select-none">
            &copy; Mapbox &copy; OpenStreetMap
          </div>
        </main>

        {/* Mobile Map (Full Screen with Bottom Sheet) */}
        <div className="flex-1 relative bg-[#0b1215] md:hidden">
          <div className="absolute inset-0 bg-map-pattern" />
          <div className="absolute bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-lg border-t border-border-dark rounded-t-3xl p-6 z-20">
            <div className="w-12 h-1 bg-border-dark rounded-full mx-auto mb-4" />
            {routeData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold text-lg">Safest Route</span>
                  <span className="text-white font-bold">{routeData.safest.eta_min} min</span>
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
                Enter locations and find your safest route
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
