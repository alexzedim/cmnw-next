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
 * Picks a human-readable label from a ranked-list element.
 * Prefers `name` (guilds/characters), falls back to `itemId` (market items).
 */
const rankLabel = (element: Record<string, unknown>): string => {
  if (typeof element.name === "string" && element.name.length > 0) {
    return element.name;
  }

  if (element.itemId != null) {
    return `#${element.itemId}`;
  }

  if (typeof element.guid === "string") {
    return element.guid;
  }

  return JSON.stringify(element);
};

/**
 * Picks the primary metric value from a ranked-list element.
 * Order reflects relevance per metric family:
 *  - guild rankings: `value` (members_count / achievement_points)
 *  - market items: `volume` (gold) then `auctions` (count)
 *  - contracts: `openInterest`, `quantity`, then `stdDev` (price volatility)
 */
const rankValue = (element: Record<string, unknown>): unknown =>
  element.value ??
  element.volume ??
  element.openInterest ??
  element.quantity ??
  element.stdDev ??
  null;

/**
 * Detects whether a snapshot entry value is a ranked record (the standardized
 * backend object format: keys are entity ids, values are nested records such
 * as { guid, name, realm, value } or { itemId, volume, auctions }).
 */
const isRankRecord = (
  entryValue: unknown
): entryValue is Record<string, unknown> =>
  Boolean(entryValue) &&
  typeof entryValue === "object" &&
  !Array.isArray(entryValue) &&
  ("value" in (entryValue as Record<string, unknown>) ||
    "volume" in (entryValue as Record<string, unknown>) ||
    "openInterest" in (entryValue as Record<string, unknown>) ||
    "stdDev" in (entryValue as Record<string, unknown>));

/**
 * Normalizes a snapshot value to a record of label -> value pairs.
 *
 * Backend snapshots come in two shapes:
 *  - object maps (key -> number): sizeDistribution, priceRanges, totals, ...
 *  - ranked maps (key -> record): topByMembers/topByVolume/etc. where each
 *    value is a nested record such as { guid, name, realm, value }
 *
 * Ranked records are projected to [label, scalar] entries so they render
 * through the same key/value rows as plain object maps.
 */
export const normalizeSnapshotValue = (
  value: unknown
): Record<string, unknown> => {
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value
        .filter(
          (element): element is Record<string, unknown> =>
            Boolean(element) && typeof element === "object"
        )
        .map((element) => [rankLabel(element), rankValue(element)])
    );
  }

  if (value && typeof value === "object") {
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
 *
 * For ranked metrics (standardized object format where each value is a nested
 * record like { guid, name, realm, value }), the record is projected to a
 * `[label, scalar]` pair so the renderer treats it like any other row.
 * Insertion order is preserved so ranked lists (topByMembers, ...) keep
 * their backend ordering.
 */
export const getSnapshotEntries = (
  snapshot: AppHealthMetricSnapshot | null,
  limit = 4
): Array<[string, unknown]> => {
  if (!snapshot?.value || typeof snapshot.value !== "object") {
    return [];
  }

  return Object.entries(snapshot.value)
    .slice(0, limit)
    .map(([key, entryValue]) =>
      isRankRecord(entryValue)
        ? [rankLabel(entryValue), rankValue(entryValue)]
        : [key, entryValue]
    );
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
 * How a metric value should be rendered.
 * - "number": full grouped digits (1,234,567)
 * - "gold":   WoW copper -> gold, compact (132,290,314,000 copper -> "13.23Mg")
 */
export type SnapshotValueFormat = "number" | "gold";

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

/**
 * Formats a value for display.
 * Handles null, numbers, strings, and objects.
 */
export const formatEntryValue = (
  value: unknown,
  valueFormat: SnapshotValueFormat = "number"
): string => {
  if (value == null) {
    return "—";
  }
  if (typeof value === "number") {
    if (valueFormat === "gold") {
      const gold = value / 10_000;

      return `${compactNumberFormatter.format(gold)}g`;
    }

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
