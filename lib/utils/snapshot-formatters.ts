import type {
  AnalyticsMetricSnapshotDto,
  AppHealthMetricSnapshot,
} from "@/lib/types";
import type {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import type { SnapshotKey } from "@/lib/types/snapshot-metrics";

/**
 * Normalizes a snapshot value to a record object.
 * Returns an empty object if the value is not a valid object.
 */
export const normalizeSnapshotValue = (
  value: unknown
): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
};

/**
 * Converts an analytics metric snapshot DTO to an app health metric snapshot.
 */
export const toAppHealthSnapshot = (
  snapshot: AnalyticsMetricSnapshotDto
): AppHealthMetricSnapshot => ({
  snapshotDate:
    snapshot.snapshotDate || snapshot.createdAt || new Date().toISOString(),
  value: normalizeSnapshotValue(snapshot.value),
});

/**
 * Extracts entries from a snapshot value, limited to a maximum count.
 */
export const getSnapshotEntries = (
  snapshot: AppHealthMetricSnapshot | null,
  limit = 4
): Array<[string, unknown]> => {
  if (!snapshot?.value || typeof snapshot.value !== "object") {
    return [];
  }

  return Object.entries(snapshot.value).slice(0, limit);
};

/**
 * Formats a snapshot date to a localized string.
 * Returns null if the snapshot has no date.
 */
export const formatSnapshotDate = (
  snapshot: AppHealthMetricSnapshot | null
): string | null => {
  if (!snapshot?.snapshotDate) {
    return null;
  }
  const date = new Date(snapshot.snapshotDate);

  return Number.isNaN(date.getTime())
    ? snapshot.snapshotDate
    : date.toLocaleString();
};

/**
 * Formats a value for display.
 * Handles null, numbers, strings, and objects.
 */
export const formatEntryValue = (value: unknown): string => {
  if (value == null) {
    return "—";
  }
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

/**
 * Builds a snapshot key from category and metric type.
 */
export const buildSnapshotKey = (
  category: AnalyticsMetricCategory,
  metricType: AnalyticsMetricType
): SnapshotKey => `${category}:${metricType}` as SnapshotKey;

/**
 * Checks if a value is a PriceVolatilityData object.
 */
export const isPriceVolatilityData = (
  value: unknown
): value is { itemId: number; stdDev: number; avgPrice: number } => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const obj = value as Record<string, unknown>;

  return (
    typeof obj.itemId === "number" &&
    typeof obj.stdDev === "number" &&
    typeof obj.avgPrice === "number"
  );
};

/**
 * Extracts price volatility data from a snapshot.
 * Returns null if the snapshot is null, undefined, or doesn't contain price volatility data.
 */
export const getPriceVolatilityData = (
  snapshot: AppHealthMetricSnapshot | null
): { itemId: number; stdDev: number; avgPrice: number } | null => {
  if (!snapshot?.value) {
    return null;
  }

  if (isPriceVolatilityData(snapshot.value)) {
    return snapshot.value;
  }

  return null;
};
