import { ENDPOINTS } from "@/constants/endpoints";

/**
 * Centralized API client for communicating with the CMNW backend
 * Handles request formatting, error handling, and response parsing
 */
export class ApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = ENDPOINTS.API;
  }

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
    const url = new URL(`${this.baseUrl}${endpoint}`);

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

    try {
      const response = await fetch(url.toString(), {
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

  private logError(error: ApiError | Error, context: string) {
    console.error(`API Error in ${context}:`, error.message);
    if (error instanceof ApiError) {
      console.error("Status Code:", error.statusCode);
      console.error("Details:", error.details);
    }
  }

  /**
   * Make a POST request to the API (for future use)
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
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
