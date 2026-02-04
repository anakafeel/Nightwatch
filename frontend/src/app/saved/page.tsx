/**
 * Saved Routes Page - View and manage saved routes and history
 *
 * Exports: default SavedRoutesPage component
 * Data flow: Reads from savedRoutesStore -> Displays routes/history -> rerun navigates to /app
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppNav } from "@/components/layout/AppNav";
import { Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { useSavedRoutesStore, type HistoryEntry } from "@/lib/stores/savedRoutes";
import type { SavedRoute } from "@/lib/routes";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { staggerContainer, routeCardVariants, getMotionProps } from "@/lib/motion";

export default function SavedRoutesPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const motionProps = getMotionProps(reducedMotion);

  // Hydration state - prevents SSR mismatch
  const [hydrated, setHydrated] = useState(false);

  // Store state
  const savedRoutes = useSavedRoutesStore((s) => s.savedRoutes);
  const history = useSavedRoutesStore((s) => s.history);
  const toggleFavorite = useSavedRoutesStore((s) => s.toggleFavorite);
  const removeRoute = useSavedRoutesStore((s) => s.removeRoute);
  const setRerunData = useSavedRoutesStore((s) => s.setRerunData);

  // Hydrate on client
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Derived data
  const favoriteRoutes = savedRoutes.filter((r) => r.isFavorite);

  const getSafetyColor = (score: number) => {
    if (score >= 90) return "text-emerald-500 border-emerald-500/20";
    if (score >= 80) return "text-yellow-500 border-yellow-500/20";
    return "text-rose-500 border-rose-500/20";
  };

  const formatDistance = (meters: number): string => {
    const km = meters / 1000;
    return km >= 10 ? `${km.toFixed(0)} km` : `${km.toFixed(1)} km`;
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const handleRerun = (route: SavedRoute | HistoryEntry) => {
    setRerunData({
      start: route.start,
      end: route.end,
      startAddress: "startAddress" in route ? route.startAddress : "Start",
      endAddress: "endAddress" in route ? route.endAddress : "End",
    });
    router.push("/app");
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeRoute(id);
  };

  // Route card component for saved routes
  const RouteCard = ({
    route,
    showRemove = false,
    showFavoriteToggle = true,
  }: {
    route: SavedRoute;
    showRemove?: boolean;
    showFavoriteToggle?: boolean;
  }) => (
    <motion.article
      key={route.id}
      variants={routeCardVariants}
      whileHover={reducedMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col overflow-hidden rounded-xl
                bg-gradient-to-br from-[#14213A]/80 to-[#0B1220]/60
                border border-[#7C5CFF]/40 shadow-lg shadow-[#7C5CFF]/5
                transition-colors duration-300
                hover:border-[#7C5CFF]/70 hover:shadow-xl hover:shadow-[#7C5CFF]/10"
    >
      {/* Map Preview */}
      <div className="relative h-40 w-full overflow-hidden bg-surface-darker">
        <div className="absolute inset-0 bg-map-pattern opacity-80 transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent" />
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background-dark/80 px-2 py-1 text-xs font-bold backdrop-blur-sm border ${getSafetyColor(route.safety_score)}`}
        >
          <span className="material-symbols-outlined text-[14px]">shield</span>
          {Math.round(Math.min(100, Math.max(0, route.safety_score)))}/100
        </div>
        {route.tags && route.tags.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="warning" className="text-xs">
              {route.tags[0]}
            </Badge>
          </div>
        )}
        {showRemove && (
          <button
            onClick={(e) => handleRemove(route.id, e)}
            className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded-full bg-background-dark/80 text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors backdrop-blur-sm border border-border-dark"
            aria-label="Remove route"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-white">
            {route.name || "Untitled Route"}
          </h3>
          {showFavoriteToggle && (
            <button
              onClick={(e) => handleToggleFavorite(route.id, e)}
              className={`transition-colors ${
                route.isFavorite
                  ? "text-secondary hover:text-white"
                  : "text-text-muted hover:text-secondary"
              }`}
              aria-label={route.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {route.isFavorite ? "star" : "star_outline"}
              </span>
            </button>
          )}
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
                {route.startAddress || "—"}
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
                {route.endAddress || "—"}
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
              {route.distance_m ? formatDistance(route.distance_m) : "—"}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="bg-[#7C5CFF]/20 text-[#8B74FF] border border-[#7C5CFF]/40
                      hover:bg-gradient-to-r hover:from-[#7C5CFF] hover:to-[#8B74FF]
                      hover:text-white hover:border-transparent rounded-lg
                      transition-all duration-200"
            leftIcon={
              <span className="material-symbols-outlined text-[16px]">
                play_arrow
              </span>
            }
            onClick={() => handleRerun(route)}
          >
            Re-run
          </Button>
        </div>
      </div>
    </motion.article>
  );

  // History card component (simpler than saved route card)
  const HistoryCard = ({ entry }: { entry: HistoryEntry }) => (
    <motion.article
      key={entry.id}
      variants={routeCardVariants}
      whileHover={reducedMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col overflow-hidden rounded-xl
                bg-gradient-to-br from-[#14213A]/80 to-[#0B1220]/60
                border border-[#7C5CFF]/40 shadow-lg shadow-[#7C5CFF]/5
                transition-colors duration-300
                hover:border-[#7C5CFF]/70 hover:shadow-xl hover:shadow-[#7C5CFF]/10"
    >
      {/* Map Preview */}
      <div className="relative h-32 w-full overflow-hidden bg-surface-darker">
        <div className="absolute inset-0 bg-map-pattern opacity-60 transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent" />
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background-dark/80 px-2 py-1 text-xs font-bold backdrop-blur-sm border ${getSafetyColor(entry.safety_score)}`}
        >
          <span className="material-symbols-outlined text-[14px]">shield</span>
          {Math.round(Math.min(100, Math.max(0, entry.safety_score)))}/100
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-xs text-text-muted bg-background-dark/80 px-2 py-1 rounded backdrop-blur-sm">
            {formatDate(entry.createdAt)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Route Points - compact */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-emerald-500 material-symbols-outlined text-[16px]">
            trip_origin
          </span>
          <span className="text-white truncate flex-1">
            {entry.startAddress || "Start"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-2">
          <span className="text-primary material-symbols-outlined text-[16px]">
            location_on
          </span>
          <span className="text-white truncate flex-1">
            {entry.endAddress || "End"}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border-dark pt-3">
          <div className="flex items-center gap-1.5 text-text-muted">
            <span className="material-symbols-outlined text-[16px]">
              straighten
            </span>
            <span className="text-xs">
              {entry.distance_m ? formatDistance(entry.distance_m) : "—"}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="bg-[#7C5CFF]/20 text-[#8B74FF] border border-[#7C5CFF]/40
                      hover:bg-gradient-to-r hover:from-[#7C5CFF] hover:to-[#8B74FF]
                      hover:text-white hover:border-transparent rounded-lg
                      transition-all duration-200 text-xs"
            leftIcon={
              <span className="material-symbols-outlined text-[14px]">
                play_arrow
              </span>
            }
            onClick={() => handleRerun(entry)}
          >
            Re-run
          </Button>
        </div>
      </div>
    </motion.article>
  );

  // Empty state component
  const EmptyState = ({
    icon,
    title,
    description,
  }: {
    icon: string;
    title: string;
    description: string;
  }) => (
    <div className="text-center py-12 text-text-muted">
      <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">
        {icon}
      </span>
      <p className="font-medium text-white mb-1">{title}</p>
      <p className="text-sm">{description}</p>
      <Link href="/app" className="mt-4 inline-block">
        <Button variant="ghost" className="text-primary hover:text-white text-sm">
          Create a Route
        </Button>
      </Link>
    </div>
  );

  // Loading/hydration state
  if (!hydrated) {
    return (
      <div className="bg-background-dark min-h-screen flex flex-col">
        <AppNav />
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 lg:px-40">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white md:text-4xl tracking-tight">
                Your Journeys
              </h1>
              <p className="mt-2 text-text-muted">
                Manage your saved routes and view recent history.
              </p>
            </div>
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                  progress_activity
                </span>
                <p className="mt-4 text-text-muted">Loading your journeys...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background-dark min-h-screen flex flex-col">
      <AppNav />

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 lg:px-40">
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
                className="mt-4 md:mt-0 bg-gradient-to-r from-[#7C5CFF] via-[#8B74FF] to-[#4C7DFF]
                          text-white font-bold rounded-xl shadow-lg hover:shadow-xl
                          hover:shadow-[#7C5CFF]/30 transition-all duration-300"
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
              <TabsTrigger value="saved">
                Saved Routes
                {savedRoutes.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                    {savedRoutes.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="history">
                Recent History
                {history.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                    {history.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="favorites">
                Favorites
                {favoriteRoutes.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-secondary/20 text-secondary rounded">
                    {favoriteRoutes.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Saved Routes Tab */}
            <TabsContent value="saved" className="mt-8">
              {savedRoutes.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  {...motionProps}
                >
                  {savedRoutes.map((route) => (
                    <RouteCard key={route.id} route={route} showRemove />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon="bookmark_border"
                  title="No saved routes yet"
                  description="Run a route and save it to see it here."
                />
              )}
            </TabsContent>

            {/* Recent History Tab */}
            <TabsContent value="history" className="mt-8">
              {history.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  {...motionProps}
                >
                  {history.map((entry) => (
                    <HistoryCard key={entry.id} entry={entry} />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon="history"
                  title="No recent history"
                  description="Your recent routes will appear here."
                />
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-8">
              {favoriteRoutes.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  {...motionProps}
                >
                  {favoriteRoutes.map((route) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      showFavoriteToggle
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon="star_border"
                  title="No favorites yet"
                  description="Star a saved route to add it to your favorites."
                />
              )}
            </TabsContent>
          </Tabs>

          {/* Discovery Section - only show when all tabs are empty */}
          {savedRoutes.length === 0 && history.length === 0 && (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl
                           border border-dashed border-[#7C5CFF]/40
                           bg-gradient-to-br from-[#14213A]/30 to-[#0B1220]/30 p-12 text-center">
              <div className="relative mb-6 h-48 w-48">
                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2
                               rounded-full bg-[#7C5CFF]/20 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2
                               items-center justify-center rounded-full
                               bg-gradient-to-br from-[#14213A] to-[#0B1220]
                               shadow-2xl border border-[#7C5CFF]/40">
                  <span className="material-symbols-outlined text-[48px] text-[#8B74FF] animate-pulse">
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
                <Button variant="ghost" className="text-[#8B74FF] hover:text-white
                               border border-[#7C5CFF]/40 hover:bg-[#14213A]/50
                               rounded-xl transition-all duration-200">
                  Browse Popular Routes
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
