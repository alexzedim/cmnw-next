import type {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import type { PriceVolatilityData } from "@/lib/types/components";

export interface AppHealthMetricSnapshot {
  snapshotDate: string;
  value: Record<string, unknown> | PriceVolatilityData;
}

export interface AppHealthPayload {
  status: "ok";
  version: string;
  uptime: string;
  latestMarketTimestamp: number | null;
}

export type { AnalyticsMetricCategory, AnalyticsMetricType };

export interface AnalyticsMetricSnapshotDto {
  id: string;
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
  realmId: number | null;
  value: Record<string, unknown> | PriceVolatilityData;
  snapshotDate: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface AnalyticsMetricHistoryEntry {
  id: string;
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
  realmId: number | null;
  value: Record<string, unknown>;
  snapshotDate: string;
  createdAt: string;
}

/**
 * Raid log indexing statistics for a realm (or globally when realmSlug is null).
 * Mirrors IRaidLogsStats from @app/resources.
 */
export interface RaidLogsStats {
  realmSlug: string | null;
  total: number;
  indexed: number;
  notIndexed: number;
}

/**
 * One recently-updated entity rendered as a payload chip by the home
 * backdrop flow schemas. Mirrors IBackdropFlowPayload from @app/resources.
 */
export interface BackdropFlowPayload {
  guid: string;
  label: string;
}

/** Payload pools for the home backdrop, sampled by entity recency. */
export interface BackdropFlows {
  characters: BackdropFlowPayload[];
  guilds: BackdropFlowPayload[];
  orders: BackdropFlowPayload[];
}
