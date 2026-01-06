export interface AppHealthMetricSnapshot {
  snapshotDate: string;
  value: Record<string, unknown>;
}

export interface AppHealthPayload {
  status: "ok";
  version: string;
  uptime: string;
  latestMarketTimestamp: number | null;
}

export type AnalyticsMetricCategory = "characters" | "guilds" | "market";

export type AnalyticsMetricType = "total";

export interface AnalyticsMetricSnapshotDto {
  id: string;
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
  realmId: number | null;
  value: Record<string, unknown>;
  snapshotDate: string | null;
  createdAt: string;
  updatedAt?: string | null;
}
