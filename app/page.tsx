"use client";

import type {
  AnalyticsMetricSnapshotDto,
  AppHealthMetricSnapshot,
} from "@/lib/types";

import { useMemo } from "react";
import useSWR from "swr";

import { useAppMetrics } from "@/components/providers/app-metrics-provider";
import { title } from "@/components/primitives";
import { SearchForm } from "@/components/search-form";
import { LiveMetrics } from "@/components/home/live-metrics";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import { classColors } from "@/constants/class-colors";

const METRIC_CARDS = [
  {
    category: AnalyticsMetricCategory.CHARACTERS,
    title: "Characters",
    metricType: AnalyticsMetricType.TOTAL,
  },
  {
    category: AnalyticsMetricCategory.GUILDS,
    title: "Guilds",
    metricType: AnalyticsMetricType.TOTAL,
  },
  {
    category: AnalyticsMetricCategory.MARKET,
    title: "Market",
    metricType: AnalyticsMetricType.TOTAL,
  },
] as const;

type SnapshotKey = `${AnalyticsMetricCategory}:${AnalyticsMetricType}`;

const buildSnapshotKey = (
  category: AnalyticsMetricCategory,
  metricType: AnalyticsMetricType
) => `${category}:${metricType}` as SnapshotKey;

type SnapshotRequest = {
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
};

type SnapshotHighlightMetric = SnapshotRequest & {
  label: string;
  valueLimit?: number;
  sort?: "alpha";
  getEntryColor?: (label: string) => string | undefined;
};

type SnapshotHighlightGroup = {
  title: string;
  disclaimer: string;
  metrics: readonly SnapshotHighlightMetric[];
};

const SNAPSHOT_HIGHLIGHT_GROUPS: readonly SnapshotHighlightGroup[] = [
  {
    title: "Characters @ cap",
    disclaimer:
      "It only tracks fully ingested max-level characters captured during the latest sync window.",
    metrics: [
      {
        label: "Faction split",
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.BY_FACTION_MAX_LEVEL,
      },
      {
        label: "Class mix",
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.BY_CLASS_MAX_LEVEL,
        valueLimit: Number.POSITIVE_INFINITY,
        sort: "alpha",
        getEntryColor: (className: string) =>
          classColors.get(className) ?? undefined,
      },
      {
        label: "Level bracket",
        category: AnalyticsMetricCategory.CHARACTERS,
        metricType: AnalyticsMetricType.BY_LEVEL_MAX_LEVEL,
      },
    ] as const,
  },
  {
    title: "Guild structures",
    disclaimer:
      "Roster slices only include guilds with verified activity in the past 48 hours.",
    metrics: [
      {
        label: "Size distribution",
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.SIZE_DISTRIBUTION,
      },
      {
        label: "Top by members",
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.TOP_BY_MEMBERS,
      },
      {
        label: "Top by achievements",
        category: AnalyticsMetricCategory.GUILDS,
        metricType: AnalyticsMetricType.TOP_BY_ACHIEVEMENTS,
      },
    ] as const,
  },
  {
    title: "Market flow",
    disclaimer:
      "Commodity spans show only markets with validated quotes and auctions.",
    metrics: [
      {
        label: "Price ranges",
        category: AnalyticsMetricCategory.MARKET,
        metricType: AnalyticsMetricType.PRICE_RANGES,
      },
      {
        label: "Top by volume",
        category: AnalyticsMetricCategory.MARKET,
        metricType: AnalyticsMetricType.TOP_BY_VOLUME,
      },
      {
        label: "Price volatility",
        category: AnalyticsMetricCategory.MARKET,
        metricType: AnalyticsMetricType.PRICE_VOLATILITY,
      },
    ] as const,
  },
  {
    title: "Contracts board",
    disclaimer:
      "Contract stats focus on max-duration instruments with verifiable liquidity.",
    metrics: [
      {
        label: "Open interest leaders",
        category: AnalyticsMetricCategory.CONTRACTS,
        metricType: AnalyticsMetricType.TOP_BY_OPEN_INTEREST,
      },
      {
        label: "Quantity concentration",
        category: AnalyticsMetricCategory.CONTRACTS,
        metricType: AnalyticsMetricType.TOP_BY_QUANTITY,
      },
      {
        label: "Auction throughput",
        category: AnalyticsMetricCategory.CONTRACTS,
        metricType: AnalyticsMetricType.TOP_BY_AUCTIONS,
      },
    ] as const,
  },
] as const;

const SNAPSHOT_REQUESTS: SnapshotRequest[] = [
  ...METRIC_CARDS.map(({ category, metricType }) => ({ category, metricType })),
  ...SNAPSHOT_HIGHLIGHT_GROUPS.flatMap((group) => group.metrics),
];

type MetricSnapshotRecord = Partial<
  Record<SnapshotKey, AppHealthMetricSnapshot | null>
>;

const METRIC_SNAPSHOT_ENDPOINT = ENDPOINTS.METRIC_SNAPSHOT_ENDPOINT;

const normalizeSnapshotValue = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
};

const toAppHealthSnapshot = (
  snapshot: AnalyticsMetricSnapshotDto
): AppHealthMetricSnapshot => ({
  snapshotDate:
    snapshot.snapshotDate || snapshot.createdAt || new Date().toISOString(),
  value: normalizeSnapshotValue(snapshot.value),
});

const fetchMetricSnapshots = async (): Promise<MetricSnapshotRecord> => {
  const entries = await Promise.all(
    SNAPSHOT_REQUESTS.map(async ({ category, metricType }) => {
      const url = new URL(METRIC_SNAPSHOT_ENDPOINT);
      const key = buildSnapshotKey(category, metricType);

      url.searchParams.set("category", category);
      url.searchParams.set("metricType", metricType);

      try {
        const response = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${category}/${metricType} metric snapshot: ${response.status}`
          );
        }

        const payload: AnalyticsMetricSnapshotDto = await response.json();

        return [key, toAppHealthSnapshot(payload)] as const;
      } catch (error) {
        console.warn(
          `[metrics] snapshot ${key} failed`,
          error instanceof Error ? error : new Error(String(error))
        );

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

const getSnapshotEntries = (
  snapshot: AppHealthMetricSnapshot | null,
  limit = 4
) => {
  if (!snapshot?.value || typeof snapshot.value !== "object") {
    return [];
  }

  return Object.entries(snapshot.value).slice(0, limit);
};

const formatSnapshotDate = (snapshot: AppHealthMetricSnapshot | null) => {
  if (!snapshot?.snapshotDate) {
    return null;
  }

  const date = new Date(snapshot.snapshotDate);

  return Number.isNaN(date.getTime())
    ? snapshot.snapshotDate
    : date.toLocaleString();
};

const formatEntryValue = (value: unknown) => {
  if (value == null) {
    return "—";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export default function Home() {
  const { status: metricsStatus, hasError: metricsError } = useAppMetrics();

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

  const metricSnapshots = useMemo(
    () =>
      METRIC_CARDS.map(({ category, metricType, title }) => ({
        category,
        metricType,
        title,
        snapshot:
          metricSnapshotData?.[buildSnapshotKey(category, metricType)] ?? null,
      })),
    [metricSnapshotData]
  );

  const snapshotHighlightGroups = useMemo(
    () =>
      SNAPSHOT_HIGHLIGHT_GROUPS.map((group) => ({
        ...group,
        metrics: group.metrics.map((metric) => ({
          ...metric,
          snapshot:
            metricSnapshotData?.[
              buildSnapshotKey(metric.category, metric.metricType)
            ] ?? null,
        })),
      })),
    [metricSnapshotData]
  );

  const metricCardHasError = metricsError || Boolean(metricSnapshotError);

  return (
    <>
      {/* Hero */}
      <section className="section flex flex-col items-center justify-center gap-8">
        <div className="inline-block max-w-3xl text-center justify-center">
          <h1 className={title()}>CMNW</h1>
        </div>

        <div className="w-full flex justify-center px-4">
          <SearchForm />
        </div>
      </section>

      {/* Live metrics */}
      <LiveMetrics
        metricCardHasError={metricCardHasError}
        metricSnapshotLoading={metricSnapshotLoading}
        metricSnapshots={metricSnapshots}
        metricsError={metricsError}
        metricsStatus={metricsStatus}
      />

      {/* Snapshot briefs */}
      <section className="section section-tight-top container mx-auto px-6">
        <div className="card-surface p-6 flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
              Snapshot briefs
            </p>
            <p className="text-muted mt-2 text-sm">
              Combined analytics across characters, guilds, market, and
              contracts — character & guild slices only count max-level rosters,
              while market and contracts focus on tradable instruments with
              verifiable liquidity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {snapshotHighlightGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-content4/20 bg-content2/40 p-4 backdrop-blur"
              >
                <div>
                  <h4 className="text-lg font-semibold">{group.title}</h4>
                  <p className="text-muted mt-1 text-xs leading-relaxed">
                    {group.disclaimer}
                  </p>
                </div>
                <div className="mt-4 space-y-3">
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
                        ? [...entries].sort((a, b) => a[0].localeCompare(b[0]))
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
                          <span className="text-foreground/80">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
