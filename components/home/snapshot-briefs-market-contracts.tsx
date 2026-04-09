"use client";

import type { SnapshotHighlightGroup } from "@/lib/types/snapshot-metrics";

import {
  buildSnapshotKey,
  formatSnapshotDate,
  formatEntryValue,
  getSnapshotEntries,
} from "@/lib/utils/snapshot-formatters";
import { useI18n } from "@/lib/i18n/context";

interface SnapshotBriefsMarketContractsProps {
  snapshotHighlightGroups: SnapshotHighlightGroup[];
  metricCardHasError: boolean;
  metricSnapshotLoading: boolean;
}

export function SnapshotBriefsMarketContracts({
  snapshotHighlightGroups,
  metricCardHasError,
  metricSnapshotLoading,
}: SnapshotBriefsMarketContractsProps) {
  const { dict } = useI18n();
  const sb = dict.snapshotBriefs;
  const sm = dict.snapshotMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {snapshotHighlightGroups.map((group, groupIndex) => {
        const groupBorderColors = [
          "rgb(249, 115, 22)",
          "rgb(249, 115, 22)",
          "rgb(249, 115, 22)",
          "rgb(249, 115, 22)",
        ];
        const groupBorderColor =
          groupBorderColors[groupIndex % groupBorderColors.length];
        const groupTitle = sm[group.titleKey as keyof typeof sm];
        const groupDisclaimer = sm[group.disclaimerKey as keyof typeof sm];

        return (
          <article
            key={group.titleKey}
            className="rounded-2xl border border-content4/20 bg-content2/40 p-4 backdrop-blur border-l-4 transition-colors duration-200"
            style={{ borderLeftColor: groupBorderColor }}
          >
            <header>
              <h4 className="text-lg font-semibold">{groupTitle}</h4>
              <p className="text-muted mt-1 text-xs leading-relaxed">
                {groupDisclaimer}
              </p>
            </header>
            <section className="mt-4 space-y-3">
              {group.metrics.map((metric, metricIndex) => {
                const snapshotKey = buildSnapshotKey(
                  metric.category,
                  metric.metricType
                );
                const entries = getSnapshotEntries(
                  metric.snapshot ?? null,
                  metric.valueLimit
                );
                const displayEntries =
                  metric.sort === "alpha"
                    ? [...entries].sort((a, b) => a[0].localeCompare(b[0]))
                    : entries;
                const snapshotDate = formatSnapshotDate(
                  metric.snapshot ?? null
                );
                const metricLabel = sm[metric.labelKey as keyof typeof sm];

                return (
                  <div
                    key={snapshotKey}
                    className="rounded-xl border border-content4/20 p-3 bg-content1/40 border-l-4 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between gap-2 text-[0.65rem] uppercase tracking-wide text-foreground/50">
                      <span>{metricLabel}</span>
                      <span
                        aria-label={sb.snapshotDateAriaLabel.replace(
                          "{label}",
                          metricLabel
                        )}
                        className="text-foreground/80"
                      >
                        {metricCardHasError
                          ? sb.unavailable
                          : snapshotDate
                            ? snapshotDate
                            : metricSnapshotLoading
                              ? sb.loading
                              : sb.noSnapshot}
                      </span>
                    </div>
                    {displayEntries.length ? (
                      <dl className="mt-2 space-y-1 text-sm">
                        {displayEntries.map(([entryKey, entryValue]) => {
                          const entryColor = metric.getEntryColor?.(entryKey);

                          return (
                            <div
                              key={entryKey}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <dt
                                className="text-foreground/60 text-xs"
                                style={
                                  entryColor ? { color: entryColor } : undefined
                                }
                              >
                                {entryKey}
                              </dt>
                              <dd className="font-mono text-right">
                                {formatEntryValue(entryValue)}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    ) : (
                      <p className="mt-2 text-muted text-xs">
                        {metricCardHasError
                          ? sb.unableToRead
                          : metricSnapshotLoading
                            ? sb.loadingValues
                            : sb.noPayload}
                      </p>
                    )}
                  </div>
                );
              })}
            </section>
          </article>
        );
      })}
    </div>
  );
}
