import { API_ORIGIN } from "@/config/api-origin";

// External service domains
export const ENDPOINTS = {
  API: API_ORIGIN || "https://cmnw.me",
  METRICS_ENDPOINT: `${API_ORIGIN}/api/app/metrics`,
  METRIC_SNAPSHOT_ENDPOINT: `${API_ORIGIN}/api/app/metrics/snapshot`,
  LOCALHOST: "http://localhost:8080",
  WARCRAFT_LOGS: "https://www.warcraftlogs.com",
  WOW_PROGRESS: "https://www.wowprogress.com",
  RAIDER_IO: "https://raider.io",
  BATTLE_NET: "https://worldofwarcraft.com",
  CHECK_PVP: "https://check-pvp.fr",
};
