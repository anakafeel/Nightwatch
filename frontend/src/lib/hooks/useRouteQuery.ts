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

  const mutation = useMutation<RouteResult, Error, RouteRequest>({
    mutationFn: async (request: RouteRequest) => {
      // Central place to hit backend (implementation lives in ../api fetchRoute)
      return await fetchRoute(request);
    },
    onMutate: () => {
      start(ROUTE_SOURCE);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(ROUTE_QUERY_KEY, data);

      // Helpful for debugging
      // eslint-disable-next-line no-console
      console.log("[useRouteQuery] routeData received:", data);
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("[useRouteQuery] fetchRoute error:", err);
    },
    onSettled: () => {
      stop(ROUTE_SOURCE);
    },
  });

  return {
    // Prefer async version so callers can await it
    fetchRouteAsync: mutation.mutateAsync,

    // Keep sync mutate for convenience if you still want it
    fetchRoute: mutation.mutate,

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
