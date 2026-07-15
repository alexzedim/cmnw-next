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
import type {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import type { RealmMetricKey } from "@/constants/realm-metrics";

import useSWR from "swr";

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
  hofGuildCount: number;
  raidLogsIndexed: number;
  raidLogsTotal: number;
}

export type RealmDensityMap = Map<number, RealmDensity>;

const EMPTY_DENSITY: RealmDensity = {
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
 * Fetches Hall of Fame guild count and raid-log indexing stats for every realm
 * in the list, batched at bounded concurrency. SWR-cached as one logical fetch
 * keyed on the sorted realm-id list.
 *
 * Realms without a Hall of Fame snapshot (no HoF presence) resolve to
 * `{ hofGuildCount: 0 }` and the raid-log stats default to zeros on failure.
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

          const [hofRes, raidRes] = await Promise.allSettled([
            clientFetch(`${hofUrl.pathname}${hofUrl.search}`, {
              cache: "no-store",
              headers: { Accept: "application/json" },
            }),
            clientFetch(`${raidUrl.pathname}${raidUrl.search}`, {
              cache: "no-store",
              headers: { Accept: "application/json" },
            }),
          ]);

          let hofGuildCount = 0;

          if (hofRes.status === "fulfilled" && hofRes.value.ok) {
            const payload = (await hofRes.value.json().catch(() => null)) as {
              value?: Record<string, unknown>;
            } | null;

            const guildCount = payload?.value?.guildCount;

            hofGuildCount = typeof guildCount === "number" ? guildCount : 0;
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
            { hofGuildCount, raidLogsIndexed, raidLogsTotal },
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
