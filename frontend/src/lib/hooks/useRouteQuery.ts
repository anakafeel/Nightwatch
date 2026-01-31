"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoute } from "../api";
import type { RouteRequest, RouteResult } from "../routes";

/**
 * Query key for route data
 */
export const ROUTE_QUERY_KEY = ["route"] as const;

/**
 * Hook for fetching route recommendations
 * Uses mutation since route is fetched on demand (button click)
 */
export function useRouteQuery() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (request: RouteRequest) => fetchRoute(request),
    onSuccess: (data) => {
      // Store in cache for access by other pages (like insights)
      queryClient.setQueryData(ROUTE_QUERY_KEY, data);
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
