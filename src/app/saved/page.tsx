"use client";

import { useState } from "react";
import Link from "next/link";
import { AppNav } from "@/components/layout/AppNav";
import { Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { mockSavedRoutes } from "@/lib/mockRoute";

export default function SavedRoutesPage() {
  const [routes] = useState(mockSavedRoutes);

  const getSafetyColor = (score: number) => {
    if (score >= 90) return "text-emerald-500 border-emerald-500/20";
    if (score >= 80) return "text-yellow-500 border-yellow-500/20";
    return "text-rose-500 border-rose-500/20";
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col">
      <AppNav />

      <main className="flex-1 px-6 py-8 lg:px-40">
        <div className="mx-auto max-w-6xl">
          {/* Page Heading */}
          <div className="mb-8 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-white md:text-4xl tracking-tight">
                Your Journeys
              </h1>
              <p className="mt-2 text-text-muted">
                Manage your saved routes and view recent history.
              </p>
            </div>
            <Link href="/app">
              <Button
                className="mt-4 md:mt-0"
                leftIcon={
                  <span className="material-symbols-outlined text-[20px]">add</span>
                }
              >
                Create New Route
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="saved" className="mb-8">
            <TabsList>
              <TabsTrigger value="saved">Saved Routes</TabsTrigger>
              <TabsTrigger value="history">Recent History</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="mt-8">
              {/* Routes Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {routes.map((route) => (
                  <article
                    key={route.id}
                    className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-dark border border-border-dark shadow-lg transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10"
                  >
                    {/* Map Preview */}
                    <div className="relative h-40 w-full overflow-hidden bg-surface-darker">
                      <div className="absolute inset-0 bg-map-pattern opacity-80 transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent" />
                      <div
                        className={`absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background-dark/80 px-2 py-1 text-xs font-bold backdrop-blur-sm border ${getSafetyColor(route.safety_score)}`}
                      >
                        <span className="material-symbols-outlined text-[14px]">shield</span>
                        {route.safety_score}/100
                      </div>
                      {route.tags && route.tags.length > 0 && (
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="warning" className="text-xs">
                            {route.tags[0]}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-white">{route.name}</h3>
                        <button
                          className={`transition-colors ${
                            route.isFavorite
                              ? "text-secondary hover:text-white"
                              : "text-text-muted hover:text-secondary"
                          }`}
                          aria-label={route.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {route.isFavorite ? "star" : "star"}
                          </span>
                        </button>
                      </div>

                      {/* Route Points */}
                      <div className="mt-4 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                            <span className="material-symbols-outlined text-[14px]">
                              trip_origin
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                              Start
                            </p>
                            <p className="text-sm font-medium text-white">
                              {route.startAddress}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-[14px]">
                              location_on
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                              End
                            </p>
                            <p className="text-sm font-medium text-white">
                              {route.endAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 flex items-center justify-between border-t border-border-dark pt-4">
                        <div className="flex items-center gap-1.5 text-text-muted">
                          <span className="material-symbols-outlined text-[18px]">
                            straighten
                          </span>
                          <span className="text-sm">
                            {(route.distance_m / 1000).toFixed(1)} km
                          </span>
                        </div>
                        <Link href="/app">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-primary/10 text-primary hover:bg-primary hover:text-background-dark"
                            leftIcon={
                              <span className="material-symbols-outlined text-[16px]">
                                play_arrow
                              </span>
                            }
                          >
                            Re-run
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-8">
              <div className="text-center py-12 text-text-muted">
                <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">
                  history
                </span>
                <p>Your recent routes will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {routes
                  .filter((r) => r.isFavorite)
                  .map((route) => (
                    <article
                      key={route.id}
                      className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-dark border border-border-dark shadow-lg"
                    >
                      <div className="relative h-40 w-full overflow-hidden bg-surface-darker">
                        <div className="absolute inset-0 bg-map-pattern opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-white">{route.name}</h3>
                        <p className="text-sm text-text-muted mt-1">
                          {route.startAddress} → {route.endAddress}
                        </p>
                      </div>
                    </article>
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Empty State */}
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-dark bg-surface-dark/30 p-12 text-center">
            <div className="relative mb-6 h-48 w-48">
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-surface-dark to-background-dark shadow-2xl border border-border-dark">
                <span className="material-symbols-outlined text-[48px] text-primary animate-pulse">
                  location_searching
                </span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">Discover New Paths</h3>
            <p className="mt-2 max-w-sm text-text-muted">
              Your safe paths will appear here. Start a journey or search for a
              destination to build your history.
            </p>
            <Link href="/app" className="mt-6">
              <Button variant="ghost" className="text-primary hover:text-white">
                Browse Popular Routes →
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
