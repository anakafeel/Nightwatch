import { routeResultSchema } from "./schemas";
import type { RouteRequest, RouteResult } from "./routes";
import { mockRouteResult, simulateDelay } from "./mockRoute";

/**
 * API configuration
 * Set in frontend/.env.local:
 * NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/v1
 * NEXT_PUBLIC_USE_MOCK=false
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true" || !API_URL;

/** Check if running in demo mode (no backend) */
export const isDemoMode = USE_MOCK;
console.log("[API]", {
  API_URL,
  USE_MOCK,
  NEXT_PUBLIC_USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK,
});

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
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
      const text = await response.text().catch(() => "");
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText} ${text ? `- ${text}` : ""}`,
        response.status,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
    );
  }
}

export async function fetchRoute(request: RouteRequest): Promise<RouteResult> {
  if (USE_MOCK) {
    await simulateDelay(800);
    return mockRouteResult;
  }

  const response = await fetchApi<RouteResult>("/route/compare", {
    method: "POST",
    body: JSON.stringify(request),
  });

  const parsed = routeResultSchema.safeParse(response);
  if (!parsed.success) {
    // This makes debugging 10x easier
    // eslint-disable-next-line no-console
    console.error(
      "Invalid API response (zod)",
      parsed.error.flatten(),
      response,
    );
    throw new ApiError("Invalid response format from API");
  }

  return parsed.data as RouteResult;
}

export async function checkHealth(): Promise<{ status: string }> {
  if (USE_MOCK) return { status: "ok" };
  return fetchApi<{ status: string }>("/health");
}

export const api = {
  route: { fetch: fetchRoute },
  health: { check: checkHealth },
};
