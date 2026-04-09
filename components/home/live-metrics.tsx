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
import { useI18n } from "@/lib/i18n/context";

type MetricSnapshot = {
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
  titleKey: string;
  snapshot: AppHealthMetricSnapshot | null;
};

interface LiveMetricsProps {
  metricSnapshots: MetricSnapshot[];
  metricsStatus: string;
  metricsError: boolean;
  metricSnapshotLoading: boolean;
  metricCardHasError: boolean;
}

export function LiveMetrics({
  metricSnapshots,
  metricsStatus,
  metricsError,
  metricSnapshotLoading,
  metricCardHasError,
}: LiveMetricsProps) {
  const { dict } = useI18n();
  const lm = dict.liveMetrics;

  return (
    <section className="section section-tight-bottom container mx-auto px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
            {lm.label}
          </p>
        </div>
        <span
          aria-label={lm.apiStatusAriaLabel}
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
          {metricsError
            ? lm.apiOffline
            : lm.status.replace("{status}", metricsStatus)}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricSnapshots.map(
          ({ category, titleKey, snapshot, metricType }, index) => {
            const snapshotDate = formatSnapshotDate(snapshot);
            const entries = getSnapshotEntries(snapshot);
            const title =
              dict.snapshotMetrics[
                titleKey as keyof typeof dict.snapshotMetrics
              ];

            return (
              <div
                key={buildSnapshotKey(category, metricType)}
                className="card-surface p-6 flex flex-col gap-4 border-l-4 transition-colors duration-200 border-l-[var(--border-accent)]"
              >
                <div>
                  <h3 className="text-xl font-semibold text-[var(--primary)]">
                    {title}
                  </h3>
                  <p className="text-muted mt-2 text-sm">
                    {metricCardHasError
                      ? lm.feedUnavailable
                      : snapshotDate
                        ? lm.snapshotAt.replace("{date}", snapshotDate)
                        : metricSnapshotLoading
                          ? lm.loadingSnapshot
                          : lm.noSnapshot}
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
                        ? lm.unableToRead
                        : metricSnapshotLoading
                          ? lm.loadingValues
                          : lm.noPayload}
                    </p>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}
