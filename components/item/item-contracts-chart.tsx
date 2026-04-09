"use client";

import { useMemo, memo, useState, useCallback } from "react";
import { Card, Spinner, Button, ButtonGroup } from "@heroui/react";
import { LineChart } from "@tremor/react";

import { useContracts } from "@/lib/api/hooks";
import { BadgeSection } from "@/components/shared/badge-section";
import {
  CARD_CLASS_NAMES,
  BADGE_COLORS,
  formatNumber,
  LOCALE,
} from "@/components/item/constants";

interface ItemContractsChartProps {
  id: number | string;
}

const PERIOD_OPTIONS = ["1d", "24h", "1w", "30d", "1m"] as const;

const formatTimestamp = (timestamp: number | string): string => {
  try {
    let ts: number;

    if (typeof timestamp === "string") {
      ts = parseInt(timestamp, 10);
      if (isNaN(ts)) {
        return "Invalid";
      }
    } else {
      ts = timestamp;
    }

    // If timestamp looks like seconds (less than year 2100 in seconds), convert to milliseconds
    if (ts > 0 && ts < 4102444800) {
      ts = ts * 1000;
    }

    const date = new Date(ts);
    const timeVal = date.getTime();

    if (isNaN(timeVal) || timeVal < 0) {
      return "Invalid";
    }

    return date.toLocaleString(LOCALE, {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.error("Error formatting timestamp:", timestamp, error);

    return "Invalid";
  }
};

/**
 * Loading State Component
 */
const ItemContractsChartLoading = memo(() => (
  <Card className={CARD_CLASS_NAMES.root}>
    <Card.Content className={CARD_CLASS_NAMES.body}>
      <BadgeSection color={BADGE_COLORS.DEFAULT} label="Price Chart" />
      <div className={`${CARD_CLASS_NAMES.loading} min-h-[300px]`}>
        <Spinner color="warning" size="lg" />
      </div>
    </Card.Content>
  </Card>
));

ItemContractsChartLoading.displayName = "ItemContractsChartLoading";

/**
 * Price Chart Component
 */
interface ItemContractsChartDisplayProps {
  chartData: Array<{
    date: string;
    "Price (min)": number;
    "Median Price": number;
    "Top Price": number;
  }>;
  period: string;
  onPeriodChange: (period: string) => void;
}

const ItemContractsChartDisplay = memo(
  ({ chartData, period, onPeriodChange }: ItemContractsChartDisplayProps) => (
    <Card className={CARD_CLASS_NAMES.root}>
      <Card.Content className={CARD_CLASS_NAMES.body}>
        <div className="flex items-center justify-between mb-6">
          <BadgeSection color={BADGE_COLORS.DEFAULT} label="Price Chart" />
          <ButtonGroup size="sm" variant="outline">
            {PERIOD_OPTIONS.map((p) => (
              <Button
                key={p}
                className={
                  period === p
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--primary)] hover:bg-[color-mix(in_oklab,var(--primary),transparent_90%)]"
                }
                onClick={() => onPeriodChange(p)}
              >
                {p}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {chartData.length === 0 ? (
          <div className="text-center text-muted py-8">
            No chart data available for this period
          </div>
        ) : (
          <LineChart
            categories={["Price (min)", "Median Price", "Top Price"]}
            className="h-80"
            data={chartData}
            index="date"
            showAnimation={false}
            showGridLines={false}
            showLegend={false}
            showTooltip={true}
            showXAxis={false}
            showYAxis={false}
            valueFormatter={(value: number) => formatNumber(value)}
            yAxisWidth={65}
          />
        )}
      </Card.Content>
    </Card>
  )
);

ItemContractsChartDisplay.displayName = "ItemContractsChartDisplay";

/**
 * ItemContractsChart Component
 *
 * Displays a line chart of contract price data (min, median, top)
 * with period selector for different time ranges.
 *
 * @example
 * <ItemContractsChart id="12345" />
 */
export const ItemContractsChart = memo(({ id }: ItemContractsChartProps) => {
  const [period, setPeriod] = useState<string>("1d");
  const { data, error, isLoading } = useContracts(id, period);

  const chartData = useMemo(() => {
    if (!data?.contracts?.length) {
      return [];
    }

    return data.contracts
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((contract) => ({
        date: formatTimestamp(contract.timestamp),
        "Price (min)": contract.price,
        "Median Price": contract.priceMedian,
        "Top Price": contract.priceTop,
      }));
  }, [data?.contracts]);

  const handlePeriodChange = useCallback((newPeriod: string) => {
    setPeriod(newPeriod);
  }, []);

  // Error state - return null (silent failure following project pattern)
  if (error) return null;

  // Loading state
  if (isLoading) return <ItemContractsChartLoading />;

  // Empty state - no contracts available
  if (!data?.contracts?.length) return null;

  // Render chart with contracts data
  return (
    <ItemContractsChartDisplay
      chartData={chartData}
      period={period}
      onPeriodChange={handlePeriodChange}
    />
  );
});

ItemContractsChart.displayName = "ItemContractsChart";
