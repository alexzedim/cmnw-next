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
