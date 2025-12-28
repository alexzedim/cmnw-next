"use client";

import { FC, useState, MouseEvent } from "react";
import { Card } from "@tremor/react";
import useSWR from "swr";
import { Spinner } from "@heroui/react";

import { DOMAINS } from "@/constants";

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
  isXrs?: boolean;
  hasContracts?: boolean;
}

const getHeatColor = (value: number, max: number): string => {
  if (value === 0) return "rgba(167,167,167,0.05)";

  const intensity = Math.min(value / max, 1);
  const opacity = 0.1 + intensity * 0.9;

  return `rgba(167,167,167,${opacity})`;
};

const formatAxisLabel = (value: string | number): string => {
  if (typeof value === "number") {
    return new Date(value).toLocaleString("ru-RU", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return String(value);
};

export const MarketHeatmap: FC<MarketHeatmapProps> = ({
  id,
  isCommdty = false,
  isGold = false,
  hasContracts = false,
}) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapDataPoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Render heatmap for commodity items, gold items, or items with contracts
  const shouldShowChart = isCommdty || isGold || hasContracts;
  if (!shouldShowChart) return null;

  const { data, error, isLoading } = useSWR<HeatmapResponse>(
    `${DOMAINS.domain}/api/dma/item/chart?id=${id}`,
    (url: string) => fetch(url).then((r) => r.json())
  );

  console.log(data);

  if (error) return null;
  if (isLoading)
    return (
      <Card className="m-4 p-8 flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </Card>
    );

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
    <Card className="m-4 p-4 relative">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Grid Container */}
          <div
            className="grid gap-[1px] bg-gray-200"
            style={{
              gridTemplateColumns: `100px repeat(${data.xAxis.length}, minmax(60px, 1fr))`,
            }}
          >
            {/* Top-left corner cell */}
            <div className="bg-gray-100 p-2 font-semibold text-xs sticky left-0 z-20" />

            {/* X-axis labels */}
            {data.xAxis.map((xLabel, i) => (
              <div
                key={`x-${i}`}
                className="bg-gray-100 p-2 text-xs font-medium text-center truncate"
                title={formatAxisLabel(xLabel)}
              >
                {formatAxisLabel(xLabel)}
              </div>
            ))}

            {/* Y-axis and data cells */}
            {data.yAxis.map((yLabel, yIndex) => (
              <>
                {/* Y-axis label */}
                <div
                  key={`y-${yIndex}`}
                  className="bg-gray-100 p-2 text-xs font-medium text-right sticky left-0 z-10"
                >
                  {yLabel}
                </div>

                {/* Data cells */}
                {data.xAxis.map((_, xIndex) => {
                  const point = dataMap.get(`${xIndex}-${yIndex}`);
                  const value = point?.value || 0;
                  const bgColor = getHeatColor(value, maxValue);

                  return (
                    <div
                      key={`cell-${xIndex}-${yIndex}`}
                      className="p-2 text-xs font-medium text-center cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:z-30 relative"
                      style={{ backgroundColor: bgColor }}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={(e) => point && handleMouseMove(e, point)}
                    >
                      {value > 0 && (
                        <span className="text-gray-800">
                          {value.toLocaleString("ru-RU")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg pointer-events-none max-w-xs"
          style={{
            left: mousePosition.x + 15,
            top: mousePosition.y + 15,
          }}
        >
          <div className="space-y-1">
            <div>
              <strong>Time:</strong>{" "}
              {formatAxisLabel(data.xAxis[hoveredCell.x])}
            </div>
            <div>
              <strong>Price:</strong> {data.yAxis[hoveredCell.y]}
            </div>
            <div>
              <strong>Quantity:</strong>{" "}
              {hoveredCell.value.toLocaleString("ru-RU")}
            </div>
            {hoveredCell.orders !== undefined && (
              <div>
                <strong>Orders:</strong> {hoveredCell.orders}
              </div>
            )}
            {hoveredCell.oi !== undefined && (
              <div>
                <strong>Open Interest:</strong>{" "}
                {parseInt(String(hoveredCell.oi)).toLocaleString("ru-RU")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs">
        <span className="text-gray-600">Low</span>
        <div className="flex h-4 w-32">
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
            <div
              key={i}
              className="flex-1"
              style={{
                backgroundColor: `rgba(167,167,167,${0.1 + intensity * 0.9})`,
              }}
            />
          ))}
        </div>
        <span className="text-gray-600">High</span>
      </div>
    </Card>
  );
};
