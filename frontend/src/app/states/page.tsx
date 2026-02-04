"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Skeleton, SkeletonInput, Toast } from "@/components/ui";
import { BrandLogo } from "@/components/layout/BrandLogo";

export default function StatesPage() {
  const [showToasts, setShowToasts] = useState(true);

  return (
    <div className="bg-[#070A12] text-white font-display overflow-x-hidden">
      {/* Page Header */}
      <div className="px-6 py-6 bg-background-dark border-b border-border-dark">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">UI States & Feedback</h1>
            <p className="text-text-muted text-sm mt-1">
              Showcase of loading, error, and feedback states
            </p>
          </div>
          <Link href="/app">
            <Button variant="secondary">Back to App</Button>
          </Link>
        </div>
      </div>

      {/* VARIANT 1: LOADING STATE */}
      <div className="flex flex-col w-full h-screen max-h-[900px] border-b border-gray-800 mb-10">
        <div className="px-6 py-4 bg-[#070A12] text-gray-500 text-sm font-bold uppercase tracking-wider">
          Variant 1: Loading (Skeleton + AI Animation)
        </div>

        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-border-dark bg-background-dark px-10 py-3">
          <BrandLogo variant="lockup" size={24} href="/" />
          <div className="flex flex-1 justify-end gap-8">
            <Skeleton variant="circular" width={40} height={40} />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Skeleton */}
          <div className="w-96 bg-background-dark flex flex-col p-6 border-r border-border-dark gap-6 z-10">
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-col gap-4">
              <SkeletonInput />
              <SkeletonInput />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-lg" />
                  <Skeleton className="h-4" style={{ width: `${120 - i * 20}px` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Map Area Loading */}
          <div className="flex-1 bg-map-pattern relative flex items-center justify-center">
            <div className="flex flex-col items-center justify-center p-8 bg-background-dark/90 backdrop-blur-sm rounded-2xl border border-border-dark shadow-2xl">
              <div className="relative w-64 h-32 flex items-center justify-center mb-6">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100">
                  <path
                    d="M10,50 C50,10 90,90 130,50 S190,10 190,50"
                    fill="none"
                    stroke="#1E2942"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    className="path-line opacity-50"
                    d="M10,50 C50,10 90,90 130,50 S190,10 190,50"
                    fill="none"
                    stroke="#7C5CFF"
                    strokeWidth="2"
                  />
                  <circle className="pulse-point" fill="#7C5CFF" r="6">
                    <animateMotion
                      dur="2.5s"
                      path="M10,50 C50,10 90,90 130,50 S190,10 190,50"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
              <h3 className="text-white text-lg font-medium mb-2">
                Calculating optimal safety path...
              </h3>
              <p className="text-text-muted text-sm">
                Analyzing street lighting and crowd density
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VARIANT 2: ERROR STATE */}
      <div className="flex flex-col w-full h-screen max-h-[900px] border-b border-gray-800 mb-10">
        <div className="px-6 py-4 bg-[#070A12] text-gray-500 text-sm font-bold uppercase tracking-wider">
          Variant 2: No Route Found (Error)
        </div>

        <header className="flex items-center justify-between whitespace-nowrap border-b border-border-dark bg-background-dark px-10 py-3">
          <BrandLogo variant="lockup" size={24} href={undefined} />
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-96 bg-background-dark flex flex-col p-6 border-r border-border-dark gap-6 z-10">
            <h1 className="text-white text-base font-medium">Plan Your Route</h1>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-text-muted text-xs font-medium uppercase tracking-wide pb-2">
                  Origin
                </p>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-text-muted">
                    my_location
                  </span>
                  <input
                    className="w-full rounded-lg text-white border border-border-dark bg-surface-dark h-12 pl-12 pr-4 text-sm"
                    defaultValue="Central Station"
                  />
                </div>
              </div>
              <div>
                <p className="text-text-muted text-xs font-medium uppercase tracking-wide pb-2">
                  Destination
                </p>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-text-muted">
                    location_on
                  </span>
                  <input
                    className="w-full rounded-lg text-white border border-border-dark bg-surface-dark h-12 pl-12 pr-4 text-sm"
                    defaultValue="Shadow District, Sector 4"
                  />
                </div>
              </div>
            </div>
            <hr className="border-border-dark" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-300">Max Detour</span>
                <span className="text-sm font-bold text-primary">5 min</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-300">Min Lighting Score</span>
                <span className="text-sm font-bold text-primary">8/10</span>
              </div>
            </div>
            <Button variant="ghost" className="mt-auto bg-border-dark text-text-muted">
              Reset Parameters
            </Button>
          </div>

          {/* Error Card */}
          <div className="flex-1 relative bg-map-pattern">
            <div className="absolute inset-0 bg-background-dark/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-surface-dark border border-border-dark rounded-xl shadow-2xl p-6 flex flex-col items-center text-center gap-4">
              <div className="size-14 rounded-full bg-rose-500/10 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-rose-400 text-3xl">
                  wrong_location
                </span>
              </div>
              <h3 className="text-white text-xl font-bold">
                No safe route found in this radius
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                We couldn&apos;t identify a path that meets your safety threshold of{" "}
                <strong>Lighting Score &gt; 8</strong> within the 5 minute detour limit.
              </p>
              <div className="flex flex-col w-full gap-3 mt-4">
                <Button
                  className="w-full"
                  leftIcon={
                    <span className="material-symbols-outlined text-lg">timeline</span>
                  }
                >
                  Increase Max Detour
                </Button>
                <Button variant="secondary" className="w-full">
                  Check Destination
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VARIANT 3: LOW COVERAGE STATE */}
      <div className="flex flex-col w-full h-screen max-h-[900px] border-b border-gray-800 mb-10">
        <div className="px-6 py-4 bg-[#070A12] text-gray-500 text-sm font-bold uppercase tracking-wider">
          Variant 3: Low Coverage (Warning)
        </div>

        <header className="flex items-center justify-between whitespace-nowrap border-b border-border-dark bg-background-dark px-10 py-3">
          <BrandLogo variant="lockup" size={24} href={undefined} />
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-96 bg-background-dark flex flex-col p-6 border-r border-border-dark gap-6 z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">verified</span>
              <h1 className="text-white text-base font-medium">Route Confirmed</h1>
            </div>

            {/* Route Steps */}
            <div className="flex flex-col relative pl-4 border-l border-border-dark gap-8 py-2">
              <div className="flex flex-col gap-1 relative">
                <div className="absolute -left-[21px] top-1 size-3 rounded-full bg-primary ring-4 ring-background-dark" />
                <p className="text-white text-sm font-bold">Start: Central Station</p>
                <p className="text-text-muted text-xs">18:45 PM</p>
              </div>
              <div className="flex flex-col gap-1 relative">
                <div className="absolute -left-[21px] top-1 size-3 rounded-full bg-yellow-500 ring-4 ring-background-dark" />
                <p className="text-white text-sm font-bold">Via North Park</p>
                <div className="flex items-center gap-1 text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded w-fit">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  <span>Limited Data</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 relative">
                <div className="absolute -left-[21px] top-1 size-3 rounded-full border-2 border-text-muted bg-background-dark ring-4 ring-background-dark" />
                <p className="text-white text-sm font-bold">End: 42 Wallaby Way</p>
                <p className="text-text-muted text-xs">19:12 PM</p>
              </div>
            </div>

            <div className="mt-auto bg-surface-dark p-4 rounded-lg flex gap-3 items-start border border-border-dark">
              <span className="material-symbols-outlined text-primary shrink-0">
                safety_check
              </span>
              <div>
                <p className="text-sm text-white font-medium">Safety Score: 78%</p>
                <p className="text-xs text-text-muted mt-1">
                  Route optimized for visibility, but includes low coverage zones.
                </p>
              </div>
            </div>
            <Button className="w-full">Start Navigation</Button>
          </div>

          {/* Map with Warning Banner */}
          <div className="flex-1 relative bg-map-pattern">
            <div className="absolute inset-0 bg-background-dark/20" />

            {/* Low Coverage Banner */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-auto min-w-[380px] max-w-[90%] z-20">
              {showToasts && (
                <Toast
                  type="warning"
                  title="Data coverage low for this area"
                  message="Lighting information may be outdated. Exercise caution."
                  onClose={() => setShowToasts(false)}
                />
              )}
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="size-10 bg-surface-dark hover:bg-border-dark text-white rounded-lg shadow-lg flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">my_location</span>
              </button>
              <button className="size-10 bg-surface-dark hover:bg-border-dark text-white rounded-lg shadow-lg flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">add</span>
              </button>
              <button className="size-10 bg-surface-dark hover:bg-border-dark text-white rounded-lg shadow-lg flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Examples Section */}
      <div className="px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Toast Examples</h2>
        <div className="flex flex-col gap-4">
          <Toast type="info" title="Route Updated" message="New data available for your area" />
          <Toast type="success" title="Route Saved" message="Added to your saved routes" />
          <Toast
            type="warning"
            title="Low Coverage"
            message="Some areas have limited lighting data"
          />
          <Toast type="error" title="Connection Lost" message="Check your internet connection" />
        </div>
      </div>
    </div>
  );
}
