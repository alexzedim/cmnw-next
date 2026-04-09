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
import { Card, Spinner } from "@heroui/react";
import useSWR from "swr";

import { ENDPOINTS, NAMING_CONSTANTS } from "@/constants";
import { BadgeSection } from "@/components/shared/badge-section";
import {
  CARD_CLASS_NAMES,
  BADGE_COLORS,
  LOCALE,
} from "@/components/item/constants";
import { useI18n } from "@/lib/i18n/context";

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

const getHeatColor = (value: number, max: number): string => {
  if (value === 0 || max === 0) return "var(--heatmap-empty)";

  const intensity = Math.min(value / max, 1);
  const r = Math.floor(157 + (221 - 157) * (1 - intensity));
  const g = Math.floor(113 + (178 - 113) * (1 - intensity));
  const b = Math.floor(66 + (119 - 66) * (1 - intensity));

  return `rgba(${r}, ${g}, ${b}, ${0.4 + intensity * 0.6})`;
};

const getTextColorByIntensity = (value: number, max: number): string => {
  if (value === 0 || max === 0) return "#ffffff";

  const intensity = Math.min(value / max, 1);

  return intensity > 0.5 ? "#000000" : "#ffffff";
};

const formatTimestampHeader = (value: string | number): string => {
  if (typeof value !== "number") return String(value);

  const date = new Date(value);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${day}.${month}`;
};

const formatTimestampXAxis = (value: string | number): string => {
  if (typeof value !== "number") return String(value);

  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

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

const MarketHeatmapLoading = memo(() => {
  const { dict } = useI18n();

  return (
    <Card className={CARD_CLASS_NAMES.root}>
      <Card.Content className={CARD_CLASS_NAMES.body}>
        <BadgeSection
          color={BADGE_COLORS.DEFAULT}
          label={dict.marketHeatmap.badge}
        />
        <div className={`${CARD_CLASS_NAMES.loading} min-h-[400px]`}>
          <Spinner color="warning" size="lg" />
        </div>
      </Card.Content>
    </Card>
  );
});

MarketHeatmapLoading.displayName = "MarketHeatmapLoading";

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
    const { dict } = useI18n();
    const mh = dict.marketHeatmap;

    const shouldShowChart = isCommdty || isGold || hasContracts;

    if (!shouldShowChart) return null;

    const { data, error, isLoading } = useSWR<HeatmapResponse>(
      `${ENDPOINTS.API}/api/dma/item/chart?id=${id}`,
      (url: string) => fetch(url).then((r) => r.json())
    );

    useEffect(() => {
      if (scrollContainerRef.current && data) {
        scrollContainerRef.current.scrollLeft =
          scrollContainerRef.current.scrollWidth;
      }
    }, [data]);

    if (error) return null;

    if (isLoading) return <MarketHeatmapLoading />;

    if (!data || !data.dataset.length) return null;

    const maxValue = Math.max(...data.dataset.map((d) => d.value));

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
        <div className="mb-6">
          <BadgeSection
            color={BADGE_COLORS.DEFAULT}
            label={NAMING_CONSTANTS.MARKET_VOLUME_ALLOCATION}
          />
        </div>

        <div className="w-screen relative left-[calc(-50vw+50%)] bg-background px-4 md:px-6 lg:px-8">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto bg-background"
          >
            <div className="inline-block min-w-full">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `minmax(80px, auto) repeat(${data.xAxis.length}, minmax(70px, 1fr)) minmax(80px, auto)`,
                  borderSpacing: "0",
                  backgroundColor: "var(--heatmap-bg)",
                }}
              >
                <div
                  className="text-xs font-semibold text-muted sticky left-0 z-20"
                  style={{
                    backgroundColor: "var(--heatmap-bg)",
                    padding: "12px 8px",
                  }}
                />
                {data.xAxis.map((xLabel, i) => (
                  <div
                    key={`header-${i}`}
                    className="text-xs font-semibold text-foreground/60 text-center"
                    style={{
                      backgroundColor: "var(--heatmap-bg)",
                      padding: "12px 4px",
                    }}
                    title={formatTimestampHeader(xLabel)}
                  >
                    {formatTimestampHeader(xLabel)}
                  </div>
                ))}
                <div
                  className="text-xs font-semibold text-slate-500 sticky right-0 z-20"
                  style={{
                    backgroundColor: "var(--heatmap-bg)",
                    padding: "12px 8px",
                  }}
                />

                {[...data.yAxis].reverse().map((yLabel, reversedIndex) => {
                  const yIndex = data.yAxis.length - 1 - reversedIndex;

                  return (
                    <Fragment key={`row-${yIndex}`}>
                      <div
                        key={`y-${yIndex}`}
                        className="flex items-center justify-center text-xs font-semibold text-[var(--primary)] sticky left-0 z-10"
                        style={{
                          backgroundColor: "var(--heatmap-bg)",
                          paddingLeft: "8px",
                          paddingRight: "8px",
                          paddingTop: "8px",
                          paddingBottom: "8px",
                        }}
                      >
                        {parseFloat(yLabel).toFixed(2)}
                      </div>

                      {data.xAxis.map((_, xIndex) => {
                        const point = dataMap.get(`${xIndex}-${yIndex}`);
                        const value = point?.value || 0;
                        const bgColor =
                          value > 0
                            ? getHeatColor(value, maxValue)
                            : "var(--heatmap-bg)";
                        const textColor = getTextColorByIntensity(
                          value,
                          maxValue
                        );
                        const cellPrice = point
                          ? parseFloat(
                              formatPrice(
                                data.yAxis[yIndex],
                                point.value,
                                point.oi
                              )
                            )
                          : 0;
                        const axisPrice = parseFloat(yLabel);
                        const showUpArrow = cellPrice > axisPrice * 1.04;

                        return (
                          <div
                            key={`cell-${xIndex}-${yIndex}`}
                            className="relative text-center text-xs font-semibold transition-all duration-150 hover:ring-2 hover:ring-[var(--primary)] hover:z-30 cursor-pointer"
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
                                {showUpArrow && <span> +</span>}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      <div
                        className="flex items-center justify-center text-xs font-semibold text-[var(--primary)] sticky right-0 z-10"
                        style={{
                          backgroundColor: "var(--heatmap-bg)",
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

                <div
                  className="text-xs font-semibold text-muted sticky left-0 z-20"
                  style={{
                    backgroundColor: "var(--heatmap-bg)",
                    padding: "12px 8px",
                  }}
                />
                {data.xAxis.map((xLabel, i) => (
                  <div
                    key={`x-${i}`}
                    className="text-xs font-semibold text-foreground/60 text-center"
                    style={{
                      backgroundColor: "var(--heatmap-bg)",
                      padding: "12px 4px",
                    }}
                    title={formatTimestampHeader(xLabel)}
                  >
                    {formatTimestampXAxis(xLabel)}
                  </div>
                ))}
                <div
                  className="text-xs font-semibold text-slate-500 sticky right-0 z-20"
                  style={{
                    backgroundColor: "var(--heatmap-bg)",
                    padding: "12px 8px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {hoveredCell && (
          <div
            className="fixed z-50 text-foreground text-xs p-4 rounded-lg shadow-xl dark:shadow-none pointer-events-none max-w-xs border border-[var(--primary)]/30 backdrop-blur"
            style={{
              backgroundColor: "var(--tremor-bg)",
              left: mousePosition.x + 15,
              top: mousePosition.y + 15,
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-[var(--primary)]">
                  {mh.date}
                </span>
                <span className="text-foreground">
                  {formatTimestampHeader(data.xAxis[hoveredCell.x])}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-[var(--primary)]">
                  {mh.time}
                </span>
                <span className="text-foreground">
                  {formatTimestampXAxis(data.xAxis[hoveredCell.x])}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-[var(--primary)]">
                  {hoveredCell.y === data.yAxis.length - 1
                    ? mh.priceAvg
                    : mh.price}
                </span>
                <span className="text-foreground">
                  {formatPrice(
                    data.yAxis[hoveredCell.y],
                    hoveredCell.value,
                    hoveredCell.oi
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-[var(--primary)]">
                  {mh.quantity}
                </span>
                <span className="text-[var(--accent)] font-semibold">
                  {hoveredCell.value.toLocaleString(LOCALE)}
                </span>
              </div>
              {hoveredCell.orders !== undefined && (
                <div className="flex justify-between gap-2 pt-1 border-t border-[var(--primary)]/20">
                  <span className="font-semibold text-[var(--primary)]">
                    {mh.orders}
                  </span>
                  <span className="text-foreground">{hoveredCell.orders}</span>
                </div>
              )}
              {hoveredCell.oi !== undefined && (
                <div className="flex justify-between gap-2">
                  <span className="font-semibold text-[var(--primary)]">
                    {mh.openInterest}
                  </span>
                  <span className="text-foreground">
                    {parseInt(String(hoveredCell.oi)).toLocaleString(LOCALE)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 pb-8 flex items-center justify-center gap-4 text-xs font-medium">
          <span className="text-muted">{mh.lowActivity}</span>
          <div
            className="flex h-5 w-40 gap-px rounded overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, idx) => {
              const r = Math.floor(157 + (221 - 157) * (1 - intensity));
              const g = Math.floor(113 + (178 - 113) * (1 - intensity));
              const b = Math.floor(66 + (119 - 66) * (1 - intensity));

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
          <span className="text-[var(--primary)] font-semibold">
            {mh.highActivity}
          </span>
        </div>
      </>
    );
  }
);

MarketHeatmap.displayName = "MarketHeatmap";
