"use client";

import { useMemo, memo, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  ButtonGroup,
} from "@heroui/react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import dayjs from "dayjs";

import { useContracts } from "@/lib/api/hooks";
import { BadgeSection } from "@/components/shared/badge-section";
import {
  CARD_CLASS_NAMES,
  BADGE_COLORS,
  formatNumber,
  LOCALE,
} from "@/components/item/constants";
import { useI18n } from "@/lib/i18n/context";

interface ItemContractsProps {
  id: number | string;
}

type ContractColumn =
  | "timestamp"
  | "price"
  | "priceMedian"
  | "priceTop"
  | "quantity"
  | "openInterest";

interface ContractColumnDef {
  key: ContractColumn;
  label: string;
}

type DailyColumn = "day" | "open" | "close" | "min" | "max" | "volume";

interface DailyColumnDef {
  key: DailyColumn;
  label: string;
}

type DailyRow = {
  id: string;
  day: string;
  open: number;
  close: number;
  min: number;
  max: number;
  volume: number;
};

/**
 * UI period → API period.
 *
 * The backend still accepts the legacy 1d/1w/1m tokens; we expose a cleaner
 * three-option taxonomy to the user. "Intraday" maps to the hourly 1d feed
 * (the rows shown hour-to-hour); 1W/1M keep their API semantics.
 */
type PeriodKey = "intraday" | "1w" | "1m";

const PERIOD_OPTIONS: ReadonlyArray<{ key: PeriodKey; labelKey: string }> = [
  { key: "intraday", labelKey: "periodIntraday" },
  { key: "1w", labelKey: "period1w" },
  { key: "1m", labelKey: "period1m" },
];

const PERIOD_TO_API: Record<PeriodKey, string> = {
  intraday: "1d",
  "1w": "1w",
  "1m": "1m",
};

type ViewKey = "chart" | "table";

const VIEW_OPTIONS: ReadonlyArray<{ key: ViewKey; labelKey: string }> = [
  { key: "chart", labelKey: "viewChart" },
  { key: "table", labelKey: "viewTable" },
];

const formatTimestamp = (timestamp: number | string): string => {
  try {
    let ts: number;

    if (typeof timestamp === "string") {
      ts = parseInt(timestamp, 10);
      if (isNaN(ts)) {
        return "Invalid Date";
      }
    } else {
      ts = timestamp;
    }

    if (ts > 0 && ts < 4102444800) {
      ts = ts * 1000;
    }

    const date = new Date(ts);
    const timeVal = date.getTime();

    if (isNaN(timeVal) || timeVal < 0) {
      return "Invalid Date";
    }

    const timeStr = date.toLocaleString(LOCALE, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const dateStr = date.toLocaleString(LOCALE, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return `${timeStr} ${dateStr}`;
  } catch (error) {
    console.error("Error formatting timestamp:", timestamp, error);

    return "Invalid Date";
  }
};

interface Contract {
  id: string;
  timestamp: number | string;
  price: number;
  priceMedian: number;
  priceTop: number;
  quantity: number;
  openInterest: number;
  day: number;
  month: number;
  year: number;
}

/**
 * Aggregate raw per-hour contracts into one row per calendar day.
 * - open  = first contract's price of the day
 * - close = last contract's price of the day
 * - min   = lowest price (min) seen that day
 * - max   = highest priceTop seen that day
 * - volume= sum of quantity
 *
 * Used by the Bar / Area / daily-Table renderers for the 1W and 1M periods,
 * where the raw feed has too many rows (1W=211, 1M=800) for a flat table.
 */
const aggregateByDay = (contracts: Contract[]): DailyRow[] => {
  const buckets = new Map<
    string,
    {
      ts: number;
      open: number;
      close: number;
      min: number;
      max: number;
      volume: number;
      medianSum: number;
      count: number;
    }
  >();

  for (const c of contracts) {
    const tsRaw =
      typeof c.timestamp === "string" ? parseInt(c.timestamp, 10) : c.timestamp;
    const ts = tsRaw > 0 && tsRaw < 4102444800 ? tsRaw * 1000 : tsRaw;
    const dayKey = dayjs(ts).format("YYYY-MM-DD");
    const existing = buckets.get(dayKey);

    if (existing) {
      if (ts < existing.ts) {
        existing.ts = ts;
        existing.open = c.price;
      }
      if (ts >= existing.ts || existing.close === undefined) {
        existing.close = c.price;
      }
      existing.min = Math.min(existing.min, c.price);
      existing.max = Math.max(existing.max, c.priceTop);
      existing.volume += c.quantity;
      existing.medianSum += c.priceMedian;
      existing.count += 1;
    } else {
      buckets.set(dayKey, {
        ts,
        open: c.price,
        close: c.price,
        min: c.price,
        max: c.priceTop,
        volume: c.quantity,
        medianSum: c.priceMedian,
        count: 1,
      });
    }
  }

  return Array.from(buckets.entries())
    .map(([dayKey, agg], idx) => ({
      id: `${dayKey}-${idx}`,
      day: dayjs(dayKey).format("DD.MM"),
      open: agg.open,
      close: agg.close,
      min: agg.min,
      max: agg.max,
      volume: agg.volume,
    }))
    .sort((a, b) => a.day.localeCompare(b.day));
};

const ItemContractsLoading = memo(() => {
  const { dict } = useI18n();

  return (
    <Card className={CARD_CLASS_NAMES.root}>
      <CardContent className={CARD_CLASS_NAMES.body}>
        <BadgeSection
          color={BADGE_COLORS.DEFAULT}
          label={dict.itemContracts.badge}
        />
        <div className={`${CARD_CLASS_NAMES.loading} min-h-[300px]`}>
          <Spinner color="warning" size="lg" />
        </div>
      </CardContent>
    </Card>
  );
});

ItemContractsLoading.displayName = "ItemContractsLoading";

interface PeriodToggleProps {
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
}

const PeriodToggle = ({ period, onPeriodChange }: PeriodToggleProps) => {
  const { dict } = useI18n();
  const ic = dict.itemContracts;

  return (
    <ButtonGroup size="sm" variant="outline">
      {PERIOD_OPTIONS.map((opt) => (
        <Button
          key={opt.key}
          className={
            period === opt.key
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "text-[var(--primary)] hover:bg-[color-mix(in_oklab,var(--primary),transparent_90%)]"
          }
          onClick={() => onPeriodChange(opt.key)}
        >
          {ic[opt.labelKey as keyof typeof ic] as string}
        </Button>
      ))}
    </ButtonGroup>
  );
};

interface ViewToggleProps {
  view: ViewKey;
  onViewChange: (v: ViewKey) => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  const { dict } = useI18n();
  const ic = dict.itemContracts;

  return (
    <ButtonGroup size="sm" variant="outline">
      {VIEW_OPTIONS.map((opt) => (
        <Button
          key={opt.key}
          className={
            view === opt.key
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "text-[var(--primary)] hover:bg-[color-mix(in_oklab,var(--primary),transparent_90%)]"
          }
          onClick={() => onViewChange(opt.key)}
        >
          {ic[opt.labelKey as keyof typeof ic] as string}
        </Button>
      ))}
    </ButtonGroup>
  );
};

interface IntradayTableProps {
  contracts: Contract[];
  columns: ContractColumnDef[];
}

const IntradayTable = ({ contracts, columns }: IntradayTableProps) => {
  const { dict } = useI18n();
  const ic = dict.itemContracts;

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label={ic.tableAriaLabel}>
          <TableHeader className="bg-background border-b border-divider">
            {columns.map((column) => (
              <TableColumn
                key={column.key}
                className="py-3 text-foreground font-semibold"
                id={column.key}
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody items={contracts}>
            {(contract) => (
              <TableRow id={contract.id}>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatTimestamp(contract.timestamp)}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatNumber(contract.price)}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatNumber(contract.priceMedian)}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatNumber(contract.priceTop)}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatNumber(contract.quantity)}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium text-center">
                  <div className="text-right inline-block tabular-nums">
                    {formatNumber(Math.floor(contract.openInterest))}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};

interface DailyChartProps {
  rows: DailyRow[];
}

/**
 * Daily combo chart — recharts ComposedChart.
 *
 * Two Y-axes because price (~4) and volume (~50M) live on wildly different
 * scales: left axis = price (lines for Open / Close / Min), right axis =
 * volume (Bars). Bars render first so lines paint on top of them. All four
 * series carry a `name` so the Legend and Tooltip show labelled rows for
 * every datapoint.
 */
const DailyComboChart = ({ rows }: DailyChartProps) => {
  const { dict } = useI18n();
  const ic = dict.itemContracts;

  const data = useMemo(
    () =>
      rows.map((r) => ({
        day: r.day,
        [ic.columnOpen]: r.open,
        [ic.columnClose]: r.close,
        [ic.columnMin]: r.min,
        [ic.columnVolume]: r.volume,
      })),
    [rows, ic]
  );

  if (!data.length) {
    return <div className="text-center text-muted py-8">{ic.noData}</div>;
  }

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 24, left: 0 }}
        >
          <CartesianGrid horizontal={false} stroke="var(--border)" />
          <XAxis
            dataKey="day"
            stroke="var(--text-muted, #94a3b8)"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            orientation="left"
            stroke="var(--text-muted, #94a3b8)"
            tick={{ fontSize: 12 }}
            tickLine={false}
            width={65}
            yAxisId="price"
          />
          <YAxis
            orientation="right"
            stroke="var(--text-muted, #94a3b8)"
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => formatNumber(v)}
            tickLine={false}
            width={70}
            yAxisId="volume"
          />
          <Tooltip
            formatter={(value, name) => [
              formatNumber(Number(value)),
              String(name),
            ]}
            labelFormatter={(label) => `${ic.columnDay}: ${label}`}
          />
          <Legend height={36} iconType="line" verticalAlign="bottom" />
          <Bar
            dataKey={ic.columnVolume}
            fill="var(--primary)"
            name={ic.columnVolume}
            opacity={0.25}
            yAxisId="volume"
          />
          <Line
            dataKey={ic.columnOpen}
            dot={false}
            name={ic.columnOpen}
            stroke="var(--chart-open, #22c55e)"
            strokeWidth={2}
            yAxisId="price"
          />
          <Line
            dataKey={ic.columnClose}
            dot={false}
            name={ic.columnClose}
            stroke="var(--chart-close, #f97316)"
            strokeWidth={2}
            yAxisId="price"
          />
          <Line
            dataKey={ic.columnMin}
            dot={false}
            name={ic.columnMin}
            stroke="var(--chart-min, #ef4444)"
            strokeWidth={2}
            yAxisId="price"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

interface DailyTableProps {
  rows: DailyRow[];
  columns: DailyColumnDef[];
}

const DailyTable = ({ rows, columns }: DailyTableProps) => {
  if (!rows.length) {
    return null;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Aggregated daily contract data">
          <TableHeader className="bg-background border-b border-divider">
            {columns.map((column) => (
              <TableColumn
                key={column.key}
                className="py-3 text-foreground font-semibold"
                id={column.key}
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody items={rows}>
            {(row) => (
              <TableRow key={row.id}>
                <TableCell className="text-[var(--primary)] font-medium">
                  {row.day}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatNumber(row.open)}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatNumber(row.close)}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatNumber(row.min)}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatNumber(row.max)}
                </TableCell>
                <TableCell className="text-[var(--primary)] font-medium">
                  {formatNumber(row.volume)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};

interface ItemContractsDisplayProps {
  contracts: Contract[];
  columns: ContractColumnDef[];
  dailyColumns: DailyColumnDef[];
  period: PeriodKey;
  view: ViewKey;
  onPeriodChange: (p: PeriodKey) => void;
  onViewChange: (v: ViewKey) => void;
}

const ItemContractsDisplay = ({
  contracts,
  columns,
  dailyColumns,
  period,
  view,
  onPeriodChange,
  onViewChange,
}: ItemContractsDisplayProps) => {
  const { dict } = useI18n();
  const ic = dict.itemContracts;

  const dailyRows = useMemo(() => aggregateByDay(contracts), [contracts]);

  return (
    <Card className={`${CARD_CLASS_NAMES.root} h-full`}>
      <CardContent className={`${CARD_CLASS_NAMES.body} h-full`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-8">
          <BadgeSection color={BADGE_COLORS.DEFAULT} label={ic.badge} />
          <div className="flex items-center gap-2">
            {period !== "intraday" && (
              <ViewToggle view={view} onViewChange={onViewChange} />
            )}
            <PeriodToggle period={period} onPeriodChange={onPeriodChange} />
          </div>
        </div>

        {period === "intraday" ? (
          contracts.length === 0 ? (
            <div className="text-center text-muted py-8">{ic.noData}</div>
          ) : (
            <IntradayTable columns={columns} contracts={contracts} />
          )
        ) : view === "chart" ? (
          <DailyComboChart rows={dailyRows} />
        ) : (
          <DailyTable columns={dailyColumns} rows={dailyRows} />
        )}
      </CardContent>
    </Card>
  );
};

export const ItemContracts = memo(({ id }: ItemContractsProps) => {
  const [period, setPeriod] = useState<PeriodKey>("intraday");
  const [view, setView] = useState<ViewKey>("chart");
  const { dict } = useI18n();
  const ic = dict.itemContracts;
  const { data, error, isLoading } = useContracts(id, PERIOD_TO_API[period]);

  const columns = useMemo<ContractColumnDef[]>(
    () => [
      { key: "timestamp", label: ic.columnDateTime },
      { key: "price", label: ic.columnPrice },
      { key: "priceMedian", label: ic.columnMedian },
      { key: "priceTop", label: ic.columnTop },
      { key: "quantity", label: ic.columnQuantity },
      { key: "openInterest", label: ic.columnOpenInterest },
    ],
    [ic]
  );

  const dailyColumns = useMemo<DailyColumnDef[]>(
    () => [
      { key: "day", label: ic.columnDay },
      { key: "open", label: ic.columnOpen },
      { key: "close", label: ic.columnClose },
      { key: "min", label: ic.columnMin },
      { key: "max", label: ic.columnMax },
      { key: "volume", label: ic.columnVolume },
    ],
    [ic]
  );

  const handlePeriodChange = useCallback((p: PeriodKey) => {
    setPeriod(p);
  }, []);

  const handleViewChange = useCallback((v: ViewKey) => {
    setView(v);
  }, []);

  if (error) return null;

  if (isLoading) return <ItemContractsLoading />;

  if (!data?.contracts?.length) return null;

  return (
    <ItemContractsDisplay
      columns={columns}
      contracts={data.contracts}
      dailyColumns={dailyColumns}
      period={period}
      view={view}
      onPeriodChange={handlePeriodChange}
      onViewChange={handleViewChange}
    />
  );
});

ItemContracts.displayName = "ItemContracts";
