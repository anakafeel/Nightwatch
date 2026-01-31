import { routeResultSchema } from "./schemas";
import type { RouteRequest, RouteResult } from "./routes";
import { mockRouteResult, simulateDelay } from "./mockRoute";

/**
 * API configuration
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Base fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Network error"
    );
  }
}

/**
 * Fetch route recommendation from the backend
 */
export async function fetchRoute(request: RouteRequest): Promise<RouteResult> {
  // Use mock data in development or when mock mode is enabled
  if (USE_MOCK) {
    await simulateDelay(1500);
    return mockRouteResult;
  }

  const response = await fetchApi<RouteResult>("/route", {
    method: "POST",
    body: JSON.stringify(request),
  });

  // Validate response with Zod
  const parsed = routeResultSchema.safeParse(response);
  if (!parsed.success) {
    throw new ApiError("Invalid response format from API");
  }

  return parsed.data as RouteResult;
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<{ status: string }> {
  if (USE_MOCK) {
    return { status: "ok" };
  }

  return fetchApi<{ status: string }>("/health");
}

/**
 * API client object for organized access
 */
export const api = {
  route: {
    fetch: fetchRoute,
  },
  health: {
    check: checkHealth,
  },
};
