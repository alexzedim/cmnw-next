"use client";

import { FC, Fragment } from "react";
import useSWR from "swr";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardBody, Spinner } from "@heroui/react";
import { DOMAINS } from "@/lib/constants";

// Initialize Highcharts modules
if (typeof window !== "undefined") {
  require("highcharts/modules/heatmap")(Highcharts);
  require("highcharts/modules/exporting")(Highcharts);
}

interface ClusterChartProps {
  id: number | string;
  is_commdty?: boolean;
  is_gold?: boolean;
  is_xrs?: boolean;
}

interface chartResponse {
  xAxis: (string | number)[];
  yAxis: string[];
  dataset: any[];
}

export const ClusterChart: FC<ClusterChartProps> = ({ id, is_commdty = false }) => {
  if (!is_commdty) return null;

  const { data, error, isLoading } = useSWR<chartResponse>(
    `${DOMAINS.domain}/api/dma/item/chart?_id=${id}`,
    (url: string) => fetch(url).then((r) => r.json()),
  );

  if (error) return null;
  if (isLoading) return (
    <Card className="m-4">
      <CardBody className="p-8 border-[15px] border-white rounded-xl flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </CardBody>
    </Card>
  );

  if (!data) return null;

  return (
    <Card className="m-4">
      <CardBody className="p-4 border-[15px] border-gray-400 rounded-xl">
        <HighchartsReact
        constructorType={"chart"}
        highcharts={Highcharts}
        options={{
          chart: {
            type: "heatmap",
            plotBorderWidth: 1,
            height: (9 / 16) * 100 + "%",
            backgroundColor: "transparent",
            style: {
              letterSpacing: "unset",
              paddingRight: "16px",
            },
          },
          title: {
            text: undefined,
          },
          xAxis: {
            categories: data.xAxis,
            labels: {
              formatter: function (this: any): string {
                if (typeof this.value === "number")
                  return new Date(this.value).toLocaleString("ru-RU");

                return String(this.value);
              },
            },
          },
          yAxis: {
            categories: data.yAxis,
            tickLength: 150,
            opposite: false,
            title: null,
          },
          colorAxis: {
            min: 0,
            minColor: "rgba(167,167,167,0.1)",
            maxColor: "rgba(167,167,167,1)",
          },
          legend: {
            align: "right",
            layout: "vertical",
            margin: 0,
            verticalAlign: "middle",
            y: 25,
            symbolHeight: 350,
          },
          tooltip: {
            formatter: function (this: any): string {
              return `${typeof this.series.xAxis.categories[this.point.x] === "number" ? new Date(this.series.xAxis.categories[this.point.x]).toLocaleString("ru-RU") : this.series.xAxis.categories[this.point.x]}<br>Quantity: ${this.point.value.toLocaleString("ru-RU")}<br>Price: ${this.series.yAxis.categories[this.point.y]}<br>Orders: ${this.point.orders}<br>Open Interest: ${parseInt(this.point.oi).toLocaleString("ru-RU")}`;
            },
          },
          series: [
            {
              borderWidth: 0,
              clip: false,
              data: data.dataset,
              dataLabels: {
                enabled: true,
                crop: true,
                shadow: true,
                formatter: function (this: any): string | undefined {
                  if (this.point.value !== 0) {
                    return this.point.value.toLocaleString("ru-RU");
                  }
                  return undefined;
                },
                style: {
                  fontFamily: "Fira Sans",
                  color: "#242424",
                  fontSize: "16px",
                  fontWeight: "normal",
                  textOutline: "0px",
                },
              },
            },
          ],
        }}
        />
      </CardBody>
    </Card>
  );
};
