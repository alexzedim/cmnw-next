"use client";

import type {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import type { AnalyticsMetricHistoryEntry, Realm } from "@/lib/types";
import type { RealmMetricKey } from "@/constants/realm-metrics";
import type { SnapshotValueFormat } from "@/lib/utils/snapshot-formatters";

import { LineChart } from "@tremor/react";

import { useRealmHistory } from "@/hooks/useRealmMetrics";
import { formatEntryValue } from "@/lib/utils/snapshot-formatters";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";

interface RealmTrendChartProps {
  category: AnalyticsMetricCategory;
  metricType: AnalyticsMetricType;
  realmKey: RealmMetricKey;
  realm: Realm;
  titleKey: string;
  dataKey: string;
  valueFormat: SnapshotValueFormat;
  days?: number;
  deltaMode?: boolean;
}

const LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  ru: "ru-RU",
};

/**
 * Renders a trend chart for a realm metric over time.
 *
 * In delta mode (for near-flat metrics like realm population), it renders
 * day-over-day change bars — green for growth, red for decline — so small
 * variations are visible. The tooltip shows the signed delta (+/−).
 *
 * In line mode (for volatile metrics like market volume), it renders a
 * standard Tremor line chart of the absolute value.
 */
export const RealmTrendChart = ({
  category,
  metricType,
  realmKey,
  realm,
  titleKey,
  dataKey,
  valueFormat,
  days = 30,
  deltaMode = false,
}: RealmTrendChartProps) => {
  const { dict, locale } = useI18n();
  const r = dict.realm;
  const title = (r[titleKey as keyof typeof r] as string) ?? titleKey;
  const dateLocale = LOCALE_MAP[locale] ?? "en-US";

  const { data, isLoading } = useRealmHistory(
    category,
    metricType,
    realmKey,
    realm,
    days
  );

  const extractValue = (entry: AnalyticsMetricHistoryEntry): number => {
    const value = entry.value as Record<string, unknown>;

    return typeof value[dataKey] === "number" ? (value[dataKey] as number) : 0;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "2-digit",
    });

  return (
    <div className="card-surface p-6 flex flex-col gap-4">
      <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
        <div className="size-1.5 rounded-full bg-[var(--primary)]" />
        <span style={{ fontFamily: fontJetBrains.style.fontFamily }}>
          {title}
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/50">{r.loadingSnapshot}</p>
      ) : data.length < 2 ? (
        <p className="text-sm text-foreground/50">{r.noData}</p>
      ) : deltaMode ? (
        <DeltaBars
          data={data}
          dateLocale={dateLocale}
          extractValue={extractValue}
          formatDate={formatDate}
        />
      ) : (
        <div className="realm-trend-chart">
          <LineChart
            showGridLines
            showTooltip
            showXAxis
            showYAxis
            categories={["value"]}
            className="h-72"
            colors={["amber"]}
            data={data.map((entry) => ({
              date: formatDate(entry.snapshotDate),
              value: extractValue(entry),
            }))}
            index="date"
            showAnimation={false}
            showLegend={false}
            valueFormatter={(value: number) =>
              formatEntryValue(value, valueFormat)
            }
            yAxisWidth={70}
          />
        </div>
      )}
    </div>
  );
};

const POSITIVE_COLOR = "rgb(34, 197, 94)";
const NEGATIVE_COLOR = "rgb(239, 68, 68)";

/**
 * Day-over-day delta bars for near-flat metrics (e.g. realm population).
 *
 * A self-contained SVG chart: green bars for growth, red for decline,
 * symmetric Y-axis around zero. Tooltips show the signed delta.
 */
const DeltaBars = ({
  data,
  dateLocale,
  extractValue,
  formatDate,
}: {
  data: AnalyticsMetricHistoryEntry[];
  dateLocale: string;
  extractValue: (entry: AnalyticsMetricHistoryEntry) => number;
  formatDate: (dateStr: string) => string;
}) => {
  // Compute deltas: delta[i] = value[i] - value[i-1], dated at [i].
  const points = data
    .slice(1)
    .map((entry, i) => {
      const current = extractValue(entry);
      const previous = extractValue(data[i]);

      return {
        date: formatDate(entry.snapshotDate),
        delta: current - previous,
      };
    })
    .filter((point) => point.delta !== 0);

  if (points.length === 0) {
    return null;
  }

  const maxAbsDelta = Math.max(...points.map((p) => Math.abs(p.delta)), 1);

  const W = 1000;
  const H = 288;
  const PAD_L = 70;
  const PAD_R = 16;
  const PAD_T = 12;
  const PAD_B = 40;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const zeroY = PAD_T + chartH / 2;
  const barW = chartW / points.length;
  const yScale = (chartH / 2 - 4) / maxAbsDelta;

  const formatter = new Intl.NumberFormat(dateLocale, {
    maximumFractionDigits: 0,
    signDisplay: "always",
  });

  // Y-axis ticks: 0, ±¼, ±½, ±max
  const yTicks = [
    -maxAbsDelta,
    -maxAbsDelta / 2,
    0,
    maxAbsDelta / 2,
    maxAbsDelta,
  ];

  // Show every Nth X label to avoid crowding
  const labelStep = Math.max(1, Math.ceil(points.length / 8));

  return (
    <div className="realm-trend-chart w-full overflow-x-auto">
      <svg
        className="w-full"
        height={H}
        preserveAspectRatio="none"
        role="img"
        viewBox={`0 0 ${W} ${H}`}
      >
        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = zeroY - tick * yScale;

          return (
            <line
              key={tick}
              stroke="var(--border)"
              strokeOpacity={tick === 0 ? 0.8 : 0.3}
              strokeWidth={tick === 0 ? 1.5 : 1}
              x1={PAD_L}
              x2={W - PAD_R}
              y1={y}
              y2={y}
            />
          );
        })}

        {/* Y-axis labels */}
        {yTicks.map((tick) => {
          const y = zeroY - tick * yScale;

          return (
            <text
              className="recharts-text fill-[var(--text-muted)]"
              fontSize={11}
              textAnchor="end"
              x={PAD_L - 8}
              y={y + 4}
            >
              {formatter.format(tick)}
            </text>
          );
        })}

        {/* Bars */}
        {points.map((point, i) => {
          const x = PAD_L + i * barW + 1;
          const barHeight = Math.abs(point.delta) * yScale;
          const isPositive = point.delta > 0;
          const y = isPositive ? zeroY - barHeight : zeroY;
          const color = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;
          const barWidth = Math.max(barW - 2, 2);

          return (
            <g key={`${point.date}-${i}`}>
              <rect
                fill={color}
                height={Math.max(barHeight, 1)}
                rx={1}
                width={barWidth}
                x={x}
                y={y}
              >
                <title>
                  {point.date}: {formatter.format(point.delta)}
                </title>
              </rect>
            </g>
          );
        })}

        {/* X-axis labels */}
        {points.map((point, i) => {
          if (i % labelStep !== 0 && i !== points.length - 1) {
            return null;
          }

          const x = PAD_L + i * barW + barW / 2;

          return (
            <text
              className="fill-[var(--text-muted)]"
              fontSize={10}
              textAnchor="middle"
              x={x}
              y={H - PAD_B + 22}
            >
              {point.date}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
