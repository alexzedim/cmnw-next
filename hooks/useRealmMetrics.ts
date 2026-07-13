"use client";

import type {
  AnalyticsMetricHistoryEntry,
  AnalyticsMetricSnapshotDto,
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
