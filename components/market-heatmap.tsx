"use client";

import { Fragment, FC, useState, MouseEvent, memo } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import useSWR from "swr";

import { DOMAINS } from "@/constants";
import { BadgeSection } from "@/components/shared/BadgeSection";
import {
  CARD_CLASS_NAMES,
  BADGE_COLORS,
  LOCALE,
} from "@/components/item/constants";

interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  orders?: number;
  oi?: number;
}

interface HeatmapResponse {
  xAxis: (string | number)[];
  yAxis: string[];
  dataset: HeatmapDataPoint[];
}

interface MarketHeatmapProps {
  id: number | string;
  isCommdty?: boolean;
  isGold?: boolean;
  hasContracts?: boolean;
}

/**
 * Get color intensity gradient for heatmap cells
 * Uses orange color scheme for better visual hierarchy
 */
const getHeatColor = (value: number, max: number): string => {
  if (value === 0 || max === 0) return "rgba(30, 30, 30, 0.3)";

  const intensity = Math.min(value / max, 1);
  // Orange color gradient: from light to deep orange
  const r = Math.floor(255 * (0.5 + intensity * 0.5));
  const g = Math.floor(153 * (0.3 + intensity * 0.7));
  const b = Math.floor(51 * (0.2 + intensity * 0.8));

  return `rgba(${r}, ${g}, ${b}, ${0.4 + intensity * 0.6})`;
};

/**
 * Format axis label for display
 */
const formatAxisLabel = (value: string | number): string => {
  if (typeof value === "number") {
    return new Date(value).toLocaleString(LOCALE, {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return String(value);
};

/**
 * Loading State Component
 */
const MarketHeatmapLoading = memo(() => (
  <Card className={CARD_CLASS_NAMES.root}>
    <CardBody className={CARD_CLASS_NAMES.body}>
      <BadgeSection label="Market Heatmap" color={BADGE_COLORS.DEFAULT} />
      <div className={`${CARD_CLASS_NAMES.loading} min-h-[400px]`}>
        <Spinner color="warning" size="lg" />
      </div>
    </CardBody>
  </Card>
));

MarketHeatmapLoading.displayName = "MarketHeatmapLoading";

/**
 * MarketHeatmap Component
 *
 * Displays market data as an interactive heatmap for commodity items,
 * gold items, or items with contracts. Shows price levels (Y-axis) vs
 * timestamps (X-axis) with intensity indicating market quantity.
 *
 * @example
 * <MarketHeatmap id="12345" isCommdty={true} />
 */
export const MarketHeatmap: FC<MarketHeatmapProps> = memo(
  ({
    id,
    isCommdty = false,
    isGold = false,
    hasContracts = false,
  }: MarketHeatmapProps) => {
    const [hoveredCell, setHoveredCell] =
      useState<HeatmapDataPoint | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Render heatmap for commodity items, gold items, or items with contracts
    const shouldShowChart = isCommdty || isGold || hasContracts;
    if (!shouldShowChart) return null;

    const { data, error, isLoading } = useSWR<HeatmapResponse>(
      `${DOMAINS.domain}/api/dma/item/chart?id=${id}`,
      (url: string) => fetch(url).then((r) => r.json())
    );

    // Error state - return null (silent failure following project pattern)
    if (error) return null;

    // Loading state
    if (isLoading) return <MarketHeatmapLoading />;

    // Empty state - no data available
    if (!data || !data.dataset.length) return null;

    // Calculate max value for color scaling
    const maxValue = Math.max(...data.dataset.map((d) => d.value));

    // Create a map for quick data lookup
    const dataMap = new Map<string, HeatmapDataPoint>();

    data.dataset.forEach((point) => {
      dataMap.set(`${point.x}-${point.y}`, point);
    });

    const handleMouseMove = (e: MouseEvent, point: HeatmapDataPoint) => {
      setHoveredCell(point);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setHoveredCell(null);
    };

    return (
      <Card className={CARD_CLASS_NAMES.root}>
        <CardBody className={CARD_CLASS_NAMES.body}>
          <BadgeSection label="Market Heatmap" color={BADGE_COLORS.DEFAULT} />

          <div className="overflow-x-auto rounded-lg border border-divider bg-background">
            <div className="inline-block min-w-full">
              {/* Grid Container */}
              <div
                className="grid border-collapse"
                style={{
                  gridTemplateColumns: `120px repeat(${data.xAxis.length}, minmax(100px, 1fr))`,
                  borderSpacing: "1px",
                  backgroundColor: "var(--color-divider)",
                }}
              >
                {/* Y-axis labels and data cells (reversed for price inversion) */}
                {[...data.yAxis].reverse().map((yLabel, reversedIndex) => {
                  const yIndex = data.yAxis.length - 1 - reversedIndex;
                  return (
                    <Fragment key={`row-${yIndex}`}>
                      {/* Y-axis label (price) */}
                      <div
                        key={`y-${yIndex}`}
                        className="bg-slate-600 p-3 text-xs font-semibold text-orange-500 text-right sticky left-0 z-10"
                      >
                        {parseFloat(yLabel).toFixed(2)}
                      </div>

                      {/* Data cells */}
                      {data.xAxis.map((_, xIndex) => {
                        const point = dataMap.get(`${xIndex}-${yIndex}`);
                        const value = point?.value || 0;
                        const bgColor = getHeatColor(value, maxValue);

                        return (
                          <div
                            key={`cell-${xIndex}-${yIndex}`}
                            className="relative p-2 text-center text-xs font-semibold transition-all duration-150 hover:ring-2 hover:ring-offset-1 hover:ring-orange-500 hover:z-30 cursor-pointer bg-background"
                            style={{ backgroundColor: bgColor }}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={(e) => point && handleMouseMove(e, point)}
                          >
                            {value > 0 && (
                              <span className="text-orange-500">
                                {value.toLocaleString(LOCALE)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </Fragment>
                  );
                })}

                {/* X-axis labels (timestamps) at bottom */}
                <div className="bg-slate-600 p-3 font-semibold text-xs text-slate-200 sticky left-0 z-20" />
                {data.xAxis.map((xLabel, i) => (
                  <div
                    key={`x-${i}`}
                    className="bg-slate-600 p-4 text-xs font-semibold text-slate-200 text-center"
                    title={formatAxisLabel(xLabel)}
                  >
                    {formatAxisLabel(xLabel)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredCell && (
            <div
              className="fixed z-50 bg-slate-800 text-orange-50 text-xs p-4 rounded-lg shadow-xl pointer-events-none max-w-xs border border-orange-500/30 backdrop-blur"
              style={{
                left: mousePosition.x + 15,
                top: mousePosition.y + 15,
              }}
            >
              <div className="space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="font-semibold text-orange-500">Time:</span>
                  <span className="text-slate-200">
                    {formatAxisLabel(data.xAxis[hoveredCell.x])}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="font-semibold text-orange-500">Price:</span>
                  <span className="text-slate-200">
                    {parseFloat(data.yAxis[hoveredCell.y]).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="font-semibold text-orange-500">Quantity:</span>
                  <span className="text-orange-300 font-semibold">
                    {hoveredCell.value.toLocaleString(LOCALE)}
                  </span>
                </div>
                {hoveredCell.orders !== undefined && (
                  <div className="flex justify-between gap-2 pt-1 border-t border-orange-500/20">
                    <span className="font-semibold text-orange-500">Orders:</span>
                    <span className="text-slate-200">{hoveredCell.orders}</span>
                  </div>
                )}
                {hoveredCell.oi !== undefined && (
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-orange-500">O.I.:</span>
                    <span className="text-slate-200">
                      {parseInt(String(hoveredCell.oi)).toLocaleString(LOCALE)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs font-medium">
            <span className="text-slate-400">Low Activity</span>
            <div className="flex h-5 w-40 gap-px rounded-md overflow-hidden">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => {
                const r = Math.floor(
                  255 * (0.5 + intensity * 0.5)
                );
                const g = Math.floor(
                  153 * (0.3 + intensity * 0.7)
                );
                const b = Math.floor(
                  51 * (0.2 + intensity * 0.8)
                );
                return (
                  <div
                    key={intensity}
                    className="flex-1 border border-slate-500"
                    style={{
                      backgroundColor: `rgba(${r}, ${g}, ${b}, ${0.4 + intensity * 0.6})`,
                    }}
                  />
                );
              })}
            </div>
            <span className="text-orange-500 font-semibold">High Activity</span>
          </div>
        </CardBody>
      </Card>
    );
  }
);

MarketHeatmap.displayName = "MarketHeatmap";
