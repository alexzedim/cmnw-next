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
 * Common column definitions for item-related tables
 */
export const ITEM_TABLE_COLUMNS = {
  QUOTES: [
    { key: "price" as const, label: "Price" },
    { key: "quantity" as const, label: "Quantity" },
    { key: "open_interest" as const, label: "Open Interest" },
  ],
} as const;

/**
 * Table styling classes used across item components
 */
export const TABLE_CLASS_NAMES = {
  wrapper: "p-0",
  th: "bg-background border-b border-divider text-foreground font-semibold",
  td: "text-muted border-b border-divider",
} as const;

/**
 * Card and container styling constants
 */
export const CARD_CLASS_NAMES = {
  root: "m-4 bg-background border border-divider",
  body: "p-8 rounded-xl bg-background",
  loading: "flex items-center justify-center min-h-[300px]",
} as const;

/**
 * Badge section color variants
 */
export const BADGE_COLORS = {
  DEFAULT: "bg-orange-500",
  QUOTES: "bg-cyan-500",
  VALUATIONS: "bg-amber-500",
  LISTINGS: "bg-green-500",
} as const;

/**
 * Format a number using locale-specific formatting
 * @param value - Number to format
 * @param locale - Locale string (default: ru-RU)
 * @returns Formatted number string
 */
export const formatNumber = (value: number, locale = LOCALE): string => {
  return value.toLocaleString(locale);
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
