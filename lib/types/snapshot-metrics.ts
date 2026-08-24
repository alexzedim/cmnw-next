import type {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import type { AppHealthMetricSnapshot } from "@/lib/types";
import type { SnapshotValueFormat } from "@/lib/utils/snapshot-formatters";

export type SnapshotKey = `${AnalyticsMetricCategory}:${AnalyticsMetricType}`;

export type SnapshotRequest = {
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
};

export type SnapshotHighlightMetric = SnapshotRequest & {
  labelKey: string;
  label?: string;
  valueLimit?: number;
  sort?: "alpha" | "priceRange" | "memberRange";
  valueFormat?: SnapshotValueFormat;
  /**
   * Preferred snapshot entry field to project as the displayed value.
   * Needed when an entry contains several metric fields (contracts records
   * carry both maxOpenInterest and maxQuantity) — the generic rankValue
   * cascade would otherwise pick the wrong one.
   */
  valueKey?: string;
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
