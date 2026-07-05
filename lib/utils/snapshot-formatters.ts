import type {
  AnalyticsMetricSnapshotDto,
  AppHealthMetricSnapshot,
} from "@/lib/types";
import type {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import type { SnapshotKey } from "@/lib/types/snapshot-metrics";
import type { Locale } from "@/dictionaries";

const LOCALE_MAP: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
};

/**
 * Picks a human-readable label from a ranked-list element.
 * Resolution chain: locale name → en_US name → flat name → #itemId → guid.
 */
const rankLabel = (
  element: Record<string, unknown>,
  locale: Locale = "en"
): string => {
  if (element.names && typeof element.names === "object") {
    const names = element.names as Record<string, string>;
    const localeKey = LOCALE_MAP[locale] ?? "en_US";
    if (names[localeKey]) return names[localeKey];
    if (names.en_US) return names.en_US;
  }

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
 *  - market items: `volume` (gold), then `auctions` (count)
 *  - contracts: `openInterest`, `quantity`, then `stdDev` (price volatility)
 */
const rankValue = (element: Record<string, unknown>): unknown =>
  element.value ??
  element.volume ??
  element.auctions ??
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
    "auctions" in (entryValue as Record<string, unknown>) ||
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
  value: unknown,
  locale: Locale = "en"
): Record<string, unknown> => {
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value
        .filter(
          (element): element is Record<string, unknown> =>
            Boolean(element) && typeof element === "object"
        )
        .map((element) => [rankLabel(element, locale), element])
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
  snapshot: AnalyticsMetricSnapshotDto,
  locale: Locale = "en"
): AppHealthMetricSnapshot => ({
  snapshotDate:
    snapshot.snapshotDate || snapshot.createdAt || new Date().toISOString(),
  value: normalizeSnapshotValue(snapshot.value, locale),
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
  limit = 4,
  locale: Locale = "en"
): Array<[string, unknown]> => {
  if (!snapshot?.value || typeof snapshot.value !== "object") {
    return [];
  }

  return Object.entries(snapshot.value)
    .slice(0, limit)
    .map(([key, entryValue]) =>
      isRankRecord(entryValue)
        ? [rankLabel(entryValue, locale), rankValue(entryValue)]
        : [key, entryValue]
    );
};

export type SnapshotEntry = {
  label: string;
  value: unknown;
  href?: string;
};

const buildEntryHref = (element: Record<string, unknown>): string | undefined => {
  if (typeof element.guid === "string" && element.guid.length > 0) {
    const [name, realm] = element.guid.split("@");
    if (name && realm) return `/guild/${element.guid}`;
  }
  if (typeof element.itemId === "number") {
    return `/item/${element.itemId}`;
  }
  return undefined;
};

export const getSnapshotEntriesRich = (
  snapshot: AppHealthMetricSnapshot | null,
  limit = 4,
  locale: Locale = "en"
): SnapshotEntry[] => {
  if (!snapshot?.value || typeof snapshot.value !== "object") {
    return [];
  }

  const snapshotValue = snapshot.value as Record<string, unknown>;

  // Price volatility payloads ({ itemId, stdDev, avgPrice }) are preformatted
  // to a single string showing both σ and avg in gold, since neither figure is
  // meaningful as a bare count.
  if (
    typeof snapshotValue.itemId === "number" &&
    typeof snapshotValue.stdDev === "number"
  ) {
    return [{
      label: rankLabel(snapshotValue, locale),
      value: formatPriceVolatility(snapshotValue.stdDev),
      href: buildEntryHref(snapshotValue),
    }];
  }

  // If the snapshot value itself is a single rank record (has itemId/guid at top
  // level rather than being a map of records), treat it as a single entry.
  if (isRankRecord(snapshotValue) || typeof snapshotValue.itemId === "number" || typeof snapshotValue.guid === "string") {
    const el = snapshotValue as Record<string, unknown>;
    return [{
      label: rankLabel(el, locale),
      value: rankValue(el),
      href: buildEntryHref(el),
    }];
  }

  return Object.entries(snapshotValue)
    .slice(0, limit)
    .map(([key, entryValue]) => {
      if (isRankRecord(entryValue)) {
        const el = entryValue as Record<string, unknown>;
        return {
          label: rankLabel(el, locale),
          value: rankValue(el),
          href: buildEntryHref(el),
        };
      }
      return { label: key, value: entryValue };
    });
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
 * - "gold":   WoW copper -> gold with apostrophe grouping (1'334'200 g)
 * - "number": count with space grouping (1 000 000)
 */
export type SnapshotValueFormat = "number" | "gold";

const apostropheNumberFormatter = new Intl.NumberFormat("de-CH", {
  maximumFractionDigits: 0,
});

export type GoldFormatted = { amount: string; suffix: "g" };

export const formatGoldValue = (copper: number): GoldFormatted => ({
  amount: apostropheNumberFormatter.format(Math.round(copper / 10_000)),
  suffix: "g",
});

/**
 * Formats a count with space-separated thousands (1 000 000), used for
 * non-gold metrics (character/guild/auction counts, price-range tallies, ...).
 */
const formatPlainNumber = (value: number): string =>
  apostropheNumberFormatter.format(value).replace(/'/g, " ");

/**
 * Formats a price-volatility stdDev (in copper) as a gold/silver/copper
 * breakdown prefixed with sigma, e.g. 2549 -> "σ 0 g 25 s 49 c".
 * Returns "—" if stdDev is missing or non-finite.
 */
export const formatPriceVolatility = (stdDev: unknown): string => {
  if (typeof stdDev !== "number" || !Number.isFinite(stdDev)) {
    return "—";
  }
  return `σ ${formatCopperBreakdown(stdDev)}`;
};

/**
 * Breaks a copper amount into gold/silver/copper and renders the non-zero
 * components, e.g. 2550 -> "0 g 25 s 50 c", 10000 -> "1 g", 50 -> "50 c".
 */
const formatCopperBreakdown = (copper: number): string => {
  const g = Math.floor(copper / 10000);
  const s = Math.floor((copper % 10000) / 100);
  const c = Math.floor(copper % 100);
  return `${g} g ${s} s ${c} c`;
};

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
      const { amount, suffix } = formatGoldValue(value);
      return `${amount} ${suffix}`;
    }

    return formatPlainNumber(value);
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
 * Canonical low-to-high ordering for price-range buckets. Keys are the stable
 * snapshot entry keys (shared across locales); the dictionary value is a
 * localized label such as "1k ⋯ 10k g".
 */
export const PRICE_RANGE_ORDER = [
  "under1k",
  "1k-10k",
  "10k-100k",
  "100k-1m",
  "over1m",
] as const;

/**
 * Returns the rank (0-based) of a price-range bucket key within
 * PRICE_RANGE_ORDER. Unknown keys sort last, preserving their relative order.
 */
export const priceRangeRank = (key: string): number => {
  const index = PRICE_RANGE_ORDER.indexOf(key as (typeof PRICE_RANGE_ORDER)[number]);
  return index === -1 ? PRICE_RANGE_ORDER.length : index;
};

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
