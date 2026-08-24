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
import { fontJetBrains } from "@/config/fonts";
import { GoldValue } from "@/components/home/gold-value";

const GOLD_ENTRY_KEYS = new Set(["volume", "openInterest"]);

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
  const { dict, locale } = useI18n();
  const lm = dict.liveMetrics;
  const sm = dict.snapshotMetrics;

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
            const entries = getSnapshotEntries(snapshot, 4, locale);
            const title: string =
              {
                charactersTitle: lm.charactersTitle,
                guildsTitle: lm.guildsTitle,
                marketTitle: lm.marketTitle,
              }[titleKey] ??
              (dict.snapshotMetrics[
                titleKey as keyof typeof dict.snapshotMetrics
              ] as string);

            return (
              <div
                key={buildSnapshotKey(category, metricType)}
                className="card-surface p-6 flex flex-col gap-4 border-l-4 transition-colors duration-200 border-l-[var(--border-accent)]"
              >
                <div>
                  <h3
                    className="text-xl font-semibold text-[var(--primary)]"
                    style={{ fontFamily: fontJetBrains.style.fontFamily }}
                  >
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
                          <dt className="text-foreground/60">
                            {sm.metricEntries?.[
                              entryKey as keyof typeof sm.metricEntries
                            ] ?? entryKey}
                          </dt>
                          <dd className="font-mono text-foreground text-right">
                            {GOLD_ENTRY_KEYS.has(entryKey) &&
                            typeof entryValue === "number" ? (
                              <GoldValue copper={entryValue} />
                            ) : (
                              formatEntryValue(entryValue)
                            )}
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
