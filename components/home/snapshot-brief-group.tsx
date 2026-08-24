"use client";

import type { SnapshotHighlightGroup } from "@/lib/types/snapshot-metrics";

import Link from "next/link";

import {
  buildSnapshotKey,
  formatSnapshotDate,
  formatEntryValue,
  getSnapshotEntriesRich,
  ageRangeRank,
  membersRangeRank,
  pointsRangeRank,
  priceRangeRank,
} from "@/lib/utils/snapshot-formatters";
import { useI18n } from "@/lib/i18n/context";
import { useRandomSalt } from "@/hooks/use-romanize";
import { romanizeTitle } from "@/lib/utils/romanize";
import { fontJetBrains } from "@/config/fonts";
import { GoldValue } from "@/components/home/gold-value";
import { SigmaValue } from "@/components/home/sigma-value";

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
  const salt = useRandomSalt();

  const groupTitle = romanizeTitle(
    group.titleKey,
    sm[group.titleKey as keyof typeof sm] as string,
    salt
  );

  return (
    <article
      key={group.titleKey}
      className="card-surface p-6 flex flex-col gap-4 border-l-4 border-l-[var(--border-accent)]"
    >
      <h3
        className="text-xl font-semibold text-[var(--primary)]"
        style={{ fontFamily: fontJetBrains.style.fontFamily }}
      >
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
            locale,
            metric.valueKey,
            metric.entryHrefBase
          );
          const displayEntries =
            metric.sort === "alpha"
              ? [...entries].sort((a, b) => a.label.localeCompare(b.label))
              : metric.sort === "priceRange"
                ? [...entries].sort(
                    (a, b) => priceRangeRank(a.label) - priceRangeRank(b.label)
                  )
                : metric.sort === "memberRange"
                  ? [...entries].sort(
                      (a, b) =>
                        membersRangeRank(a.label) - membersRangeRank(b.label)
                    )
                  : metric.sort === "pointsRange"
                    ? [...entries].sort(
                        (a, b) =>
                          pointsRangeRank(a.label) - pointsRangeRank(b.label)
                      )
                    : metric.sort === "ageRange"
                      ? [...entries].sort(
                          (a, b) =>
                            ageRangeRank(a.label) - ageRangeRank(b.label)
                        )
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
                      ? ((sm.metricEntries?.[
                          entryKey as keyof typeof sm.metricEntries
                        ] as string) ?? entry.label)
                      : entry.label;
                    const entryColor = metric.getEntryColor?.(entry.label);

                    const labelText = (() => {
                      if (metric.labelSuffix) {
                        // Legacy dictionary labels carry a gold " g" unit
                        // suffix (shared with market price ranges) — strip it
                        // before applying the metric's own unit symbol.
                        const unitlessLabel = dictLabel.endsWith(" g")
                          ? dictLabel.slice(0, -2)
                          : dictLabel;

                        return (
                          <>
                            {unitlessLabel}{" "}
                            <span className="text-[var(--primary)]">
                              {metric.labelSuffix}
                            </span>
                          </>
                        );
                      }

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
                              className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors underline underline-offset-2 decoration-[var(--primary)]/30 hover:decoration-[var(--primary)]"
                              href={entry.href}
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
                            <GoldValue value={entry.value} />
                          ) : typeof entry.value === "string" &&
                            entry.value.startsWith("σ") ? (
                            <SigmaValue text={entry.value} />
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
