"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import type { RouteData } from "@/lib/routes";

interface RouteCardProps {
  safest: RouteData;
  shortest: RouteData;
  selectedRoute: "safest" | "shortest";
  onSelectRoute: (route: "safest" | "shortest") => void;
  className?: string;
}

function RouteCard({
  safest,
  shortest,
  selectedRoute,
  onSelectRoute,
  className,
}: RouteCardProps) {
  return (
    <div
      className={cn(
        "w-[340px] glass-panel border border-border-dark rounded-xl shadow-2xl overflow-hidden animate-fade-in",
        className,
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border-dark/50 flex justify-between items-center bg-white/5">
        <h4 className="text-white font-semibold text-sm">
          Route Recommendation
        </h4>
        <span className="text-text-muted text-xs">Updated 1m ago</span>
      </div>

      {/* Safest Route Option */}
      <button
        onClick={() => onSelectRoute("safest")}
        className={cn(
          "w-full p-4 text-left relative cursor-pointer transition-colors border-l-4",
          selectedRoute === "safest"
            ? "bg-primary/10 border-primary"
            : "border-transparent hover:bg-white/5",
        )}
      >
        {selectedRoute === "safest" && (
          <div className="absolute top-3 right-3">
            <span className="material-symbols-outlined text-primary">
              check_circle
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-primary font-bold text-lg">Safest</span>
          <Badge
            variant="default"
            className="bg-primary text-background-dark text-[10px]"
          >
            RECOMMENDED
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm mb-2">
          <span className="font-medium text-white">{safest.eta_min} min</span>
          <span className="text-text-muted">
            {(safest.distance_m / 1000).toFixed(1)} km
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-background-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${safest.safety_score}%` }}
            />
          </div>
          <span className="text-primary font-bold text-xs">
            {safest.safety_score}% Safety
          </span>
        </div>
        {safest.reasons && safest.reasons.length > 0 && (
          <div className="mt-2 flex gap-2 text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">
                lightbulb
              </span>
              High Lighting
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">
                security
              </span>
              Patrolled
            </span>
          </div>
        )}
      </button>

      {/* Shortest Route Option */}
      <button
        onClick={() => onSelectRoute("shortest")}
        className={cn(
          "w-full p-4 text-left transition-colors border-l-4",
          selectedRoute === "shortest"
            ? "bg-white/5 border-gray-500"
            : "border-transparent opacity-70 hover:opacity-100 hover:bg-white/5",
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-bold text-lg">Shortest</span>
        </div>
        <div className="flex items-center gap-4 text-sm mb-2">
          <span className="font-medium text-white">{shortest.eta_min} min</span>
          <span className="text-text-muted">
            {(shortest.distance_m / 1000).toFixed(1)} km
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-background-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-500"
              style={{ width: `${shortest.safety_score}%` }}
            />
          </div>
          <span className="text-gray-400 font-bold text-xs">
            {shortest.safety_score}% Safety
          </span>
        </div>
      </button>
    </div>
  );
}

export { RouteCard };
