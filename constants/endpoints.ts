import { API_ORIGIN } from "@/config/api-origin";

// External service domains
export const ENDPOINTS = {
  API: API_ORIGIN || "https://cmnw.me",
  METRICS_ENDPOINT: `${API_ORIGIN}/api/app/metrics`,
  METRIC_SNAPSHOT_ENDPOINT: `${API_ORIGIN}/api/app/metrics/snapshot`,
  WS_FEED_PATH: "/api/ws/feed",
  LOCALHOST: "http://localhost:8081",
  WARCRAFT_LOGS: "https://www.warcraftlogs.com",
  WOW_PROGRESS: "https://wowprogress.com",
  RAIDER_IO: "https://raider.io",
  BATTLE_NET: "https://worldofwarcraft.com",
  CHECK_PVP: "https://check-pvp.fr",
};

// Resolve the WS feed URL. Always targets the API origin (ENDPOINTS.API),
// upgrading http(s):// to ws(s)://. Works in any deployment without an env var.
const toWsOrigin = (origin: string): string => origin.replace(/^http/i, "ws");

export const getWsFeedUrl = (): string => {
  return `${toWsOrigin(ENDPOINTS.API)}${ENDPOINTS.WS_FEED_PATH}`;
};
