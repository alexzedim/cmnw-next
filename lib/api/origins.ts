/**
 * Multi-origin API routing with domain-aware fallback.
 *
 * --- Server-side (Node.js) ---
 * serverFetch() tries Docker DNS (cmnw-api:8080) first, then the host hairpin
 * (128.0.0.255:8080) on network failure. A cached "known-good" origin avoids
 * re-probing on every request; it resets only when that origin next fails.
 *
 * --- Client-side (browser) ---
 * clientFetch() uses same-origin by default (empty base = relative to the page
 * domain). On a hard network failure (TypeError: Failed to fetch) it falls back
 * to the alternate public domain. The successful fallback origin is remembered
 * in sessionStorage for the session and re-checked periodically so the client
 * returns to same-origin when it recovers.
 *
 * The WebSocket feed (getWsFeedUrl) follows the same logic, upgrading http(s)
 * to ws(s) and using the same-origin host with reconnect-driven fallback.
 */

import { SERVER_ORIGINS, CLIENT_API_ORIGIN } from "@/config/api-origin";

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

/** Network-level failure (DNS, connection refused, timeout) vs HTTP error. */
const isNetworkError = (error: unknown): boolean => {
  // The browser throws TypeError("Failed to fetch") on network-level failures.
  // AbortError is triggered by AbortSignal.timeout — treat as retryable too.
  if (error instanceof TypeError) return true;
  const name = (error as { name?: string })?.name;

  if (name === "AbortError") return true;

  // On Node.js (server-side), DNS failures surface as errors containing "fetch".
  return String(error).toLowerCase().includes("fetch");
};

// ---------------------------------------------------------------------------
// Server-side: container DNS → host hairpin fallback
// ---------------------------------------------------------------------------

let serverKnownGoodOrigin: string | null = null;

/**
 * Fetch wrapper for server-side code (route handlers, server components).
 *
 * Tries origins in order (SERVER_ORIGINS), but skips to the known-good one if
 * we've had a previous success. Only network errors trigger fallback — HTTP
 * 4xx/5xx are returned as-is so callers can handle them.
 */
export async function serverFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  // An explicit API_URL (local dev) always wins — even over the cached
  // known-good origin. Without this, serverKnownGoodOrigin can latch onto a
  // stale production-style backend (e.g. the host hairpin at 128.0.0.255:8080)
  // that's reachable but missing newer endpoints, causing 404s in dev while
  // the local backend (API_URL) has them.
  const envApiUrl = (process.env.API_URL ?? "").replace(/\/+$/, "");

  const origins = envApiUrl
    ? [envApiUrl, ...SERVER_ORIGINS.filter((o) => o !== envApiUrl)]
    : serverKnownGoodOrigin
      ? [
          serverKnownGoodOrigin,
          ...SERVER_ORIGINS.filter((o) => o !== serverKnownGoodOrigin),
        ]
      : SERVER_ORIGINS;

  let lastError: unknown = null;

  for (const origin of origins) {
    const url = `${origin}${path}`;

    try {
      const response = await fetch(url, init);

      // Any HTTP response (even 5xx) means the origin is reachable — cache it
      // and return so the caller handles the status code.
      serverKnownGoodOrigin = origin;

      return response;
    } catch (error) {
      // Network error — try next origin.
      lastError = error;
      continue;
    }
  }

  // All origins failed.
  throw lastError ?? new Error("All server API origins failed");
}

// ---------------------------------------------------------------------------
// Client-side: same-origin → alternate domain fallback
// ---------------------------------------------------------------------------

/**
 * The public domains that can serve the API. At runtime we filter out the
 * current origin (window.location.origin) so only the *alternate* domains
 * are used as fallbacks.
 */
const PUBLIC_DOMAINS = [
  "https://cmnw.me",
  "https://cmnw.ru",
  "https://cmnw.xyz",
];

const FALLBACK_STORAGE_KEY = "cmnw:api-fallback-origin";
const HEALTH_CHECK_INTERVAL_MS = 60_000; // re-check same-origin every 60s

let healthCheckTimer: ReturnType<typeof setInterval> | null = null;

const isBrowser = (): boolean => typeof window !== "undefined";

/** Current page origin (e.g. "https://cmnw.me"). */
const currentOrigin = (): string => (isBrowser() ? window.location.origin : "");

/**
 * Alternate domains to try if same-origin fails, excluding the current origin.
 * Read once per call (cheap) so it stays correct across SPA navigations.
 */
const getFallbackOrigins = (): string[] => {
  const current = currentOrigin();

  return PUBLIC_DOMAINS.filter((d) => d !== current);
};

/** Read the sticky fallback from sessionStorage (survives page refresh). */
const readStoredFallback = (): string | null => {
  if (!isBrowser()) return null;

  try {
    return sessionStorage.getItem(FALLBACK_STORAGE_KEY);
  } catch {
    return null;
  }
};

/** Persist the sticky fallback so subsequent requests skip the failed origin. */
const writeStoredFallback = (origin: string): void => {
  if (!isBrowser()) return;

  try {
    sessionStorage.setItem(FALLBACK_STORAGE_KEY, origin);
  } catch {
    // sessionStorage may be unavailable (private mode) — non-fatal.
  }
};

const clearStoredFallback = (): void => {
  if (!isBrowser()) return;

  try {
    sessionStorage.removeItem(FALLBACK_STORAGE_KEY);
  } catch {
    // non-fatal
  }
};

/**
 * Background health check: probe same-origin. If it responds, clear the
 * sticky fallback so subsequent requests return to same-origin.
 */
const scheduleOriginHealthCheck = (): void => {
  if (!isBrowser()) return;
  if (healthCheckTimer) return; // already scheduled

  healthCheckTimer = setInterval(async () => {
    try {
      const response = await fetch("/api/app/metrics", {
        method: "HEAD",
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok || response.status < 500) {
        // Same-origin is healthy again — return to it.
        clearStoredFallback();

        if (healthCheckTimer) {
          clearInterval(healthCheckTimer);
          healthCheckTimer = null;
        }
      }
    } catch {
      // Still down — keep using fallback, check again next interval.
    }
  }, HEALTH_CHECK_INTERVAL_MS);
};

/**
 * Fetch wrapper for client-side code (providers, hooks, components).
 *
 * Uses same-origin by default (relative URL). On a hard network failure it
 * falls back to the alternate public domains in order. Once a fallback
 * succeeds, it's remembered for the session.
 *
 * Only network errors (TypeError) trigger fallback — HTTP error codes are
 * returned as-is.
 */
export async function clientFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  if (!isBrowser()) {
    // SSR safety — shouldn't be called server-side, but degrade gracefully.
    return fetch(path, init);
  }

  // Build candidate base origins: sticky fallback first (if set), then
  // same-origin (empty string), then alternate domains.
  const stored = readStoredFallback();
  const bases: string[] = [];

  if (stored && stored !== currentOrigin()) {
    bases.push(stored);
  }

  bases.push(CLIENT_API_ORIGIN); // same-origin (empty string)

  for (const fallback of getFallbackOrigins()) {
    if (!bases.includes(fallback)) bases.push(fallback);
  }

  let lastError: unknown = null;

  for (const base of bases) {
    const url = `${base}${path}`;

    try {
      const response = await fetch(url, init);

      // Any HTTP response means the origin is reachable.
      if (base !== CLIENT_API_ORIGIN) {
        // We reached an alternate domain successfully — remember it.
        writeStoredFallback(base);
        scheduleOriginHealthCheck();
      }

      return response;
    } catch (error) {
      if (!isNetworkError(error)) throw error; // programming error, don't retry
      lastError = error;
      continue;
    }
  }

  throw lastError ?? new Error("All client API origins failed");
}

// ---------------------------------------------------------------------------
// WebSocket feed URL — same-origin with fallback awareness
// ---------------------------------------------------------------------------

const toWsOrigin = (origin: string): string => origin.replace(/^http/i, "ws");

/**
 * Build the WebSocket feed URL.
 *
 * On the server (SSR) returns a placeholder — the provider only connects in
 * the browser. In the browser it uses same-origin by default. If a sticky
 * fallback is active, uses that domain instead so the WS connects to the
 * known-good origin.
 *
 * @param sessionId - optional session id for targeted refresh events
 * @param wsFeedPath - the WS endpoint path (default: "/api/ws/feed")
 */
export const getWsFeedUrl = (
  sessionId?: string,
  wsFeedPath = "/api/ws/feed"
): string => {
  if (!isBrowser()) {
    // SSR: return a placeholder; the provider guards against connecting.
    return `${wsFeedPath}`;
  }

  // Use the sticky fallback if set, otherwise same-origin.
  const stored = readStoredFallback();
  const base = stored ?? `${window.location.origin}`;

  const wsBase = toWsOrigin(base);
  const url = `${wsBase}${wsFeedPath}`;

  if (!sessionId) return url;

  return `${url}?session=${encodeURIComponent(sessionId)}`;
};
