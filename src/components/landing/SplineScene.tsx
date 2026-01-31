"use client";

import { Suspense, lazy } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

// Lazy load Spline to reduce initial bundle size
const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  sceneUrl?: string;
  fallbackImage?: string;
  className?: string;
}

function SplineFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-full bg-gradient-to-br from-background-dark to-surface-dark flex items-center justify-center",
        className
      )}
    >
      <div className="text-center">
        <span className="material-symbols-outlined text-6xl text-primary/30 animate-pulse">
          view_in_ar
        </span>
        <p className="text-text-muted text-sm mt-2">Loading 3D scene...</p>
      </div>
    </div>
  );
}

function SplineScene({
  sceneUrl,
  fallbackImage,
  className,
}: SplineSceneProps) {
  const reduceMotion = useReducedMotion();

  // TODO: Replace with your Spline community model URL
  const defaultSceneUrl = sceneUrl || "https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode";

  // Show static fallback if reduce motion is enabled or no scene URL
  if (reduceMotion || !sceneUrl) {
    return (
      <div className={cn("w-full h-full relative", className)}>
        {fallbackImage ? (
          <img
            src={fallbackImage}
            alt="3D scene preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-background-dark via-surface-dark to-background-dark-end flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-8xl text-primary/20">
                view_in_ar
              </span>
              <p className="text-text-muted text-sm mt-4">
                3D scene disabled (reduce motion enabled)
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full", className)}>
      <Suspense fallback={<SplineFallback />}>
        <Spline scene={defaultSceneUrl} />
      </Suspense>
    </div>
  );
}

export { SplineScene };
