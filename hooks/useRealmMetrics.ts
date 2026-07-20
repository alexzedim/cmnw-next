"use client";

import type {
  AnalyticsMetricHistoryEntry,
  AnalyticsMetricSnapshotDto,
  RaidLogsStats,
  Realm,
} from "@/lib/types";
import type {
  MetricSnapshotRecord,
  SnapshotKey,
} from "@/lib/types/snapshot-metrics";
import type { RealmMetricKey } from "@/constants/realm-metrics";

import useSWR from "swr";

import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import { ENDPOINTS } from "@/constants/endpoints";
import { clientFetch } from "@/lib/api/origins";
import {
  REALM_SNAPSHOT_REQUESTS,
  resolveRealmId,
} from "@/constants/realm-metrics";
import {
  buildSnapshotKey,
  toAppHealthSnapshot,
} from "@/lib/utils/snapshot-formatters";

/**
 * Fetches latest metric snapshots for all configured realm metrics in parallel.
 *
 * Each metric uses its own `realmKey` to resolve the correct id — realm.id for
 * characters/guilds, realm.connectedRealmId for market/contracts.
 */
const fetchRealmSnapshots = async (
  realm: Realm
): Promise<MetricSnapshotRecord> => {
  const entries = await Promise.all(
    REALM_SNAPSHOT_REQUESTS.map(async ({ category, metricType, realmKey }) => {
      const url = new URL(ENDPOINTS.METRIC_SNAPSHOT_PATH, "http://localhost");
      const key = buildSnapshotKey(
        category as AnalyticsMetricCategory,
        metricType as AnalyticsMetricType
      );

      url.searchParams.set("category", category);
      url.searchParams.set("metricType", metricType);
      url.searchParams.set("realmId", String(resolveRealmId(realm, realmKey)));

      const pathWithQuery = `${url.pathname}${url.search}`;

      try {
        const response = await clientFetch(pathWithQuery, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          return [key, null] as const;
        }

        const text = await response.text();

        if (!text) {
          return [key, null] as const;
        }

        const payload = JSON.parse(text) as AnalyticsMetricSnapshotDto;
        const snapshot = toAppHealthSnapshot(payload);

        return [key, snapshot] as const;
      } catch {
        return [key, null] as const;
      }
    })
  );

  return entries.reduce((acc, [key, snapshot]) => {
    acc[key as SnapshotKey] = snapshot;

    return acc;
  }, {} as MetricSnapshotRecord);
};

/**
 * SWR hook returning the latest realm metric snapshots keyed by snapshot key.
 * Pass `null` to disable (e.g. while the realm is loading).
 */
export function useRealmSnapshots(realm: Realm | null) {
  const { data, error, isLoading } = useSWR<MetricSnapshotRecord>(
    realm ? ["realm-metric-snapshots", realm.id, realm.connectedRealmId] : null,
    () => fetchRealmSnapshots(realm as Realm),
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  );

  return { data, error, isLoading };
}

const REGION_COMMODITIES_REALM_ID = 1;

/**
 * Fetches the region-wide unique commodity count from the synthetic
 * region realm (realmId = 1), where Blizzard emits all COMMDTY auction-house
 * rows. Commodities are region-wide, so this value is shared across every
 * realm in the region and rendered as a constant per-realm "useful hack" on
 * the realm market pulse card.
 *
 * Returns `null` while loading or when the region snapshot is unavailable.
 */
export function useRegionCommoditiesCount() {
  const { data, error, isLoading } = useSWR<number>(
    "region-commodities-count",
    async () => {
      const url = new URL(ENDPOINTS.METRIC_SNAPSHOT_PATH, "http://localhost");

      url.searchParams.set("category", AnalyticsMetricCategory.MARKET);
      url.searchParams.set(
        "metricType",
        AnalyticsMetricType.BY_CONNECTED_REALM
      );
      url.searchParams.set("realmId", String(REGION_COMMODITIES_REALM_ID));

      const pathWithQuery = `${url.pathname}${url.search}`;

      try {
        const response = await clientFetch(pathWithQuery, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) return 0;

        const text = await response.text();

        if (!text) return 0;

        const payload = JSON.parse(text) as AnalyticsMetricSnapshotDto;
        const snapshot = toAppHealthSnapshot(payload);
        const value = snapshot.value as Record<string, unknown>;
        const count = value.uniqueItemsCommdty;

        return typeof count === "number" ? count : 0;
      } catch {
        return 0;
      }
    },
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  );

  return {
    data: typeof data === "number" ? data : null,
    error,
    isLoading,
  };
}

const buildHistoryPath = (
  category: AnalyticsMetricCategory,
  metricType: AnalyticsMetricType,
  realmId: number,
  days: number
) => {
  const url = new URL(ENDPOINTS.METRIC_HISTORY_PATH, "http://localhost");
  const fromDate = new Date();

  fromDate.setDate(fromDate.getDate() - days);

  url.searchParams.set("category", category);
  url.searchParams.set("metricType", metricType);
  url.searchParams.set("realmId", String(realmId));
  url.searchParams.set("fromDate", fromDate.toISOString().slice(0, 10));

  return `${url.pathname}${url.search}`;
};

/**
 * Fetches metric history for a single category/metricType over the last `days`
 * days. Returns AnalyticsMetricHistoryEntry[] ordered oldest→newest (as the
 * backend returns them), or an empty array on failure.
 */
export function useRealmHistory(
  category: AnalyticsMetricCategory,
  metricType: AnalyticsMetricType,
  realmKey: RealmMetricKey,
  realm: Realm | null,
  days = 30
) {
  const realmId = realm ? resolveRealmId(realm, realmKey) : null;

  const { data, error, isLoading } = useSWR<AnalyticsMetricHistoryEntry[]>(
    realmId
      ? ["realm-metric-history", category, metricType, realmId, days]
      : null,
    async () => {
      if (!realmId) return [];

      const path = buildHistoryPath(category, metricType, realmId, days);

      try {
        const response = await clientFetch(path, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) return [];

        return (await response.json()) as AnalyticsMetricHistoryEntry[];
      } catch {
        return [];
      }
    }
  );

  return { data: data ?? [], error, isLoading };
}

const EMPTY_RAID_LOGS_STATS: RaidLogsStats = {
  indexed: 0,
  notIndexed: 0,
  realmSlug: null,
  total: 0,
};

/**
 * Fetches indexed/not-indexed/total raid log counts for a single realm.
 * Returns zeros on failure. Pass `null` to disable (e.g. while loading).
 */
export function useRaidLogsStats(realm: Realm | null) {
  const slug = realm?.slug ?? null;

  const { data, error, isLoading } = useSWR<RaidLogsStats>(
    slug ? ["realm-raid-logs-stats", slug] : null,
    async () => {
      if (!slug) return EMPTY_RAID_LOGS_STATS;

      const url = new URL(ENDPOINTS.RAID_LOGS_STATS_PATH, "http://localhost");

      url.searchParams.set("realmSlug", slug);
      const pathWithQuery = `${url.pathname}${url.search}`;

      try {
        const response = await clientFetch(pathWithQuery, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) return EMPTY_RAID_LOGS_STATS;

        const text = await response.text();

        if (!text) return EMPTY_RAID_LOGS_STATS;

        return JSON.parse(text) as RaidLogsStats;
      } catch {
        return EMPTY_RAID_LOGS_STATS;
      }
    },
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  );

  return {
    data: data ?? EMPTY_RAID_LOGS_STATS,
    error,
    isLoading,
  };
}

export interface RealmDensity {
  /**
   * Real character population from the CHARACTERS/TOTAL snapshot, keyed on
   * realm.id. `null` while loading or when no snapshot is available.
   */
  characterCount: number | null;
  /**
   * Unique players population (distinct hash_a values) from the
   * CHARACTERS/UNIQUE_PLAYERS snapshot, keyed on realm.id. `null` while
   * loading or when no snapshot is available.
   */
  uniquePlayersCount: number | null;
  /**
   * Total guild count from the GUILDS/TOTAL snapshot, keyed on realm.id.
   * `null` while loading or when no snapshot is available.
   */
  guildCount: number | null;
  hofGuildCount: number;
  raidLogsIndexed: number;
  raidLogsTotal: number;
}

export type RealmDensityMap = Map<number, RealmDensity>;

const EMPTY_DENSITY: RealmDensity = {
  characterCount: null,
  uniquePlayersCount: null,
  guildCount: null,
  hofGuildCount: 0,
  raidLogsIndexed: 0,
  raidLogsTotal: 0,
};

const DENSITY_CONCURRENCY = 8;

/**
 * Runs async tasks with a bounded concurrency limit so we don't fire hundreds
 * of simultaneous requests when the realm index lists all EU realms.
 */
const runWithConcurrency = async <T>(
  tasks: ReadonlyArray<() => Promise<T>>,
  limit: number
): Promise<T[]> => {
  const results: T[] = new Array(tasks.length);
  let cursor = 0;

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    async () => {
      while (cursor < tasks.length) {
        const index = cursor++;

        results[index] = await tasks[index]();
      }
    }
  );

  await Promise.all(workers);

  return results;
};

/**
 * Fetches character population, unique account population, guild count, Hall of
 * Fame guild count, and raid-log indexing stats for every realm in the list,
 * batched at bounded concurrency. SWR-cached as one logical fetch keyed on the
 * sorted realm-id list.
 *
 * Realms without a snapshot resolve `characterCount`/`uniquePlayersCount`/
 * `guildCount` to their empty values and the raid-log stats default to zeros
 * on failure.
 */
export function useRealmsDensity(realms: ReadonlyArray<Realm>) {
  const key = realms
    .map((r) => r.id)
    .sort((a, b) => a - b)
    .join(",");

  const { data, error, isLoading } = useSWR<RealmDensityMap>(
    realms.length ? ["realms-density", key] : null,
    async () => {
      const tasks = realms.map(
        (realm) => async (): Promise<[number, RealmDensity]> => {
          const realmId = realm.id;

          // Character population snapshot — keyed on realm.id.
          const populationUrl = new URL(
            ENDPOINTS.METRIC_SNAPSHOT_PATH,
            "http://localhost"
          );

          populationUrl.searchParams.set(
            "category",
            AnalyticsMetricCategory.CHARACTERS
          );
          populationUrl.searchParams.set(
            "metricType",
            AnalyticsMetricType.TOTAL
          );
          populationUrl.searchParams.set("realmId", String(realmId));

          // Unique account population snapshot (distinct hash_a) — keyed on
          // realm.id.
          const uniquePopulationUrl = new URL(
            ENDPOINTS.METRIC_SNAPSHOT_PATH,
            "http://localhost"
          );

          uniquePopulationUrl.searchParams.set(
            "category",
            AnalyticsMetricCategory.CHARACTERS
          );
          uniquePopulationUrl.searchParams.set(
            "metricType",
            AnalyticsMetricType.UNIQUE_PLAYERS
          );
          uniquePopulationUrl.searchParams.set("realmId", String(realmId));

          // Guild totals snapshot — keyed on realm.id.
          const guildsUrl = new URL(
            ENDPOINTS.METRIC_SNAPSHOT_PATH,
            "http://localhost"
          );

          guildsUrl.searchParams.set(
            "category",
            AnalyticsMetricCategory.GUILDS
          );
          guildsUrl.searchParams.set("metricType", AnalyticsMetricType.TOTAL);
          guildsUrl.searchParams.set("realmId", String(realmId));

          // Hall of Fame snapshot — keyed on realm.id.
          const hofUrl = new URL(
            ENDPOINTS.METRIC_SNAPSHOT_PATH,
            "http://localhost"
          );

          hofUrl.searchParams.set("category", "hallOfFame");
          hofUrl.searchParams.set("metricType", "total");
          hofUrl.searchParams.set("realmId", String(realmId));

          // Raid logs stats — keyed on realm.slug.
          const raidUrl = new URL(
            ENDPOINTS.RAID_LOGS_STATS_PATH,
            "http://localhost"
          );

          raidUrl.searchParams.set("realmSlug", realm.slug);

          const [
            populationRes,
            uniquePopulationRes,
            guildsRes,
            hofRes,
            raidRes,
          ] = await Promise.allSettled([
            clientFetch(`${populationUrl.pathname}${populationUrl.search}`, {
              cache: "no-store",
              headers: { Accept: "application/json" },
            }),
            clientFetch(
              `${uniquePopulationUrl.pathname}${uniquePopulationUrl.search}`,
              {
                cache: "no-store",
                headers: { Accept: "application/json" },
              }
            ),
            clientFetch(`${guildsUrl.pathname}${guildsUrl.search}`, {
              cache: "no-store",
              headers: { Accept: "application/json" },
            }),
            clientFetch(`${hofUrl.pathname}${hofUrl.search}`, {
              cache: "no-store",
              headers: { Accept: "application/json" },
            }),
            clientFetch(`${raidUrl.pathname}${raidUrl.search}`, {
              cache: "no-store",
              headers: { Accept: "application/json" },
            }),
          ]);

          let characterCount: number | null = null;

          if (populationRes.status === "fulfilled" && populationRes.value.ok) {
            const payload = (await populationRes.value
              .json()
              .catch(() => null)) as {
              value?: Record<string, unknown>;
            } | null;

            const count = payload?.value?.count;

            characterCount = typeof count === "number" ? count : null;
          }

          let uniquePlayersCount: number | null = null;

          if (
            uniquePopulationRes.status === "fulfilled" &&
            uniquePopulationRes.value.ok
          ) {
            const payload = (await uniquePopulationRes.value
              .json()
              .catch(() => null)) as {
              value?: Record<string, unknown>;
            } | null;

            const count = payload?.value?.count;

            uniquePlayersCount = typeof count === "number" ? count : null;
          }

          let guildCount: number | null = null;

          if (guildsRes.status === "fulfilled" && guildsRes.value.ok) {
            const payload = (await guildsRes.value
              .json()
              .catch(() => null)) as {
              value?: Record<string, unknown>;
            } | null;

            const count = payload?.value?.count;

            guildCount = typeof count === "number" ? count : null;
          }

          let hofGuildCount = 0;

          if (hofRes.status === "fulfilled" && hofRes.value.ok) {
            const payload = (await hofRes.value.json().catch(() => null)) as {
              value?: Record<string, unknown>;
            } | null;

            const count = payload?.value?.guildCount;

            hofGuildCount = typeof count === "number" ? count : 0;
          }

          let raidLogsIndexed = 0;
          let raidLogsTotal = 0;

          if (raidRes.status === "fulfilled" && raidRes.value.ok) {
            const stats = (await raidRes.value
              .json()
              .catch(() => null)) as RaidLogsStats | null;

            raidLogsIndexed = stats?.indexed ?? 0;
            raidLogsTotal = stats?.total ?? 0;
          }

          return [
            realmId,
            {
              characterCount,
              uniquePlayersCount,
              guildCount,
              hofGuildCount,
              raidLogsIndexed,
              raidLogsTotal,
            },
          ] as [number, RealmDensity];
        }
      );

      const entries = await runWithConcurrency(tasks, DENSITY_CONCURRENCY);

      return new Map<number, RealmDensity>(entries);
    },
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  );

  return { data: data ?? new Map<number, RealmDensity>(), error, isLoading };
}

export { EMPTY_DENSITY };
