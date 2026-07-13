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
}

/**
 * Renders a single-series Tremor LineChart for a realm metric over time.
 * Extracts `dataKey` (e.g. "count", "volume") from each historical snapshot's
 * value object.
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
}: RealmTrendChartProps) => {
  const { dict } = useI18n();
  const r = dict.realm;
  const title = (r as Record<string, string>)[titleKey] ?? titleKey;

  const { data, isLoading } = useRealmHistory(
    category,
    metricType,
    realmKey,
    realm,
    days
  );

  const chartData = data
    .map((entry: AnalyticsMetricHistoryEntry) => {
      const value = entry.value as Record<string, unknown>;
      const raw = value[dataKey];
      const numeric = typeof raw === "number" ? raw : 0;

      return {
        date: new Date(entry.snapshotDate).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "2-digit",
        }),
        [title]: numeric,
      };
    })
    .filter((point) => point[title as keyof typeof point] !== undefined);

  return (
    <div className="card-surface p-6 flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-[var(--primary)]">{title}</h3>

      {isLoading ? (
        <p className="text-sm text-foreground/50">{r.loadingSnapshot}</p>
      ) : chartData.length < 2 ? (
        <p className="text-sm text-foreground/50">{r.noData}</p>
      ) : (
        <div className="realm-trend-chart">
          <LineChart
            showGridLines
            showTooltip
            showXAxis
            showYAxis
            categories={[title]}
            className="h-64"
            colors={["amber"]}
            data={chartData}
            index="date"
            showAnimation={false}
            showLegend={false}
            valueFormatter={(value: number) =>
              formatEntryValue(value, valueFormat)
            }
            yAxisWidth={65}
          />
        </div>
      )}
    </div>
  );
};
