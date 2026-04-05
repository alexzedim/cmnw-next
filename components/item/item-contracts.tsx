"use client";

import { useMemo, memo, useState, useCallback } from "react";
import {
  Card,
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

import { useContracts } from "@/lib/api/hooks";
import { BadgeSection } from "@/components/shared/badge-section";
import {
  CARD_CLASS_NAMES,
  BADGE_COLORS,
  formatNumber,
  LOCALE,
} from "@/components/item/constants";

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

const PERIOD_OPTIONS = ["1d", "24h", "1w", "30d", "1m"] as const;

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

    // If timestamp looks like seconds (less than year 2100 in seconds), convert to milliseconds
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

/**
 * Loading State Component
 */
const ItemContractsLoading = memo(() => (
  <Card className={CARD_CLASS_NAMES.root}>
    <Card.Content className={CARD_CLASS_NAMES.body}>
      <BadgeSection color={BADGE_COLORS.DEFAULT} label="Contract Data" />
      <div className={`${CARD_CLASS_NAMES.loading} min-h-[300px]`}>
        <Spinner color="warning" size="lg" />
      </div>
    </Card.Content>
  </Card>
));

ItemContractsLoading.displayName = "ItemContractsLoading";

/**
 * Contract Table Component
 */
interface ItemContractsTableProps {
  contracts: Array<{
    id: string;
    timestamp: number;
    price: number;
    priceMedian: number;
    priceTop: number;
    quantity: number;
    openInterest: number;
  }>;
  columns: ContractColumnDef[];
  period: string;
  onPeriodChange: (period: string) => void;
}

const ItemContractsTable = memo(
  ({ contracts, columns, period, onPeriodChange }: ItemContractsTableProps) => (
    <Card className={CARD_CLASS_NAMES.root}>
      <Card.Content className={CARD_CLASS_NAMES.body}>
        <div className="flex items-center justify-between mb-6">
          <BadgeSection color={BADGE_COLORS.DEFAULT} label="Contract Data" />
          <ButtonGroup size="sm" variant="outline">
            {PERIOD_OPTIONS.map((p) => (
              <Button
                key={p}
                className={
                  period === p
                    ? "bg-orange-500 text-white"
                    : "text-orange-500 hover:bg-orange-500/10"
                }
                onClick={() => onPeriodChange(p)}
              >
                {p}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            No contract data available for this period
          </div>
        ) : (
          <Table aria-label="Item contract data">
            <TableHeader className="bg-background border-b border-divider">
              {columns.map((column) => (
                <TableColumn
                  key={column.key}
                  className="text-foreground font-semibold"
                >
                  {column.label}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody items={contracts}>
              {(contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="text-orange-500 font-medium">
                    {formatTimestamp(contract.timestamp)}
                  </TableCell>
                  <TableCell className="text-orange-500 font-medium">
                    {formatNumber(contract.price)}
                  </TableCell>
                  <TableCell className="text-orange-500 font-medium">
                    {formatNumber(contract.priceMedian)}
                  </TableCell>
                  <TableCell className="text-orange-500 font-medium">
                    {formatNumber(contract.priceTop)}
                  </TableCell>
                  <TableCell className="text-orange-500 font-medium">
                    {formatNumber(contract.quantity)}
                  </TableCell>
                  <TableCell className="text-orange-500 font-medium text-center">
                    <div className="text-right inline-block tabular-nums">
                      {formatNumber(Math.floor(contract.openInterest))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card.Content>
    </Card>
  )
);

ItemContractsTable.displayName = "ItemContractsTable";

/**
 * ItemContracts Component
 *
 * Displays contract data for items with hasContracts flag.
 * Shows price levels, quantities, and open interest data.
 * Includes period selector for different time ranges.
 *
 * @example
 * <ItemContracts id="12345" />
 */
export const ItemContracts = memo(({ id }: ItemContractsProps) => {
  const [period, setPeriod] = useState<string>("1d");
  const { data, error, isLoading } = useContracts(id, period);
  // Memoize columns definition
  const columns = useMemo<ContractColumnDef[]>(
    () => [
      { key: "timestamp", label: "Date/Time" },
      { key: "price", label: "Price, ₘ₁ₙ" },
      { key: "priceMedian", label: "Median, ⁵⁰⁄₁₀₀" },
      { key: "priceTop", label: "Top, ⁹⁸⁄₁₀₀" },
      { key: "quantity", label: "Quantity" },
      { key: "openInterest", label: "Open Interest" },
    ],
    []
  );

  const handlePeriodChange = useCallback((newPeriod: string) => {
    setPeriod(newPeriod);
  }, []);

  // Error state - return null (silent failure following project pattern)
  if (error) return null;

  // Loading state
  if (isLoading) return <ItemContractsLoading />;

  // Empty state - no contracts available
  if (!data?.contracts?.length) return null;

  // Render table with contracts
  return (
    <ItemContractsTable
      columns={columns}
      contracts={data.contracts}
      period={period}
      onPeriodChange={handlePeriodChange}
    />
  );
});

ItemContracts.displayName = "ItemContracts";
