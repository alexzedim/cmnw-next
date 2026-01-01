export type chartResponse = {
  readonly yAxis: number[] | string[];
  readonly xAxis: (number | string)[];
  readonly dataset: Array<{
    x: number;
    y: number;
    orders: number;
    value: number;
    oi: number;
  }>;
};
