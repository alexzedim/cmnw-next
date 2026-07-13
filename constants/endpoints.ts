/**
 * API endpoint paths.
 *
 * All paths are relative (same-origin). The browser calls /api/* on whatever
 * domain it loaded the page from (cmnw.me, cmnw.ru, cmnw.xyz), and nginx
 * proxies each to the backend. Cross-domain fallback on network failure is
 * handled transparently by clientFetch() in lib/api/origins.ts.
 */

export const ENDPOINTS = {
  // Base is empty — same-origin relative URLs. Use clientFetch()/serverFetch()
  // from lib/api/origins.ts to get automatic fallback support.
  API: "",

  // API paths (relative)
  METRICS_PATH: "/api/app/metrics",
  METRIC_SNAPSHOT_PATH: "/api/app/metrics/snapshot",
  WS_FEED_PATH: "/api/ws/feed",
  OSINT_CHARACTER: "/api/osint/character",
  OSINT_GUILD: "/api/osint/guild",

  // Local dev reference (not used in production routing)
  LOCALHOST: "http://localhost:8081",

  // External service domains
  WARCRAFT_LOGS: "https://www.warcraftlogs.com",
  WOW_PROGRESS: "https://wowprogress.com",
  RAIDER_IO: "https://raider.io",
  BATTLE_NET: "https://worldofwarcraft.com",
  CHECK_PVP: "https://checkpvp.fr",
};
