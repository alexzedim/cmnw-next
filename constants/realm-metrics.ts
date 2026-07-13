import type { Realm } from "@/lib/types";
import type { SnapshotValueFormat } from "@/lib/utils/snapshot-formatters";

import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";

/**
 * Which realm field to use as the `realmId` query parameter for analytics.
 *
 * Character and guild analytics key on the realm `id` (e.g. 506 for Draenor),
 * while market and contract analytics key on the `connectedRealmId` (e.g. 1403)
 * because the auction house is shared across a connected-realm group.
 */
export type RealmMetricKey = "id" | "connectedRealmId";

export type RealmMetricRequest = {
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
  realmKey: RealmMetricKey;
};

export type RealmMetricConfig = RealmMetricRequest & {
  labelKey: string;
  valueFormat?: SnapshotValueFormat;
  valueLimit?: number;
};

export type RealmMetricGroup = {
  titleKey: string;
  metrics: readonly RealmMetricConfig[];
};

/**
 * Snapshot groups rendered on the realm detail page.
 *
 * Each metric declares its realmKey so the fetcher passes the correct id to the
 * snapshot endpoint — `realm.id` for characters/guilds, `realm.connectedRealmId`
 * for market/contracts.
 */
export const REALM_METRIC_GROUPS: readonly RealmMetricGroup[] = [
  {
    titleKey: "demographics" as const,
    metrics: [
      {
        category: AnalyticsMetricCategory.CHARACTERS,
        labelKey: "totalCharacters" as const,
        metricType: AnalyticsMetricType.TOTAL,
        realmKey: "id",
      },
      {
        category: AnalyticsMetricCategory.CHARACTERS,
        labelKey: "factionSplit" as const,
        metricType: AnalyticsMetricType.BY_FACTION,
        realmKey: "id",
      },
      {
        category: AnalyticsMetricCategory.CHARACTERS,
        labelKey: "classMix" as const,
        metricType: AnalyticsMetricType.BY_CLASS,
        realmKey: "id",
      },
      {
        category: AnalyticsMetricCategory.CHARACTERS,
        labelKey: "classMixAtCap" as const,
        metricType: AnalyticsMetricType.BY_CLASS_MAX_LEVEL,
        realmKey: "id",
      },
    ] as const,
  },
  {
    titleKey: "guildEcosystem" as const,
    metrics: [
      {
        category: AnalyticsMetricCategory.GUILDS,
        labelKey: "guildTotals" as const,
        metricType: AnalyticsMetricType.TOTAL,
        realmKey: "id",
      },
      {
        category: AnalyticsMetricCategory.GUILDS,
        labelKey: "guildFactionSplit" as const,
        metricType: AnalyticsMetricType.BY_FACTION,
        realmKey: "id",
      },
    ] as const,
  },
  {
    titleKey: "marketPulse" as const,
    metrics: [
      {
        category: AnalyticsMetricCategory.MARKET,
        labelKey: "connectedRealmMarket" as const,
        metricType: AnalyticsMetricType.BY_CONNECTED_REALM,
        realmKey: "connectedRealmId",
        valueFormat: "gold",
      },
    ] as const,
  },
];

/**
 * Trend charts driven by the history endpoint. Each entry extracts a single
 * numeric field from each historical snapshot value for plotting over time.
 */
export type RealmTrendConfig = RealmMetricRequest & {
  titleKey: string;
  dataKey: string;
  valueFormat: SnapshotValueFormat;
};

export const REALM_TRENDS: readonly RealmTrendConfig[] = [
  {
    category: AnalyticsMetricCategory.CHARACTERS,
    dataKey: "count",
    metricType: AnalyticsMetricType.TOTAL,
    realmKey: "id",
    titleKey: "populationTrend" as const,
    valueFormat: "number",
  },
  {
    category: AnalyticsMetricCategory.MARKET,
    dataKey: "volume",
    metricType: AnalyticsMetricType.BY_CONNECTED_REALM,
    realmKey: "connectedRealmId",
    titleKey: "marketVolumeTrend" as const,
    valueFormat: "gold",
  },
];

/**
 * All snapshot requests flattened for batch fetching.
 */
export const REALM_SNAPSHOT_REQUESTS: readonly RealmMetricRequest[] =
  REALM_METRIC_GROUPS.flatMap((group) => group.metrics);

/**
 * Resolves the realmId to pass to the snapshot/history endpoint for a given
 * metric, based on its `realmKey`.
 */
export const resolveRealmId = (
  realm: Realm,
  realmKey: RealmMetricKey
): number => realm[realmKey];
