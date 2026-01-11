import type {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import type { AppHealthMetricSnapshot } from "@/lib/types";

/**
 * A unique key for a snapshot, combining category and metric type.
 * Format: `${category}:${metricType}`
 */
export type SnapshotKey = `${AnalyticsMetricCategory}:${AnalyticsMetricType}`;

/**
 * Request parameters for a metric snapshot.
 */
export type SnapshotRequest = {
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
};

/**
 * A metric to display in snapshot highlights.
 */
export type SnapshotHighlightMetric = SnapshotRequest & {
  /** Display label for the metric */
  label: string;
  /** Maximum number of entries to display */
  valueLimit?: number;
  /** Sort order for entries */
  sort?: "alpha";
  /** Function to get color for an entry */
  getEntryColor?: (label: string) => string | undefined;
  /** Snapshot data for this metric */
  snapshot?: AppHealthMetricSnapshot | null;
};

/**
 * A group of related snapshot highlight metrics.
 */
export type SnapshotHighlightGroup = {
  /** Title of the group */
  title: string;
  /** Disclaimer text for the group */
  disclaimer: string;
  /** Metrics in this group */
  metrics: readonly SnapshotHighlightMetric[];
};

/**
 * A record of metric snapshots keyed by snapshot key.
 */
export type MetricSnapshotRecord = Partial<
  Record<SnapshotKey, AppHealthMetricSnapshot | null>
>;
