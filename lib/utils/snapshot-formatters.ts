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
 * A metric-defined `preferredKey` (e.g. "maxQuantity" for topByQuantity)
 * wins when present, since contracts records carry several metric fields
 * (maxOpenInterest AND maxQuantity) and the generic order below cannot
 * distinguish which metric the card is rendering.
 * Fallback order reflects relevance per metric family:
 *  - guild rankings: `value` (achievement_points)
 *  - market items: `volume` (gold), then `auctions` (count)
 *  - contracts: peak `maxOpenInterest`/`maxQuantity` (intraday MAX over 24h),
 *    then legacy `openInterest`/`quantity`, then `stdDev` (price volatility)
 */
const rankValue = (
  element: Record<string, unknown>,
  preferredKey?: string
): unknown => {
  const preferred =
    preferredKey != null && element[preferredKey] != null
      ? element[preferredKey]
      : undefined;

  return (
    preferred ??
    element.value ??
    element.volume ??
    element.auctions ??
    element.maxOpenInterest ??
    element.maxQuantity ??
    element.openInterest ??
    element.quantity ??
    element.stdDev ??
    null
  );
};

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
    "maxOpenInterest" in (entryValue as Record<string, unknown>) ||
    "maxQuantity" in (entryValue as Record<string, unknown>) ||
    "openInterest" in (entryValue as Record<string, unknown>) ||
    "stdDev" in (entryValue as Record<string, unknown>));

/**
 * Detects a distribution payload ({ total, ranges, stats }) where the counts
 * live in a nested `ranges` record (membersDistribution,
 * achievementsDistribution). `stats` (min/max/avg/percentiles) cannot render
 * as flat rows and is dropped here.
 */
const isDistributionPayload = (
  value: Record<string, unknown>
): value is { ranges: Record<string, number> } => {
  const ranges = value.ranges as Record<string, unknown> | undefined;

  return (
    Boolean(ranges) &&
    typeof ranges === "object" &&
    !Array.isArray(ranges) &&
    Object.values(ranges).every(
      (count) => typeof count === "number" && Number.isFinite(count)
    )
  );
};

/**
 * Normalizes a snapshot value to a record of label -> value pairs.
 *
 * Backend snapshots come in three shapes:
 *  - object maps (key -> number): membersDistribution (flattened from
 *    `ranges`), priceRanges, totals, ...
 *  - ranked maps (key -> record): topByAchievements/topByVolume/etc. where
 *    each value is a nested record such as { guid, name, realm, value }
 *  - distribution payloads ({ total, ranges, stats }): flattened to the
 *    `ranges` map so they render like plain object maps
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
    const record = value as Record<string, unknown>;

    if (isDistributionPayload(record)) {
      return record.ranges;
    }

    return record;
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
 * Insertion order is preserved so ranked lists keep their backend ordering
 * (topByAchievements, ...).
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

const buildEntryHref = (
  element: Record<string, unknown>,
  hrefBase = "/guild"
): string | undefined => {
  if (typeof element.guid === "string" && element.guid.length > 0) {
    const [name, realm] = element.guid.split("@");

    if (name && realm) return `${hrefBase}/${element.guid}`;
  }
  if (typeof element.itemId === "number") {
    return `/item/${element.itemId}`;
  }

  return undefined;
};

export const getSnapshotEntriesRich = (
  snapshot: AppHealthMetricSnapshot | null,
  limit = 4,
  locale: Locale = "en",
  preferredValueKey?: string,
  hrefBase?: string
): SnapshotEntry[] => {
  if (!snapshot?.value || typeof snapshot.value !== "object") {
    return [];
  }

  const snapshotValue = snapshot.value as Record<string, unknown>;

  // Price volatility payloads ({ itemId, stdDev, avgPrice }) are preformatted
  // to a single string showing σ in gold, since the figure is not meaningful
  // as a bare count.
  if (
    typeof snapshotValue.itemId === "number" &&
    typeof snapshotValue.stdDev === "number"
  ) {
    return [
      {
        label: rankLabel(snapshotValue, locale),
        value: formatPriceVolatility(snapshotValue.stdDev),
        href: buildEntryHref(snapshotValue),
      },
    ];
  }
  // If the snapshot value itself is a single rank record (has itemId/guid at top
  // level rather than being a map of records), treat it as a single entry.
  // Property checks come first: isRankRecord asserts the same type snapshotValue
  // already has, so its false branch would narrow it to `never` and break the
  // later property accesses in the same || chain.
  if (
    typeof snapshotValue.itemId === "number" ||
    typeof snapshotValue.guid === "string" ||
    isRankRecord(snapshotValue)
  ) {
    const el = snapshotValue as Record<string, unknown>;

    return [
      {
        label: rankLabel(el, locale),
        value: rankValue(el, preferredValueKey),
        href: buildEntryHref(el, hrefBase),
      },
    ];
  }

  return Object.entries(snapshotValue)
    .slice(0, limit)
    .map(([key, entryValue]) => {
      if (isRankRecord(entryValue)) {
        const el = entryValue as Record<string, unknown>;

        // Volatility records ({ itemId, stdDev, avgPrice }) arrive as a
        // keyed map after API enrichment, so preformat them here as well.
        if (typeof el.itemId === "number" && typeof el.stdDev === "number") {
          return {
            label: rankLabel(el, locale),
            value: formatPriceVolatility(el.stdDev),
            href: buildEntryHref(el, hrefBase),
          };
        }

        return {
          label: rankLabel(el, locale),
          value: rankValue(el, preferredValueKey),
          href: buildEntryHref(el, hrefBase),
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
 * - "gold":   money value already denominated in gold (backend converts
 *             copper -> gold at ingestion via toGold) -> "1 334 200 g"
 * - "number": count with space grouping (1 000 000)
 * - "age":    day count -> compact calendar duration ("21y 6m 11d")
 */
export type SnapshotValueFormat = "number" | "gold" | "age";

const apostropheNumberFormatter = new Intl.NumberFormat("de-CH", {
  maximumFractionDigits: 0,
});

const goldFractionFormatter = new Intl.NumberFormat("de-CH", {
  maximumFractionDigits: 2,
});

export type GoldFormatted = { amount: string; suffix: "g" };

/**
 * Formats a gold-denominated value with a "g" suffix. Values arrive from the
 * backend already in gold (never copper) — no division is applied.
 */
export const formatGoldValue = (value: number): GoldFormatted => ({
  amount: goldFractionFormatter.format(value).replace(/'/g, " "),
  suffix: "g",
});

/**
 * Formats a count with space-separated thousands (1 000 000), used for
 * non-gold metrics (character/guild/auction counts, price-range tallies, ...).
 */
const formatPlainNumber = (value: number): string =>
  apostropheNumberFormatter.format(value).replace(/'/g, " ");

/**
 * Formats a price-volatility stdDev (in gold) with a sigma prefix, e.g.
 * 893.99 -> "σ 893.99 g". Returns "—" if stdDev is missing or non-finite.
 */
export const formatPriceVolatility = (stdDev: unknown): string => {
  if (typeof stdDev !== "number" || !Number.isFinite(stdDev)) {
    return "—";
  }

  return `σ ${formatGoldValue(stdDev).amount} g`;
};

const DAYS_PER_YEAR = 365.25;
const DAYS_PER_MONTH = 30.44;

/**
 * Breaks a day count into a compact calendar duration, e.g. 7864 ->
 * "21y 6m 11d". Zero parts are skipped (days < 31 -> "11d", < 366 -> "6m 11d").
 */
export const formatAgeDays = (days: number): string => {
  if (!Number.isFinite(days) || days < 0) {
    return "—";
  }

  const wholeDays = Math.floor(days);
  const years = Math.floor(wholeDays / DAYS_PER_YEAR);
  const months = Math.floor(
    (wholeDays - years * DAYS_PER_YEAR) / DAYS_PER_MONTH
  );
  const restDays = Math.round(
    wholeDays - years * DAYS_PER_YEAR - months * DAYS_PER_MONTH
  );

  return (
    [
      years > 0 ? `${years}y` : "",
      months > 0 ? `${months}m` : "",
      restDays > 0 ? `${restDays}d` : "",
    ]
      .filter(Boolean)
      .join(" ") || "0d"
  );
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

    if (valueFormat === "age") {
      return formatAgeDays(value);
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
  const index = PRICE_RANGE_ORDER.indexOf(
    key as (typeof PRICE_RANGE_ORDER)[number]
  );

  return index === -1 ? PRICE_RANGE_ORDER.length : index;
};

/**
 * Canonical low-to-high ordering for guild member-count buckets
 * (membersDistribution `ranges` keys).
 */
export const MEMBERS_RANGE_ORDER = [
  "1-10",
  "11-50",
  "51-100",
  "101-250",
  "251-500",
  "501-750",
  "751-999",
] as const;

/**
 * Returns the rank (0-based) of a member-range bucket key within
 * MEMBERS_RANGE_ORDER. Unknown keys sort last, preserving their relative
 * order.
 */
export const membersRangeRank = (key: string): number => {
  const index = MEMBERS_RANGE_ORDER.indexOf(
    key as (typeof MEMBERS_RANGE_ORDER)[number]
  );

  return index === -1 ? MEMBERS_RANGE_ORDER.length : index;
};

/**
 * Sorts dynamic points-range bucket labels ("0 ⋯ 709", "710 ⋯ 1418", ...)
 * numerically by their lower bound. Legacy fixed keys (under1k, 1k-10k, ...)
 * have no leading digit and fall back to priceRangeRank so old snapshots
 * still render in order.
 */
export const pointsRangeRank = (key: string): number => {
  const match = /^(\d+)/.exec(key);

  return match ? Number(match[1]) : priceRangeRank(key) * 1_000_000;
};

/**
 * Canonical low-to-high ordering for guild age tiers (ageDistribution
 * `ranges` keys, fixed year boundaries set by the backend).
 */
export const AGE_RANGE_ORDER = [
  "under1y",
  "1y-3y",
  "3y-5y",
  "5y-10y",
  "10y-15y",
  "over15y",
] as const;

/**
 * Returns the rank (0-based) of an age-tier bucket key within
 * AGE_RANGE_ORDER. Unknown keys sort last, preserving their relative order.
 */
export const ageRangeRank = (key: string): number => {
  const index = AGE_RANGE_ORDER.indexOf(
    key as (typeof AGE_RANGE_ORDER)[number]
  );

  return index === -1 ? AGE_RANGE_ORDER.length : index;
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
