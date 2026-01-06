"use client";

import type {
  AnalyticsMetricSnapshotDto,
  AppHealthMetricSnapshot,
} from "@/lib/types";

import { useMemo } from "react";
import useSWR from "swr";
import { Button } from "@heroui/button";

import { useAppMetrics } from "@/components/providers/app-metrics-provider";
import { title } from "@/components/primitives";
import { SearchForm } from "@/components/search-form";
import { ENDPOINTS } from "@/constants/endpoints";

const METRIC_CARDS = [
  { key: "characters", title: "Characters" },
  { key: "guilds", title: "Guilds" },
  { key: "market", title: "Market" },
] as const;

type MetricCardKey = (typeof METRIC_CARDS)[number]["key"];

type MetricSnapshotRecord = Partial<
  Record<MetricCardKey, AppHealthMetricSnapshot | null>
>;

const METRIC_SNAPSHOT_ENDPOINT = `${ENDPOINTS.API.replace(/\/+$/, "")}/api/app/metrics/snapshot`;
const SNAPSHOT_METRIC_TYPE = "total";

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
    METRIC_CARDS.map(async ({ key }) => {
      const url = new URL(METRIC_SNAPSHOT_ENDPOINT);

      url.searchParams.set("category", key);
      url.searchParams.set("metricType", SNAPSHOT_METRIC_TYPE);

      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${key} metric snapshot: ${response.status}`
        );
      }

      const payload: AnalyticsMetricSnapshotDto = await response.json();

      return [key, toAppHealthSnapshot(payload)] as const;
    })
  );

  return entries.reduce<MetricSnapshotRecord>((acc, [key, snapshot]) => {
    acc[key] = snapshot;

    return acc;
  }, {} as MetricSnapshotRecord);
};

const toDateFromTimestamp = (timestamp: number | null | undefined) => {
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return null;
  }

  const isSeconds = timestamp < 1_000_000_000_000;
  const milliseconds = isSeconds ? timestamp * 1000 : timestamp;

  return Number.isFinite(milliseconds) ? new Date(milliseconds) : null;
};

const getSnapshotEntries = (snapshot: AppHealthMetricSnapshot | null) => {
  if (!snapshot?.value || typeof snapshot.value !== "object") {
    return [];
  }

  return Object.entries(snapshot.value).slice(0, 4);
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
  const {
    metrics,
    status: metricsStatus,
    hasError: metricsError,
  } = useAppMetrics();

  const {
    data: metricSnapshotData,
    error: metricSnapshotError,
    isLoading: metricSnapshotLoading,
  } = useSWR<MetricSnapshotRecord>(
    "app-metric-snapshots/total",
    fetchMetricSnapshots,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const metricSnapshots = useMemo(
    () =>
      METRIC_CARDS.map(({ key, title }) => ({
        key,
        title,
        snapshot: metricSnapshotData?.[key] ?? null,
      })),
    [metricSnapshotData]
  );

  const latestMarketDate = toDateFromTimestamp(
    metrics?.latestMarketTimestamp ?? null
  );

  const metricCardHasError = metricsError || Boolean(metricSnapshotError);

  const overviewCards = [
    {
      title: "Platform status",
      primary: metricsError
        ? "Status unavailable"
        : metricsStatus === "online"
          ? "Operational"
          : metricsStatus === "degraded"
            ? "Degraded performance"
            : "Checking status…",
      description:
        metrics?.version && !metricsError
          ? `Reported by API v${metrics.version}`
          : "Awaiting API heartbeat…",
    },
    {
      title: "Uptime",
      primary:
        metrics?.uptime && !metricsError
          ? metrics.uptime
          : metricsError
            ? "Uptime unavailable"
            : "Calculating…",
      description: "Rolling 24h uptime as reported by the metrics endpoint.",
    },
    {
      title: "Latest market update",
      primary:
        latestMarketDate && !metricsError
          ? latestMarketDate.toLocaleString()
          : metricsError
            ? "Market feed offline"
            : "Loading market data…",
      description: metricsError
        ? "Market ingestion did not report a timestamp."
        : "Timestamp of the most recent market snapshot.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="section flex flex-col items-center justify-center gap-8">
        <div className="inline-block max-w-3xl text-center justify-center">
          <h1 className={title()}>CMNW</h1>
          <p className="text-muted mt-4 text-lg">
            Commonwealth — World of Warcraft community tools
          </p>
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-3">
          <Button className="px-6" color="primary">
            Get Started
          </Button>
          <Button className="px-6" variant="bordered">
            Docs
          </Button>
        </div>

        <div className="w-full flex justify-center px-4">
          <SearchForm />
        </div>
      </section>

      {/* Live metrics */}
      <section className="section container mx-auto px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
              Live metrics
            </p>
          </div>
          <span
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
          {metricSnapshots.map(({ key, title, snapshot }) => {
            const snapshotDate = formatSnapshotDate(snapshot);
            const entries = getSnapshotEntries(snapshot);

            return (
              <div key={key} className="card-surface p-6 flex flex-col gap-4">
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

      {/* Operational summary */}
      <section className="section container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {overviewCards.map((card) => (
            <div
              key={card.title}
              className="card-surface p-6 flex flex-col gap-3"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
                {card.title}
              </p>
              <p className="text-2xl font-semibold">{card.primary}</p>
              <p className="text-muted text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
