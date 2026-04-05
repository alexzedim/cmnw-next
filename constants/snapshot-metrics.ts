import type {
  SnapshotHighlightGroup,
  SnapshotRequest,
} from "@/lib/types/snapshot-metrics";

import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import { classColors } from "@/constants/class-colors";

/**
 * Metric cards displayed in the live metrics section.
 */
export const METRIC_CARDS = [
  {
    category: AnalyticsMetricCategory.CHARACTERS,
    title: "Characters",
    metricType: AnalyticsMetricType.TOTAL,
  },
  {
    category: AnalyticsMetricCategory.GUILDS,
    title: "Guilds",
    metricType: AnalyticsMetricType.TOTAL,
  },
  {
    category: AnalyticsMetricCategory.MARKET,
    title: "Market",
    metricType: AnalyticsMetricType.TOTAL,
  },
] as const;

/**
 * Snapshot highlight groups displayed in the snapshot briefs section.
 */
export const SNAPSHOT_HIGHLIGHT_GROUPS: readonly SnapshotHighlightGroup[] = [
  {
    title: "Characters @ cap",
    disclaimer:
      "It only tracks fully ingested max-level characters captured during the latest sync window.",
    metrics: [
      {
        label: "Faction split",
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.BY_FACTION_MAX_LEVEL,
      },
      {
        label: "Class mix",
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.BY_CLASS_MAX_LEVEL,
        valueLimit: Number.POSITIVE_INFINITY,
        sort: "alpha",
        getEntryColor: (className: string) =>
          classColors.get(className) ?? undefined,
      },
      {
        label: "Level bracket",
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.BY_LEVEL_MAX_LEVEL,
      },
    ] as const,
  },
  {
    title: "Guild structures",
    disclaimer:
      "Roster slices only include guilds with verified activity in the past 48 hours.",
    metrics: [
      {
        label: "Size distribution",
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.SIZE_DISTRIBUTION,
      },
      {
        label: "Top by members",
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.TOP_BY_MEMBERS,
      },
      {
        label: "Top by achievements",
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.TOP_BY_ACHIEVEMENTS,
      },
    ] as const,
  },
  {
    title: "Market flow",
    disclaimer:
      "Commodity spans show only markets with validated quotes and auctions.",
    metrics: [
      {
        label: "Price ranges",
        category: AnalyticsMetricCategory.MARKET,
        metricType: AnalyticsMetricType.PRICE_RANGES,
      },
      {
        label: "Top by volume",
        category: AnalyticsMetricCategory.MARKET,
        metricType: AnalyticsMetricType.TOP_BY_VOLUME,
      },
      {
        label: "Price volatility",
        category: AnalyticsMetricCategory.MARKET,
        metricType: AnalyticsMetricType.PRICE_VOLATILITY,
      },
    ] as const,
  },
  {
    title: "Contracts board",
    disclaimer:
      "Contract stats focus on max-duration instruments with verifiable liquidity.",
    metrics: [
      {
        label: "Open interest leaders",
        category: AnalyticsMetricCategory.CONTRACTS,
        metricType: AnalyticsMetricType.TOP_BY_OPEN_INTEREST,
      },
      {
        label: "Quantity concentration",
        category: AnalyticsMetricCategory.CONTRACTS,
        metricType: AnalyticsMetricType.TOP_BY_QUANTITY,
      },
      {
        label: "Auction throughput",
        category: AnalyticsMetricCategory.CONTRACTS,
        metricType: AnalyticsMetricType.TOP_BY_AUCTIONS,
      },
    ] as const,
  },
] as const;

/**
 * All snapshot requests needed for the page.
 * Combines metric cards and snapshot highlight group metrics.
 */
export const SNAPSHOT_REQUESTS: SnapshotRequest[] = [
  ...METRIC_CARDS.map(({ category, metricType }) => ({
    category,
    metricType,
  })),
  ...SNAPSHOT_HIGHLIGHT_GROUPS.flatMap((group) => group.metrics),
];
