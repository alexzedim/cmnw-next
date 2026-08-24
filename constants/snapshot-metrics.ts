import type {
  SnapshotHighlightGroup,
  SnapshotRequest,
} from "@/lib/types/snapshot-metrics";

import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import { classColors } from "@/constants/class-colors";

export const METRIC_CARDS = [
  {
    category: AnalyticsMetricCategory.CHARACTERS,
    titleKey: "charactersTitle" as const,
    metricType: AnalyticsMetricType.TOTAL,
  },
  {
    category: AnalyticsMetricCategory.GUILDS,
    titleKey: "guildsTitle" as const,
    metricType: AnalyticsMetricType.TOTAL,
  },
  {
    category: AnalyticsMetricCategory.MARKET,
    titleKey: "marketTitle" as const,
    metricType: AnalyticsMetricType.TOTAL,
  },
] as const;

export const SNAPSHOT_HIGHLIGHT_GROUPS: readonly SnapshotHighlightGroup[] = [
  {
    titleKey: "charactersAtCap" as const,
    disclaimerKey: "charactersDisclaimer" as const,
    metrics: [
      {
        labelKey: "factionSplit" as const,
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.BY_FACTION_MAX_LEVEL,
      },
      {
        labelKey: "classMix" as const,
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.BY_CLASS_MAX_LEVEL,
        valueLimit: Number.POSITIVE_INFINITY,
        sort: "alpha",
        getEntryColor: (className: string) =>
          classColors.get(className) ?? undefined,
      },
      {
        labelKey: "levelBracket" as const,
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.BY_LEVEL_MAX_LEVEL,
      },
      {
        labelKey: "achievementsDistribution" as const,
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.ACHIEVEMENTS_DISTRIBUTION,
        valueLimit: Number.POSITIVE_INFINITY,
        sort: "pointsRange",
        labelSuffix: "⛨",
      },
      {
        labelKey: "oldestCharacters" as const,
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.TOP_BY_AGE,
        valueFormat: "age",
        valueLimit: 1,
        entryHrefBase: "/character",
      },
    ] as const,
  },
  {
    titleKey: "guildStructures" as const,
    disclaimerKey: "guildDisclaimer" as const,
    metrics: [
      {
        labelKey: "membersDistribution" as const,
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.MEMBERS_DISTRIBUTION,
        valueLimit: Number.POSITIVE_INFINITY,
        sort: "memberRange",
      },
      {
        labelKey: "achievementsDistribution" as const,
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.ACHIEVEMENTS_DISTRIBUTION,
        valueLimit: Number.POSITIVE_INFINITY,
        sort: "pointsRange",
        labelSuffix: "⛨",
      },
      {
        labelKey: "ageDistribution" as const,
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.AGE_DISTRIBUTION,
        valueLimit: Number.POSITIVE_INFINITY,
        sort: "ageRange",
      },
      {
        labelKey: "topByAge" as const,
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.TOP_BY_AGE,
        valueFormat: "age",
        valueLimit: 1,
      },
      {
        labelKey: "topByAchievements" as const,
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.TOP_BY_ACHIEVEMENTS,
        valueLimit: 1,
      },
    ] as const,
  },
  {
    titleKey: "marketFlow" as const,
    disclaimerKey: "marketDisclaimer" as const,
    metrics: [
      {
        labelKey: "priceRanges" as const,
        category: AnalyticsMetricCategory.MARKET,
        metricType: AnalyticsMetricType.PRICE_RANGES,
        valueLimit: Number.POSITIVE_INFINITY,
        sort: "priceRange",
      },
      {
        labelKey: "topByVolume" as const,
        category: AnalyticsMetricCategory.MARKET,
        metricType: AnalyticsMetricType.TOP_BY_VOLUME,
        valueFormat: "gold",
      },
      {
        labelKey: "topByAuctions" as const,
        category: AnalyticsMetricCategory.MARKET,
        metricType: AnalyticsMetricType.TOP_BY_AUCTIONS,
      },
    ] as const,
  },
  {
    titleKey: "contractsBoard" as const,
    disclaimerKey: "contractsDisclaimer" as const,
    metrics: [
      {
        labelKey: "openInterestLeaders" as const,
        category: AnalyticsMetricCategory.CONTRACTS,
        metricType: AnalyticsMetricType.TOP_BY_OPEN_INTEREST,
        valueFormat: "gold",
        valueKey: "maxOpenInterest",
        valueLimit: 1,
      },
      {
        labelKey: "quantityConcentration" as const,
        category: AnalyticsMetricCategory.CONTRACTS,
        metricType: AnalyticsMetricType.TOP_BY_QUANTITY,
        valueKey: "maxQuantity",
        valueLimit: 1,
      },
      {
        labelKey: "priceVolatility" as const,
        category: AnalyticsMetricCategory.CONTRACTS,
        metricType: AnalyticsMetricType.PRICE_VOLATILITY,
      },
    ] as const,
  },
] as const;

export const SNAPSHOT_REQUESTS: SnapshotRequest[] = [
  ...METRIC_CARDS.map(({ category, metricType }) => ({
    category,
    metricType,
  })),
  ...SNAPSHOT_HIGHLIGHT_GROUPS.flatMap((group) => group.metrics),
];
