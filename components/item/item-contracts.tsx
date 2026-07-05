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
  ({ contracts, columns, period, onPeriodChange }: ItemContractsTableProps) => {
    const { dict } = useI18n();
    const ic = dict.itemContracts;

    return (
      <Card className={CARD_CLASS_NAMES.root}>
        <CardContent className={CARD_CLASS_NAMES.body}>
          <div className="flex items-center justify-between mb-6">
            <BadgeSection color={BADGE_COLORS.DEFAULT} label={ic.badge} />
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

          {contracts.length === 0 ? (
            <div className="text-center text-muted py-8">{ic.noData}</div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    );
  }
);

ItemContractsTable.displayName = "ItemContractsTable";

export const ItemContracts = memo(({ id }: ItemContractsProps) => {
  const [period, setPeriod] = useState<string>("1d");
  const { dict } = useI18n();
  const ic = dict.itemContracts;
  const { data, error, isLoading } = useContracts(id, period);

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

  const handlePeriodChange = useCallback((newPeriod: string) => {
    setPeriod(newPeriod);
  }, []);

  if (error) return null;

  if (isLoading) return <ItemContractsLoading />;

  if (!data?.contracts?.length) return null;

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
