"use client";

import type { AnalyticsMetricSnapshotDto } from "@/lib/types";
import type { MetricSnapshotRecord } from "@/lib/types/snapshot-metrics";

import useSWR from "swr";

import { ENDPOINTS } from "@/constants/endpoints";
import { clientFetch } from "@/lib/api/origins";
import { SNAPSHOT_REQUESTS } from "@/constants/snapshot-metrics";
import {
  buildSnapshotKey,
  isPriceVolatilityData,
  toAppHealthSnapshot,
} from "@/lib/utils/snapshot-formatters";

/**
 * Fetches metric snapshots for all configured snapshot requests.
 * Returns a record of snapshots keyed by snapshot key.
 * Throws an error if all requests fail.
 */
const fetchMetricSnapshots = async (): Promise<MetricSnapshotRecord> => {
  const entries = await Promise.all(
    SNAPSHOT_REQUESTS.map(async ({ category, metricType }) => {
      const url = new URL(ENDPOINTS.METRIC_SNAPSHOT_PATH, "http://localhost");
      const key = buildSnapshotKey(category, metricType);

      url.searchParams.set("category", category);
      url.searchParams.set("metricType", metricType);

      // Extract path + query (without origin) for clientFetch.
      const pathWithQuery = `${url.pathname}${url.search}`;

      try {
        const response = await clientFetch(pathWithQuery, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${category}/${metricType} metric snapshot: ${response.status}`
          );
        }

        // Backend returns null (empty body) when no snapshot row exists yet.
        // Treat that as "no snapshot" instead of crashing on JSON.parse("").
        const text = await response.text();

        if (!text) {
          return [key, null] as const;
        }

        const payload = JSON.parse(text) as AnalyticsMetricSnapshotDto;

        const snapshot = isPriceVolatilityData(payload)
          ? toAppHealthSnapshot({
              id: `synthetic-${category}-${metricType}`,
              category,
              metricType,
              realmId: null,
              value: payload,
              snapshotDate: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            })
          : toAppHealthSnapshot(payload);

        return [key, snapshot] as const;
      } catch {
        return [key, null] as const;
      }
    })
  );

  const hasSnapshots = entries.some(([, snapshot]) => Boolean(snapshot));

  if (!hasSnapshots) {
    throw new Error("All metric snapshot requests failed");
  }

  return entries.reduce<MetricSnapshotRecord>((acc, [key, snapshot]) => {
    acc[key] = snapshot;

    return acc;
  }, {} as MetricSnapshotRecord);
};

/**
 * Hook for fetching and caching metric snapshots.
 * Uses SWR for automatic revalidation on reconnect.
 *
 * @returns Object containing metric snapshot data, error, and loading state
 */
export function useMetricSnapshots() {
  const {
    data: metricSnapshotData,
    error: metricSnapshotError,
    isLoading: metricSnapshotLoading,
  } = useSWR<MetricSnapshotRecord>(
    "app-metric-snapshots/expanded",
    fetchMetricSnapshots,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: metricSnapshotData,
    error: metricSnapshotError,
    isLoading: metricSnapshotLoading,
  };
}
