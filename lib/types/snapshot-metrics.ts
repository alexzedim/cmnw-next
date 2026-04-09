import type {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import type { AppHealthMetricSnapshot } from "@/lib/types";

export type SnapshotKey = `${AnalyticsMetricCategory}:${AnalyticsMetricType}`;

export type SnapshotRequest = {
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
};

export type SnapshotHighlightMetric = SnapshotRequest & {
  labelKey: string;
  label?: string;
  valueLimit?: number;
  sort?: "alpha";
  getEntryColor?: (label: string) => string | undefined;
  snapshot?: AppHealthMetricSnapshot | null;
};

export type SnapshotHighlightGroup = {
  titleKey: string;
  title?: string;
  disclaimerKey: string;
  disclaimer?: string;
  metrics: readonly SnapshotHighlightMetric[];
};

export type MetricSnapshotRecord = Partial<
  Record<SnapshotKey, AppHealthMetricSnapshot | null>
>;
