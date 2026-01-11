"use client";

import type { SnapshotHighlightGroup } from "@/lib/types/snapshot-metrics";
import {
  buildSnapshotKey,
  formatSnapshotDate,
  formatEntryValue,
  getSnapshotEntries,
} from "@/lib/utils/snapshot-formatters";

interface SnapshotBriefsProps {
  snapshotHighlightGroups: SnapshotHighlightGroup[];
  metricCardHasError: boolean;
  metricSnapshotLoading: boolean;
}

/**
 * Snapshot briefs section displaying analytics across multiple categories.
 * Shows grouped metrics with snapshot data, dates, and formatted values.
 */
export function SnapshotBriefs({
  snapshotHighlightGroups,
  metricCardHasError,
  metricSnapshotLoading,
}: SnapshotBriefsProps) {
  return (
    <section className="section section-tight-top container mx-auto px-6">
      <div className="card-surface p-6 flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
            Snapshot briefs
          </p>
          <p className="text-muted mt-2 text-sm">
            Combined analytics across characters, guilds, market, and contracts
            — character & guild slices only count max-level rosters, while
            market and contracts focus on tradable instruments with verifiable
            liquidity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {snapshotHighlightGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-content4/20 bg-content2/40 p-4 backdrop-blur"
            >
              <header>
                <h4 className="text-lg font-semibold">{group.title}</h4>
                <p className="text-muted mt-1 text-xs leading-relaxed">
                  {group.disclaimer}
                </p>
              </header>
              <section className="mt-4 space-y-3">
                {group.metrics.map((metric) => {
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
                      ? [...entries].sort((a, b) =>
                          a[0].localeCompare(b[0])
                        )
                      : entries;
                  const snapshotDate = formatSnapshotDate(
                    metric.snapshot ?? null
                  );

                  return (
                    <div
                      key={snapshotKey}
                      className="rounded-xl border border-content4/20 bg-content1/40 p-3"
                    >
                      <div className="flex items-center justify-between gap-2 text-[0.65rem] uppercase tracking-wide text-foreground/50">
                        <span>{metric.label}</span>
                        <span
                          className="text-foreground/80"
                          aria-label={`${metric.label} snapshot date`}
                        >
                          {metricCardHasError
                            ? "Unavailable"
                            : snapshotDate
                              ? snapshotDate
                              : metricSnapshotLoading
                                ? "Loading…"
                                : "No snapshot"}
                        </span>
                      </div>
                      {displayEntries.length ? (
                        <dl className="mt-2 space-y-1 text-sm">
                          {displayEntries.map(([entryKey, entryValue]) => {
                            const entryColor =
                              metric.getEntryColor?.(entryKey);

                            return (
                              <div
                                key={entryKey}
                                className="flex items-center justify-between gap-3 text-sm"
                              >
                                <dt
                                  className="text-foreground/60 text-xs"
                                  style={
                                    entryColor
                                      ? { color: entryColor }
                                      : undefined
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
                            ? "Unable to read metric values."
                            : metricSnapshotLoading
                              ? "Loading metric values…"
                              : "Metrics responded without value payload."}
                        </p>
                      )}
                    </div>
                  );
                })}
              </section>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
