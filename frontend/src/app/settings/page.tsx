"use client";

import Link from "next/link";
import { Toggle, Slider, Tooltip } from "@/components/ui";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { usePreferencesStore } from "@/lib/stores/preferences";

export default function SettingsPage() {
  const {
    reduceMotion,
    largeText,
    showCctvIndicators,
    defaultMaxDetour,
    defaultWeights,
    setReduceMotion,
    setLargeText,
    setShowCctvIndicators,
    setDefaultMaxDetour,
    setDefaultWeights,
  } = usePreferencesStore();

  return (
    <div className="bg-background-dark min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <BrandLogo variant="lockup" size={32} href="/" />
            <Link
              href="/settings"
              className="flex items-center justify-center p-2 rounded-full text-text-muted hover:text-white transition-colors hover:bg-white/5"
            >
              <span className="material-symbols-outlined">settings</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[960px] mx-auto px-4 sm:px-6 py-10 lg:py-12 flex flex-col gap-10">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Settings &amp; Privacy
          </h1>
          <p className="text-text-muted text-lg">
            Manage your routing preferences, privacy controls, and accessibility
            options.
          </p>
        </div>

        {/* Privacy Section */}
        <section className="flex flex-col gap-6 p-6 md:p-8 rounded-xl border border-border-dark bg-surface-dark/50 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">shield_lock</span>
              Data &amp; Privacy
            </h2>

            {/* Privacy Badge */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-5 rounded-lg bg-primary/10 border border-primary/20 mt-2">
              <div className="flex-shrink-0 bg-primary/20 p-3 rounded-full text-primary">
                <span className="material-symbols-outlined text-3xl">visibility_off</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  No Personal Data Collected
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Nightwing operates entirely on client-side processing. We utilize
                  OpenStreetMap for routing data and do not store, track, or share your
                  location history on any server.
                </p>
              </div>
            </div>
          </div>

          {/* CCTV Toggle */}
          <div className="border-t border-border-dark pt-6 mt-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-base font-medium text-white">
                    Show Observability Indicators (CCTV)
                  </p>
                  <Tooltip
                    content="Enabling this highlights areas with surveillance cameras. This data is crowd-sourced from OSM and used for safety awareness."
                    position="top"
                  >
                    <span className="material-symbols-outlined text-text-muted text-[18px] cursor-help">
                      info
                    </span>
                  </Tooltip>
                </div>
                <p className="text-sm text-text-muted">
                  Enables tags for cameras on the map.
                </p>
              </div>
              <Toggle
                checked={showCctvIndicators}
                onChange={(e) => setShowCctvIndicators(e.target.checked)}
              />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="flex flex-col gap-6 p-6 md:p-8 rounded-xl border border-border-dark bg-surface-dark/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            Routing Preferences
          </h2>

          <div className="grid gap-8 mt-2">
            {/* Lighting Preference */}
            <Slider
              label="Prefer well-lit routes"
              valueLabel={defaultWeights.lights >= 70 ? "High Priority" : "Balanced"}
              min={0}
              max={100}
              value={defaultWeights.lights}
              onChange={(e) =>
                setDefaultWeights({
                  ...defaultWeights,
                  lights: Number(e.target.value),
                })
              }
              showLabels
              minLabel="Ignore Lighting"
              maxLabel="Prioritize Light"
            />

            {/* Detour Preference */}
            <Slider
              label="Reduce detours"
              valueLabel={defaultMaxDetour <= 10 ? "Direct" : "Balanced"}
              min={0}
              max={30}
              value={defaultMaxDetour}
              onChange={(e) => setDefaultMaxDetour(Number(e.target.value))}
              showLabels
              minLabel="Direct Route"
              maxLabel="Safer / Scenic"
            />
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="flex flex-col gap-6 p-6 md:p-8 rounded-xl border border-border-dark bg-surface-dark/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">accessibility_new</span>
            Accessibility &amp; Performance
          </h2>

          <div className="flex flex-col gap-6 mt-2">
            {/* Large Text */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium text-white">Large Text Mode</p>
                <p className="text-sm text-text-muted">
                  Increases font size for better readability across the interface.
                </p>
              </div>
              <Toggle
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
              />
            </div>

            {/* Reduce Motion */}
            <div className="border-t border-border-dark pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-white">Reduce Motion</p>
                  <p className="text-sm text-text-muted max-w-[500px]">
                    Disables GSAP animations and Spline 3D elements to improve
                    performance and comfort for motion sensitivity.
                  </p>
                </div>
                <Toggle
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-4 pb-8 border-t border-border-dark pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
            <p>&copy; 2024 Nightwing. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact Support
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
