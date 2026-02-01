"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import {
  GlobalLoaderOverlay,
  RouteChangeLoader,
  NavigationInterceptor,
} from "@/components/ui";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* Route change detection - requires Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <RouteChangeLoader />
        <NavigationInterceptor />
      </Suspense>

      {/* Global loading overlay */}
      <GlobalLoaderOverlay />

      {children}
    </QueryClientProvider>
  );
}
