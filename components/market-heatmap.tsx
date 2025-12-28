"use client";

import {
  Fragment,
  FC,
  useState,
  MouseEvent,
  memo,
  useRef,
  useEffect,
} from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import useSWR from "swr";

import { DOMAINS, NAMING_CONSTANTS } from "@/constants";
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
 * Get text color based on activity intensity
 * High activity (intensity > 0.5): black text
 * Low activity (intensity <= 0.5): white text
 */
const getTextColorByIntensity = (value: number, max: number): string => {
  if (value === 0 || max === 0) return "#ffffff";

  const intensity = Math.min(value / max, 1);

  return intensity > 0.5 ? "#000000" : "#ffffff";
};

/**
 * Convert month number to Roman numeral
 */
const toRomanNumeral = (num: number): string => {
  const romanMap = [
    { value: 12, numeral: "XII" },
    { value: 11, numeral: "XI" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 8, numeral: "VIII" },
    { value: 7, numeral: "VII" },
    { value: 6, numeral: "VI" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 3, numeral: "III" },
    { value: 2, numeral: "II" },
    { value: 1, numeral: "I" },
  ];

  let result = "";
  let remaining = num;

  for (const { value, numeral } of romanMap) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
};

/**
 * Format timestamp header with Roman numeral month and date
 */
const formatTimestampHeader = (value: string | number): string => {
  if (typeof value !== "number") return String(value);

  const date = new Date(value);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${day}.${month}`;
};

/**
 * Format timestamp for X-axis (time only - HH:mm)
 */
const formatTimestampXAxis = (value: string | number): string => {
  if (typeof value !== "number") return String(value);

  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

/**
 * Format price: if oi (open interest) is available, divide oi by quantity,
 * otherwise use the priceValue as-is. Always parseFloat and toFixed(2).
 */
const formatPrice = (
  priceValue: string | number,
  quantity?: number,
  oi?: number
): string => {
  let price: number;

  if (oi !== undefined && oi > 0 && quantity !== undefined && quantity > 0) {
    price = oi / quantity;
  } else {
    price = parseFloat(String(priceValue));
  }

  return price.toFixed(2);
};

/**
 * Loading State Component
 */
const MarketHeatmapLoading = memo(() => (
  <Card className={CARD_CLASS_NAMES.root}>
    <CardBody className={CARD_CLASS_NAMES.body}>
      <BadgeSection color={BADGE_COLORS.DEFAULT} label="Market Heatmap" />
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
    const [hoveredCell, setHoveredCell] = useState<HeatmapDataPoint | null>(
      null
    );
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Render heatmap for commodity items, gold items, or items with contracts
    const shouldShowChart = isCommdty || isGold || hasContracts;

    if (!shouldShowChart) return null;

    const { data, error, isLoading } = useSWR<HeatmapResponse>(
      `${DOMAINS.domain}/api/dma/item/chart?id=${id}`,
      (url: string) => fetch(url).then((r) => r.json())
    );
    console.log(data);
    // Scroll to the right to show latest data
    useEffect(() => {
      if (scrollContainerRef.current && data) {
        scrollContainerRef.current.scrollLeft =
          scrollContainerRef.current.scrollWidth;
      }
    }, [data]);

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
      <>
        {/* Badge and title section - normal container */}
        <div className="mb-6">
          <BadgeSection
            color={BADGE_COLORS.DEFAULT}
            label={NAMING_CONSTANTS.MARKET_VOLUME_ALLOCATION}
          />
        </div>

        {/* Full viewport width heatmap container with side margins */}
        <div className="w-screen relative left-[calc(-50vw+50%)] bg-background px-4 md:px-6 lg:px-8">
          {/* Heatmap chart - full viewport width */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto bg-background"
          >
            <div className="inline-block min-w-full">
              {/* Grid Container */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `minmax(80px, auto) repeat(${data.xAxis.length}, minmax(70px, 1fr)) minmax(80px, auto)`,
                  borderSpacing: "0",
                  backgroundColor: "#0a0a0a",
                }}
              >
                {/* Date header row with Roman numerals */}
                <div
                  className="text-xs font-semibold text-slate-500 sticky left-0 z-20"
                  style={{
                    backgroundColor: "#0a0a0a",
                    padding: "12px 8px",
                  }}
                />
                {data.xAxis.map((xLabel, i) => (
                  <div
                    key={`header-${i}`}
                    className="text-xs font-semibold text-slate-400 text-center"
                    style={{
                      backgroundColor: "#0a0a0a",
                      padding: "12px 4px",
                    }}
                    title={formatTimestampHeader(xLabel)}
                  >
                    {formatTimestampHeader(xLabel)}
                  </div>
                ))}
                {/* Right side empty header cell */}
                <div
                  className="text-xs font-semibold text-slate-500 sticky right-0 z-20"
                  style={{
                    backgroundColor: "#0a0a0a",
                    padding: "12px 8px",
                  }}
                />

                {/* Y-axis labels and data cells (reversed for price inversion) */}
                {[...data.yAxis].reverse().map((yLabel, reversedIndex) => {
                  const yIndex = data.yAxis.length - 1 - reversedIndex;

                  return (
                    <Fragment key={`row-${yIndex}`}>
                      {/* Y-axis label (price) */}
                      <div
                        key={`y-${yIndex}`}
                        className="flex items-center justify-center text-xs font-semibold text-orange-500 sticky left-0 z-10"
                        style={{
                          backgroundColor: "#0a0a0a",
                          paddingLeft: "8px",
                          paddingRight: "8px",
                          paddingTop: "8px",
                          paddingBottom: "8px",
                        }}
                      >
                        {parseFloat(yLabel).toFixed(2)}
                      </div>

                      {/* Data cells */}
                      {data.xAxis.map((_, xIndex) => {
                        const point = dataMap.get(`${xIndex}-${yIndex}`);
                        const value = point?.value || 0;
                        const bgColor =
                          value > 0 ? getHeatColor(value, maxValue) : "#0a0a0a";
                        const textColor = getTextColorByIntensity(
                          value,
                          maxValue
                        );

                        return (
                          <div
                            key={`cell-${xIndex}-${yIndex}`}
                            className="relative text-center text-xs font-semibold transition-all duration-150 hover:ring-2 hover:ring-orange-500 hover:z-30 cursor-pointer"
                            style={{
                              backgroundColor: bgColor,
                              padding: "8px 2px",
                            }}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={(e) =>
                              point && handleMouseMove(e, point)
                            }
                          >
                            {value > 0 && (
                              <span style={{ color: textColor }}>
                                {value.toLocaleString(LOCALE)}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {/* Right side Y-axis label (price) */}
                      <div
                        className="flex items-center justify-center text-xs font-semibold text-orange-500 sticky right-0 z-10"
                        style={{
                          backgroundColor: "#0a0a0a",
                          paddingLeft: "8px",
                          paddingRight: "8px",
                          paddingTop: "8px",
                          paddingBottom: "8px",
                        }}
                      >
                        {parseFloat(yLabel).toFixed(2)}
                      </div>
                    </Fragment>
                  );
                })}

                {/* X-axis labels (timestamps) at bottom - time only */}
                <div
                  className="text-xs font-semibold text-slate-500 sticky left-0 z-20"
                  style={{
                    backgroundColor: "#0a0a0a",
                    padding: "12px 8px",
                  }}
                />
                {data.xAxis.map((xLabel, i) => (
                  <div
                    key={`x-${i}`}
                    className="text-xs font-semibold text-slate-400 text-center"
                    style={{
                      backgroundColor: "#0a0a0a",
                      padding: "12px 4px",
                    }}
                    title={formatTimestampHeader(xLabel)}
                  >
                    {formatTimestampXAxis(xLabel)}
                  </div>
                ))}
                {/* Right side empty bottom cell */}
                <div
                  className="text-xs font-semibold text-slate-500 sticky right-0 z-20"
                  style={{
                    backgroundColor: "#0a0a0a",
                    padding: "12px 8px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div
            className="fixed z-50 text-orange-50 text-xs p-4 rounded-lg shadow-xl pointer-events-none max-w-xs border border-orange-500/30 backdrop-blur"
            style={{
              backgroundColor: "#111216",
              left: mousePosition.x + 15,
              top: mousePosition.y + 15,
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-orange-500">Date:</span>
                <span className="text-slate-200">
                  {formatTimestampHeader(data.xAxis[hoveredCell.x])}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-orange-500">
                  Time (HH:mm):
                </span>
                <span className="text-slate-200">
                  {formatTimestampXAxis(data.xAxis[hoveredCell.x])}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-orange-500">Price:</span>
                <span className="text-slate-200">
                  {parseFloat(data.yAxis[hoveredCell.y]).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-orange-500">
                  Quantity:
                </span>
                <span className="text-orange-300 font-semibold">
                  {hoveredCell.value.toLocaleString(LOCALE)}
                </span>
              </div>
              {hoveredCell.orders !== undefined && (
                <div className="flex justify-between gap-2 pt-1 border-t border-orange-500/20">
                  <span className="font-semibold text-orange-500">
                    Orders:
                  </span>
                  <span className="text-slate-200">{hoveredCell.orders}</span>
                </div>
              )}
              {hoveredCell.oi !== undefined && (
                <div className="flex justify-between gap-2">
                  <span className="font-semibold text-orange-500">
                    Open Interest:
                  </span>
                  <span className="text-slate-200">
                    {parseInt(String(hoveredCell.oi)).toLocaleString(LOCALE)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend section */}
        <div className="mt-8 pb-8 flex items-center justify-center gap-4 text-xs font-medium">
          <span className="text-slate-500">Low Activity</span>
          <div
            className="flex h-5 w-40 gap-px rounded overflow-hidden"
            style={{ borderColor: "#2e2c2b" }}
          >
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, idx) => {
              const r = Math.floor(255 * (0.5 + intensity * 0.5));
              const g = Math.floor(153 * (0.3 + intensity * 0.7));
              const b = Math.floor(51 * (0.2 + intensity * 0.8));

              return (
                <div
                  key={intensity}
                  style={{
                    flex: 1,
                    backgroundColor: `rgba(${r}, ${g}, ${b}, ${0.4 + intensity * 0.6})`,
                  }}
                />
              );
            })}
          </div>
          <span className="text-orange-500 font-semibold">High Activity</span>
        </div>
      </>
    );
  }
);

MarketHeatmap.displayName = "MarketHeatmap";
