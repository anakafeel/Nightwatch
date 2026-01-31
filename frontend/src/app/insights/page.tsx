"use client";

import Link from "next/link";
import { AppNav } from "@/components/layout/AppNav";
import { Button, Badge } from "@/components/ui";
import { useCachedRoute } from "@/lib/hooks/useRouteQuery";
import { mockRouteInsights } from "@/lib/mockRoute";

export default function InsightsPage() {
  const routeData = useCachedRoute();
  const insights = mockRouteInsights;

  return (
    <div className="bg-background-dark min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-md">
        <div className="px-6 md:px-10 py-4 flex items-center justify-between max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white">
                Route Safety Insights
              </h1>
              <p className="text-xs text-text-muted font-medium">
                Route ID: {insights.routeId}
              </p>
            </div>
          </div>
          <Link href="/app">
            <Button
              leftIcon={
                <span className="material-symbols-outlined text-[20px]">map</span>
              }
            >
              Back to Map
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-10 space-y-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Safety Score Card */}
          <div className="lg:col-span-4 flex flex-col rounded-xl border border-border-dark bg-surface-dark/50 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider">
                  Safety Score
                </h3>
                <p className="text-3xl font-bold mt-1">
                  {insights.safetyScore}
                  <span className="text-lg text-text-muted font-medium">/100</span>
                </p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <span className="material-symbols-outlined text-emerald-500">
                  trending_up
                </span>
              </div>
            </div>

            {/* Radial Chart */}
            <div className="relative flex items-center justify-center py-4 flex-1">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  className="text-slate-700/50"
                  cx="96"
                  cy="96"
                  r="80"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                />
                <circle
                  className="text-secondary"
                  cx="96"
                  cy="96"
                  r="80"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="502"
                  strokeDashoffset="351"
                />
                <circle
                  className="text-primary"
                  cx="96"
                  cy="96"
                  r="80"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="502"
                  strokeDashoffset="150"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-medium text-text-muted">Composite</span>
                <span className="text-2xl font-bold">Good</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-background-dark/50 border border-border-dark">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-text-muted">Lighting</span>
                </div>
                <span className="text-lg font-bold pl-4">{insights.lightingPercentage}%</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-background-dark/50 border border-border-dark">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-xs font-medium text-text-muted">Infrastructure</span>
                </div>
                <span className="text-lg font-bold pl-4">{insights.infrastructurePercentage}%</span>
              </div>
            </div>
          </div>

          {/* Dark Stretch Analysis */}
          <div className="lg:col-span-5 flex flex-col rounded-xl border border-border-dark bg-surface-dark/50 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider">
                  Dark Stretch Analysis
                </h3>
                <p className="text-lg font-bold mt-1">Longest Unlit Segments</p>
              </div>
              <button className="text-primary hover:text-primary/80 transition-colors">
                <span className="material-symbols-outlined">info</span>
              </button>
            </div>
            <p className="text-sm text-text-muted mb-8">
              Distance in meters without active street lighting.
            </p>

            <div className="flex flex-col gap-6 flex-1 justify-center">
              {insights.darkStretchSegments.map((segment, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium text-gray-300">{segment.name}</span>
                    <span
                      className={`font-bold ${
                        segment.severity === "warning"
                          ? "text-secondary"
                          : "text-primary"
                      }`}
                    >
                      {segment.distance_m}m
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        segment.severity === "warning"
                          ? "bg-gradient-to-r from-secondary/80 to-secondary"
                          : "bg-gradient-to-r from-primary/80 to-primary"
                      }`}
                      style={{ width: `${Math.min((segment.distance_m / 500) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Lighting Quality */}
            <div className="flex-1 rounded-xl border border-border-dark bg-surface-dark/50 backdrop-blur-sm p-5 shadow-sm flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-md bg-blue-500/10 text-blue-400 mb-2 w-fit">
                  <span className="material-symbols-outlined text-[20px]">light_mode</span>
                </div>
                <Badge
                  variant={insights.metrics.lightingDelta > 0 ? "success" : "danger"}
                  className="text-xs"
                >
                  {insights.metrics.lightingDelta > 0 ? "+" : ""}
                  {insights.metrics.lightingDelta}%
                </Badge>
              </div>
              <p className="text-text-muted text-xs font-medium uppercase tracking-wide">
                Lighting Quality
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {insights.metrics.lightingQuality === "above" ? "Above" : "Below"} Avg
              </p>
              <p className="text-xs text-text-muted mt-1">vs. City Average</p>
            </div>

            {/* Crowd Density */}
            <div className="flex-1 rounded-xl border border-border-dark bg-surface-dark/50 backdrop-blur-sm p-5 shadow-sm flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-md bg-purple-500/10 text-purple-400 mb-2 w-fit">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                </div>
                <Badge
                  variant={insights.metrics.crowdDelta < 0 ? "danger" : "success"}
                  className="text-xs"
                >
                  {insights.metrics.crowdDelta}%
                </Badge>
              </div>
              <p className="text-text-muted text-xs font-medium uppercase tracking-wide">
                Crowd Density
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {insights.metrics.crowdDensity === "below" ? "Below" : "Above"} Avg
              </p>
              <p className="text-xs text-text-muted mt-1">vs. Peak Hours</p>
            </div>

            {/* Patrol Proximity */}
            <div className="flex-1 rounded-xl border border-border-dark bg-surface-dark/50 backdrop-blur-sm p-5 shadow-sm flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-md bg-orange-500/10 text-orange-400 mb-2 w-fit">
                  <span className="material-symbols-outlined text-[20px]">local_police</span>
                </div>
                <Badge variant="info" className="text-xs">
                  {insights.metrics.patrolProximity === "high" ? "High" : "Low"}
                </Badge>
              </div>
              <p className="text-text-muted text-xs font-medium uppercase tracking-wide">
                Proximity
              </p>
              <p className="text-xl font-bold text-white mt-1">Patrolled Zone</p>
              <p className="text-xs text-text-muted mt-1">
                Station within {insights.metrics.patrolDistance}
              </p>
            </div>
          </div>

          {/* Route Visualization Map */}
          <div className="lg:col-span-12 rounded-xl border border-border-dark bg-surface-dark/50 backdrop-blur-sm p-1 shadow-sm overflow-hidden flex flex-col relative h-[400px]">
            {/* Map Header */}
            <div className="absolute top-4 left-4 z-10 bg-background-dark/90 backdrop-blur p-4 rounded-lg border border-border-dark shadow-lg max-w-sm">
              <h3 className="text-sm font-bold text-white mb-2">Route Visualization</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(19,200,236,0.6)]" />
                  <span className="text-xs text-gray-300">High-Visibility Hubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-secondary rounded-full" />
                  <span className="text-xs text-gray-300">Coverage Gaps (Warning)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-slate-400 rounded-full border border-dashed border-slate-600" />
                  <span className="text-xs text-gray-300">Standard Coverage</span>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button className="w-10 h-10 bg-surface-dark border border-border-dark rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors shadow-lg">
                <span className="material-symbols-outlined">layers</span>
              </button>
              <button className="w-10 h-10 bg-surface-dark border border-border-dark rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors shadow-lg">
                <span className="material-symbols-outlined">my_location</span>
              </button>
            </div>

            {/* Map Background */}
            <div className="w-full h-full relative bg-background-dark rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-map-pattern opacity-60" />
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#13c8ec", stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: "#13c8ec", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#fbbf24", stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="glowInsights">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M 100 350 Q 250 300 400 320 T 700 200 T 1000 250 T 1300 150"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#glowInsights)"
                />
                <circle cx="100" cy="350" r="6" fill="#13c8ec" filter="url(#glowInsights)" />
                <circle cx="400" cy="320" r="6" fill="#13c8ec" filter="url(#glowInsights)" />
                <circle cx="700" cy="200" r="6" fill="#13c8ec" filter="url(#glowInsights)" />
                <rect
                  x="950"
                  y="230"
                  width="100"
                  height="40"
                  rx="20"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                <circle cx="1000" cy="250" r="4" fill="#fbbf24" />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
