/**
 * App Page - Main route planning interface
 *
 * Exports: default AppPage component
 * Data flow: User selects start/end locations -> onSubmit calls fetchRouteAsync ->
 *            Result stored in routeSession store -> MapCanvas renders routes
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { AppNav } from "@/components/layout/AppNav";
import { Button } from "@/components/ui";
import { MapCanvas } from "@/components/map/MapCanvas";
import { MapControls } from "@/components/map/MapControls";
import { RouteCard } from "@/components/map/RouteCard";
import { WhyThisRoute } from "@/components/map/WhyThisRoute";
import { useRouteQuery } from "@/lib/hooks/useRouteQuery";
import { useRouteSessionStore } from "@/lib/stores/routeSession";
import { useSavedRoutesStore } from "@/lib/stores/savedRoutes";
import { isDemoMode } from "@/lib/api";

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
  { id: "orleans", label: "Orléans", lat: 45.4765, lng: -75.5119 },
  { id: "mooneys_bay", label: "Mooney’s Bay", lat: 45.3666, lng: -75.684 },
  { id: "kanata", label: "Kanata", lat: 45.309, lng: -75.898 },
  { id: "bayshore", label: "Bayshore", lat: 45.3484, lng: -75.8079 },
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

function makeRouteId() {
  const a = Math.random().toString(16).slice(2, 6).toUpperCase();
  const b = Math.random().toString(16).slice(2, 10).toUpperCase();
  return `#${a}-${b}`;
}

export default function AppPage() {
  const [selectedRoute, setSelectedRoute] = useState<"safest" | "shortest">(
    "safest",
  );

  // Ottawa dropdown state
  const [startId, setStartId] = useState<string>("carleton");
  const [endId, setEndId] = useState<string>("byward");

  // Rerun notification state
  const [rerunNotice, setRerunNotice] = useState<string | null>(null);

  const { fetchRouteAsync, data: routeData, isLoading } = useRouteQuery();

  const setSession = useRouteSessionStore((s) => s.setSession);
  const consumeRerunData = useSavedRoutesStore((s) => s.consumeRerunData);
  const addToHistory = useSavedRoutesStore((s) => s.addToHistory);

  // Find closest matching location by coordinates
  const findClosestLocation = (
    lat: number,
    lng: number,
  ): DemoLocation | null => {
    let closest: DemoLocation | null = null;
    let minDistance = Infinity;
    const threshold = 500; // 500 meters tolerance

    for (const loc of OTTAWA_LOCATIONS) {
      const dist = haversineMeters({ lat, lng }, loc);
      if (dist < minDistance && dist < threshold) {
        minDistance = dist;
        closest = loc;
      }
    }
    return closest;
  };

  // Consume rerun data on mount (intentionally only runs once)
  useEffect(() => {
    const rerunData = consumeRerunData();
    if (rerunData) {
      const startMatch = findClosestLocation(
        rerunData.start.lat,
        rerunData.start.lng,
      );
      const endMatch = findClosestLocation(
        rerunData.end.lat,
        rerunData.end.lng,
      );

      if (startMatch && endMatch) {
        setStartId(startMatch.id);
        setEndId(endMatch.id);
        setRerunNotice(
          `Loaded route: ${rerunData.startAddress} to ${rerunData.endAddress}`,
        );
      } else {
        // Coordinates don't match known locations
        setRerunNotice(
          "Route locations not available in demo. Select from the dropdown options.",
        );
      }

      // Clear notice after 4 seconds
      setTimeout(() => setRerunNotice(null), 4000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onSubmit = async () => {
    // reset selection so UI consistently highlights safest when a new request runs
    setSelectedRoute("safest");

    const req = {
      start: { lat: startLoc.lat, lng: startLoc.lng },
      end: { lat: endLoc.lat, lng: endLoc.lng },
    };

    // IMPORTANT: use mutateAsync so we can await the result
    const result = await fetchRouteAsync(req);

    if (result) {
      const routeId = makeRouteId();

      setSession(
        {
          ...req,
          createdAt: Date.now(),
          routeId,
        },
        result,
      );

      // Add to history
      addToHistory({
        id: routeId,
        start: req.start,
        startAddress: startLoc.label,
        end: req.end,
        endAddress: endLoc.label,
        distance_m: result.safest.distance_m,
        safety_score: result.safest.safety_score,
        createdAt: new Date().toISOString(),
      });
    }
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

      {/* Rerun Notice */}
      {rerunNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary text-sm font-medium animate-pulse">
          {rerunNotice}
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className="w-full md:w-[380px] lg:w-[420px] flex flex-col z-20
                  bg-gradient-to-br from-[#0B1220]/95 to-[#14213A]/90
                  backdrop-blur-xl md:border-r border-b md:border-b-0 border-[#7C5CFF]/50
                  overflow-y-auto custom-scrollbar
                  shadow-lg
                  ring-1 ring-[#7C5CFF]/40
                  shrink-0"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit();
            }}
            className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6"
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
                  className="w-full rounded-xl border border-[#7C5CFF]/60 bg-[#14213A]/80 
                            hover:border-[#7C5CFF]/90 px-4 py-3.5 text-white 
                            outline-none backdrop-blur transition-all duration-200 
                            focus:ring-2 focus:ring-[#7C5CFF]/60"
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
                  className="w-full rounded-xl border border-[#7C5CFF]/60 bg-[#14213A]/80 
                            hover:border-[#7C5CFF]/90 px-4 py-3.5 text-white 
                            outline-none backdrop-blur transition-all duration-200 
                            focus:ring-2 focus:ring-[#7C5CFF]/60"
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

            {/* Primary Action */}
            <Button
              type="submit"
              className="w-full py-7 h-1.5 bg-gradient-to-r from-[#7C5CFF] via-[#8B74FF] to-[#4C7DFF] 
                              hover:from-[#7C5CFF]/95 hover:via-[#8B74FF]/95 hover:to-[#4C7DFF]/95 
                              shadow-lg hover:shadow-xl text-white font-bold rounded-xl 
                              backdrop-blur transition-all duration-300 
                              focus:ring-4 focus:ring-[#7C5CFF]/50 border-transparent"
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
        <main className="flex-1 min-h-[50vh] md:min-h-0 relative bg-[#0B1220] overflow-hidden">
          {/* Map Canvas */}
          <MapCanvas
            routeData={routeData}
            start={{ lat: startLoc.lat, lng: startLoc.lng }}
            end={{ lat: endLoc.lat, lng: endLoc.lng }}
            center={[CARLETON.lng, CARLETON.lat]}
            zoom={12}
            selectedRoute={selectedRoute}
            fitOnRoute={true}
            className="absolute inset-0 z-10"
          />

          {/* Route Recommendation Card - Desktop */}
          {routeData && (
            <RouteCard
              safest={routeData.safest}
              shortest={routeData.shortest}
              selectedRoute={selectedRoute}
              onSelectRoute={setSelectedRoute}
              className="absolute top-4 left-4 z-20 hidden md:block md:top-8 md:left-8"
            />
          )}

          {/* Why This Route Tooltip - Desktop only */}
          {routeData && selectedRoute === "safest" && (
            <div className="absolute top-[35%] left-[50%] z-20 transform -translate-x-1/2 -translate-y-full hidden md:block">
              <WhyThisRoute reasons={routeData.safest.reasons} />
            </div>
          )}

          {/* Map Controls */}
          <MapControls
            className="absolute bottom-36 md:bottom-8 right-4 md:right-8 z-20"
            onZoomIn={() => console.log("Zoom in")}
            onZoomOut={() => console.log("Zoom out")}
            onRecenter={() => console.log("Recenter")}
          />

          {/* Mobile Route Selection Card */}
          {routeData && (
            <div className="absolute bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-xl border-t border-[#7C5CFF]/30 rounded-t-2xl z-20 md:hidden">
              {/* Toggle Buttons */}
              <div className="flex border-b border-border-dark/50">
                <button
                  onClick={() => setSelectedRoute("safest")}
                  className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                    selectedRoute === "safest"
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-text-muted"
                  }`}
                >
                  Safest
                </button>
                <button
                  onClick={() => setSelectedRoute("shortest")}
                  className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                    selectedRoute === "shortest"
                      ? "text-white border-b-2 border-white bg-white/5"
                      : "text-text-muted"
                  }`}
                >
                  Shortest
                </button>
              </div>

              {/* Route Info */}
              <div className="p-4">
                {selectedRoute === "safest" ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">Safest Route</span>
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          RECOMMENDED
                        </span>
                      </div>
                      <span className="text-white font-bold">
                        {routeData.safest.eta_min} min
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <span>{(routeData.safest.distance_m / 1000).toFixed(1)} km</span>
                      <span>•</span>
                      <span className="text-primary font-semibold">
                        {routeData.safest.safety_score}% Safety
                      </span>
                    </div>
                    <div className="h-1.5 bg-surface-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${routeData.safest.safety_score}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Shortest Route</span>
                      <span className="text-white font-bold">
                        {routeData.shortest.eta_min} min
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <span>{(routeData.shortest.distance_m / 1000).toFixed(1)} km</span>
                      <span>•</span>
                      <span className="text-gray-400 font-semibold">
                        {routeData.shortest.safety_score}% Safety
                      </span>
                    </div>
                    <div className="h-1.5 bg-surface-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-500 transition-all"
                        style={{ width: `${routeData.shortest.safety_score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
