/**
 * Item Components - Shared Constants
 *
 * This module contains shared constants, types, and utility functions
 * used across item-related components (ItemQuotes, ItemValuations, ItemListing).
 */

/**
 * Locale settings for number and date formatting
 */
export const LOCALE = "ru-RU";

/**
 * Swiss locale uses apostrophe as the thousands separator (1'000'000),
 * which we post-process into either spaces or keep as-is depending on the
 * metric being rendered. Kept as a shared instance to avoid per-call allocation.
 */
const apostropheNumberFormatter = new Intl.NumberFormat("de-CH", {
  maximumFractionDigits: 0,
});

/**
 * Table styling classes used across item components
 */
export const TABLE_CLASS_NAMES = {
  wrapper: "p-0",
  th: "py-3 bg-background border-b border-divider text-foreground font-semibold",
  td: "text-muted border-b border-divider",
} as const;

/**
 * Card and container styling constants
 */
export const CARD_CLASS_NAMES = {
  root: "m-4 bg-background border border-divider",
  body: "pt-8 px-0 pb-0 rounded-xl bg-background",
  loading: "flex items-center justify-center min-h-[300px]",
} as const;

/**
 * Badge section color variants
 */
export const BADGE_COLORS = {
  DEFAULT: "bg-[var(--primary)]",
  QUOTES: "bg-[var(--primary)]",
  VALUATIONS: "bg-amber-500",
  LISTINGS: "bg-green-500",
} as const;

/**
 * Format a number using locale-specific formatting
 * @param value - Number to format
 * @param locale - Locale string (default: ru-RU)
 * @returns Formatted number string
 */
export const formatNumber = (
  value?: number | null,
  locale = LOCALE
): string => {
  if (value === null || value === undefined) return "-";

  return value.toLocaleString(locale);
};

/**
 * Formats a count with regular spaces between each thousand group
 * (e.g. `1 234 567`). Used for plain quantity columns where apostrophe
 * grouping would feel too "money-like".
 */
export const formatQuantity = (value?: number | null): string => {
  if (value === null || value === undefined) return "-";

  return apostropheNumberFormatter.format(value).replace(/'/g, " ");
};

/**
 * Formats an Open Interest value (already in gold) as a gold/silver
 * breakdown with apostrophe thousands grouping, e.g. `14'000 g 00 s`.
 *
 * - Whole part is apostrophe-grouped gold.
 * - Fractional part (0.01 g = 1 s) becomes a two-digit silver component.
 *
 * Note: `openInterest` from `/api/dma/item/quotes` is denominated in gold,
 * not copper — see `market-heatmap.tsx` where `price = oi / quantity`.
 */
export const formatOpenInterest = (value?: number | null): string => {
  if (value === null || value === undefined) return "-";

  const gold = Math.floor(value);
  const silver = Math.floor((value - gold) * 100);

  const goldStr = apostropheNumberFormatter.format(gold);
  const silverStr = silver.toString().padStart(2, "0");

  return `${goldStr} g ${silverStr} s`;
};

/**
 * Format a date string or timestamp using locale-specific formatting
 * @param date - Date string or timestamp to format
 * @param format - Date format options
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | number,
  format: "date" | "datetime" = "datetime"
): string => {
  const dateObj = new Date(date);

  if (format === "date") {
    return dateObj.toLocaleDateString("en-GB");
  }

  return dateObj.toLocaleString("en-GB");
};
