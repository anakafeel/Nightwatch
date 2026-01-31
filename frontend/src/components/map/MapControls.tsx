"use client";

import { cn } from "@/lib/utils";

interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRecenter?: () => void;
  className?: string;
}

function MapControls({
  onZoomIn,
  onZoomOut,
  onRecenter,
  className,
}: MapControlsProps) {
  const buttonClass =
    "size-10 bg-surface-dark hover:bg-border-dark border border-border-dark text-white rounded-lg flex items-center justify-center shadow-lg transition-colors";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <button
        className={buttonClass}
        onClick={onZoomIn}
        title="Zoom In"
        aria-label="Zoom in"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
      <button
        className={buttonClass}
        onClick={onZoomOut}
        title="Zoom Out"
        aria-label="Zoom out"
      >
        <span className="material-symbols-outlined">remove</span>
      </button>
      <div className="h-2" />
      <button
        className={cn(buttonClass, "text-primary")}
        onClick={onRecenter}
        title="Re-center"
        aria-label="Re-center map"
      >
        <span className="material-symbols-outlined">near_me</span>
      </button>
    </div>
  );
}

export { MapControls };
