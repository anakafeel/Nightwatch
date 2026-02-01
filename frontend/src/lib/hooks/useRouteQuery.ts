"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoute } from "../api";
import { useLoadingStore } from "../stores/loading";
import type { RouteRequest, RouteResult } from "../routes";

const ROUTE_SOURCE = "route-api";

/**
 * Query key for route data
 */
export const ROUTE_QUERY_KEY = ["route"] as const;

/**
 * Hook for fetching route recommendations
 * Uses mutation since route is fetched on demand (button click)
 * Integrates with global loading overlay
 */
export function useRouteQuery() {
  const queryClient = useQueryClient();
  const { start, stop } = useLoadingStore();

  const mutation = useMutation({
    mutationFn: (request: RouteRequest) => fetchRoute(request),
    onMutate: () => {
      // Show loading overlay when route request starts
      start(ROUTE_SOURCE);
    },
    onSuccess: (data) => {
      // Store in cache for access by other pages (like insights)
      queryClient.setQueryData(ROUTE_QUERY_KEY, data);
    },
    onSettled: () => {
      // Hide loading overlay on success or error
      stop(ROUTE_SOURCE);
    },
  });

  return {
    fetchRoute: mutation.mutate,
    fetchRouteAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook to get cached route data (used by insights page)
 */
export function useCachedRoute(): RouteResult | undefined {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<RouteResult>(ROUTE_QUERY_KEY);
}
