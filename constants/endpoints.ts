import { API_ORIGIN } from "@/config/api-origin";

// External service domains
export const ENDPOINTS = {
  API: API_ORIGIN || "https://cmnw.me",
  METRICS_ENDPOINT: `${API_ORIGIN}/api/app/metrics`,
  METRIC_SNAPSHOT_ENDPOINT: `${API_ORIGIN}/api/app/metrics/snapshot`,
  WS_FEED_PATH: "/api/ws/feed",
  LOCALHOST: "http://localhost:8080",
  WARCRAFT_LOGS: "https://www.warcraftlogs.com",
  WOW_PROGRESS: "https://www.wowprogress.com",
  RAIDER_IO: "https://raider.io",
  BATTLE_NET: "https://worldofwarcraft.com",
  CHECK_PVP: "https://check-pvp.fr",
};

// Resolve the WS feed URL on the client (derives ws/wss from current origin so
// it works in any deployment without a separate env var).
export const getWsFeedUrl = (): string => {
  if (typeof window === "undefined") {
    return `${ENDPOINTS.API.replace(/^http/, "ws")}${ENDPOINTS.WS_FEED_PATH}`;
  }
  const { protocol, host } = window.location;
  const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
  return `${wsProtocol}//${host}${ENDPOINTS.WS_FEED_PATH}`;
};
