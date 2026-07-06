const normalizeOrigin = (origin) => (origin ?? "").replace(/\/+$/, "");

// ---------------------------------------------------------------------------
// Origin resolution strategy
//
// Server-side (Node.js / Next.js server components / route handlers):
//   Try Docker DNS first (cmnw-api:8080), fall back to the host hairpin
//   (128.0.0.255:8080) if DNS resolution fails. The actual fallback happens
//   at runtime in lib/api/origins.ts -> serverFetch().
//
// Client-side (browser):
//   Empty string = same-origin. The browser calls /api/* on whatever domain
//   it loaded the page from (cmnw.me, cmnw.ru, cmnw.xyz). Nginx proxies all
//   of them. Cross-domain fallback to the alternate domain on network failure
//   is handled at runtime in lib/api/origins.ts -> clientFetch().
// ---------------------------------------------------------------------------

// Ordered list of server-side origins to try (first success wins).
const SERVER_ORIGINS = [
  normalizeOrigin("http://cmnw-api:8080"), // Docker DNS — fastest, preferred
  normalizeOrigin("http://128.0.0.255:8080"), // host hairpin — fallback
];

// Client-side: same-origin (empty string means relative to window.location).
const CLIENT_API_ORIGIN = "";

// Allow env override for local dev / debugging. API_URL is server-only.
const envApiUrl = normalizeOrigin(process.env.API_URL);

const isServerRuntime = () => typeof window === "undefined";

// For backward compat: API_ORIGIN is still exported.
// - Server: first server origin (or env override)
// - Client: empty string (same-origin)
const API_ORIGIN = envApiUrl
  ? envApiUrl
  : isServerRuntime()
    ? SERVER_ORIGINS[0]
    : CLIENT_API_ORIGIN;

module.exports = {
  API_ORIGIN,
  SERVER_ORIGINS,
  CLIENT_API_ORIGIN,
  normalizeOrigin,
};
