"use client";

import type { SnapshotHighlightGroup } from "@/lib/types/snapshot-metrics";

import Link from "next/link";
import {
  buildSnapshotKey,
  formatSnapshotDate,
  formatEntryValue,
  getSnapshotEntriesRich,
} from "@/lib/utils/snapshot-formatters";
import { useI18n } from "@/lib/i18n/context";
import { GoldValue } from "@/components/home/gold-value";

interface SnapshotBriefGroupProps {
  group: SnapshotHighlightGroup;
  metricCardHasError: boolean;
  metricSnapshotLoading: boolean;
}

export function SnapshotBriefGroup({
  group,
  metricCardHasError,
  metricSnapshotLoading,
}: SnapshotBriefGroupProps) {
  const { dict, locale } = useI18n();
  const sb = dict.snapshotBriefs;
  const sm = dict.snapshotMetrics;

  const groupTitle = sm[group.titleKey as keyof typeof sm] as string;

  return (
    <article
      key={group.titleKey}
      className="card-surface p-6 flex flex-col gap-4 border-l-4 border-l-[var(--border-accent)]"
    >
      <h3 className="text-xl font-semibold text-[var(--primary)]">
        {groupTitle}
      </h3>
      <section className="space-y-3">
        {group.metrics.map((metric) => {
          const snapshotKey = buildSnapshotKey(
            metric.category,
            metric.metricType
          );
          const entries = getSnapshotEntriesRich(
            metric.snapshot ?? null,
            metric.valueLimit,
            locale
          );
          const displayEntries =
            metric.sort === "alpha"
              ? [...entries].sort((a, b) => a.label.localeCompare(b.label))
              : entries;
          const snapshotDate = formatSnapshotDate(metric.snapshot ?? null);
          const metricLabel = sm[metric.labelKey as keyof typeof sm] as string;

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
                  {displayEntries.map((entry) => {
                    const entryKey = sm.metricEntries?.[
                      entry.label as keyof typeof sm.metricEntries
                    ]
                      ? entry.label
                      : undefined;
                    const dictLabel = entryKey
                      ? (sm.metricEntries?.[
                          entryKey as keyof typeof sm.metricEntries
                        ] as string) ?? entry.label
                      : entry.label;
                    const entryColor = metric.getEntryColor?.(entry.label);

                    const labelText = (() => {
                      if (dictLabel.endsWith(" g")) {
                        return (
                          <>
                            {dictLabel.slice(0, -2)}{" "}
                            <span className="text-[var(--primary)]">g</span>
                          </>
                        );
                      }
                      return dictLabel;
                    })();

                    return (
                      <div
                        key={entry.label}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <dt
                          className="text-foreground/60 text-xs"
                          style={entryColor ? { color: entryColor } : undefined}
                        >
                          {entry.href ? (
                            <Link
                              href={entry.href}
                              className="hover:text-[var(--primary)] transition-colors underline-offset-2 hover:underline"
                            >
                              {labelText}
                            </Link>
                          ) : (
                            labelText
                          )}
                        </dt>
                        <dd className="font-mono text-right">
                          {metric.valueFormat === "gold" &&
                          typeof entry.value === "number" ? (
                            <GoldValue copper={entry.value} />
                          ) : (
                            formatEntryValue(entry.value, metric.valueFormat)
                          )}
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
}
