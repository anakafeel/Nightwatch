"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoadingStore } from "@/lib/stores/loading";

const ROUTE_SOURCE = "route-change";

/**
 * Watches for route changes and manages loading state.
 * Must be wrapped in Suspense due to useSearchParams.
 */
export function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { stop } = useLoadingStore();

  const isFirstRender = useRef(true);
  const prevPath = useRef(pathname);
  const prevSearch = useRef(searchParams.toString());

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentPath = pathname;
    const currentSearch = searchParams.toString();

    // Check if route actually changed
    if (currentPath !== prevPath.current || currentSearch !== prevSearch.current) {
      // Route changed - stop loading (page has loaded)
      stop(ROUTE_SOURCE);
    }

    prevPath.current = currentPath;
    prevSearch.current = currentSearch;
  }, [pathname, searchParams, stop]);

  return null;
}

/**
 * Intercepts link clicks to trigger loading overlay before navigation.
 * Should be mounted alongside RouteChangeLoader.
 */
export function NavigationInterceptor() {
  const pathname = usePathname();
  const { start } = useLoadingStore();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Check if it's an internal navigation link
      if (
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("#") &&
        !anchor.hasAttribute("download") &&
        anchor.target !== "_blank"
      ) {
        // Get the path part of the href (without query params or hash)
        const targetPath = href.split("?")[0].split("#")[0];

        // Don't trigger loading if already on the target page
        if (targetPath === pathname) {
          return;
        }

        // Start loading overlay
        start(ROUTE_SOURCE);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [start, pathname]);

  return null;
}
