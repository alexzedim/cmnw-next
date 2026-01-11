"use client";

import type { AppHealthMetricSnapshot } from "@/lib/types";

import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import {
  getSnapshotEntries,
  formatSnapshotDate,
  formatEntryValue,
  buildSnapshotKey,
} from "@/lib/utils/snapshot-formatters";

type MetricSnapshot = {
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
  title: string;
  snapshot: AppHealthMetricSnapshot | null;
};

interface LiveMetricsProps {
  metricSnapshots: MetricSnapshot[];
  metricsStatus: string;
  metricsError: boolean;
  metricSnapshotLoading: boolean;
  metricCardHasError: boolean;
}

/**
 * Live metrics section displaying current metric snapshots.
 * Shows metric cards with snapshot data and status indicators.
 */
export function LiveMetrics({
  metricSnapshots,
  metricsStatus,
  metricsError,
  metricSnapshotLoading,
  metricCardHasError,
}: LiveMetricsProps) {
  return (
    <section className="section section-tight-bottom container mx-auto px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
            Live metrics
          </p>
        </div>
        <span
          aria-label="API Status"
          className={`text-xs font-semibold uppercase tracking-wide ${
            metricsError
              ? "text-red-400"
              : metricsStatus === "online"
                ? "text-emerald-400"
                : metricsStatus === "degraded"
                  ? "text-amber-400"
                  : "text-foreground/60"
          }`}
        >
          {metricsError ? "API offline" : `Status: ${metricsStatus}`}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricSnapshots.map(({ category, title, snapshot, metricType }) => {
          const snapshotDate = formatSnapshotDate(snapshot);
          const entries = getSnapshotEntries(snapshot);

          return (
            <div
              key={buildSnapshotKey(category, metricType)}
              className="card-surface p-6 flex flex-col gap-4"
            >
              <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted mt-2 text-sm">
                  {metricCardHasError
                    ? "Metric feed unavailable."
                    : snapshotDate
                      ? `Snapshot @ ${snapshotDate}`
                      : metricSnapshotLoading
                        ? "Loading snapshot…"
                        : "No snapshot reported yet."}
                </p>
              </div>
              <div className="rounded-xl border border-content4/20 bg-content2/40 p-4 backdrop-blur">
                {entries.length ? (
                  <dl className="space-y-2">
                    {entries.map(([entryKey, entryValue]) => (
                      <div
                        key={entryKey}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <dt className="text-foreground/60">{entryKey}</dt>
                        <dd className="font-mono text-foreground text-right">
                          {formatEntryValue(entryValue)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-muted text-sm">
                    {metricCardHasError
                      ? "Unable to read metric values."
                      : metricSnapshotLoading
                        ? "Loading metric values…"
                        : "Metrics responded without value payload."}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
