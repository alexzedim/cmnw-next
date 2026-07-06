import { ENDPOINTS } from "@/constants/endpoints";
import { clientFetch } from "@/lib/api/origins";

/**
 * Centralized API client for communicating with the CMNW backend
 * Handles request formatting, error handling, and response parsing.
 *
 * Uses clientFetch() for automatic same-origin + cross-domain fallback.
 */
export class ApiClient {
  /**
   * Make a GET request to the API
   * @param endpoint - API endpoint path (e.g., '/api/osint/character')
   * @param params - Query parameters as key-value object
   * @param options - Additional fetch options
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    options?: RequestInit
  ): Promise<T> {
    // Build the path with query params, then let clientFetch resolve the origin.
    const url = new URL(endpoint, ENDPOINTS.API || "http://localhost");

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle arrays
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)));
          } else {
            const stringValue = String(value);

            // Special handling for GUID parameters (those containing @)
            // URLSearchParams automatically encodes special characters
            url.searchParams.append(key, stringValue);
          }
        }
      });
    }

    // Extract the path + search (without origin) for clientFetch.
    const pathWithQuery = `${url.pathname}${url.search}`;

    try {
      const response = await clientFetch(pathWithQuery, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour by default
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");

        throw new ApiError(
          `API Error: ${response.status} ${response.statusText}`,
          response.status,
          errorText
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        0,
        String(error)
      );
    }
  }

  /**
   * Make a POST request to the API.
   *
   * Uses clientFetch() for automatic fallback. The backend has CORS configured
   * to reflect the browser origin, so cross-origin POSTs (including the
   * Content-Type preflight) are handled directly.
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await clientFetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: JSON.stringify(body),
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");

        throw new ApiError(
          `API Error: ${response.status} ${response.statusText}`,
          response.status,
          errorText
        );
      }

      // Tolerate empty bodies (204 No Content, or 200 with empty payload) —
      // common for fire-and-forget triggers. Parsing such a body as JSON
      // would throw, so return undefined in that case.
      if (
        response.status === 204 ||
        response.headers.get("Content-Length") === "0"
      ) {
        return undefined as T;
      }

      const text = await response.text();

      if (!text) {
        return undefined as T;
      }

      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        0,
        String(error)
      );
    }
  }
}

/**
 * Custom API Error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
