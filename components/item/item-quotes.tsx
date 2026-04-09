"use client";

import { useMemo, memo } from "react";
import {
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";

import { useItemQuotes } from "@/lib/api/hooks";
import { BadgeSection } from "@/components/shared/badge-section";
import {
  CARD_CLASS_NAMES,
  BADGE_COLORS,
  formatNumber,
} from "@/components/item/constants";

interface ItemQuotesProps {
  /** Item ID to fetch quotes for */
  id: number | string;
  /** Whether the item is a gold token (sets seller count label) */
  isGold?: boolean;
}

/**
 * Quote row column type definition
 */
type QuoteColumn = "price" | "quantity" | "openInterest" | "size";

interface QuoteColumnDef {
  key: QuoteColumn;
  label: string;
}

/**
 * Loading State Component
 */
const ItemQuotesLoading = memo(() => (
  <Card className={CARD_CLASS_NAMES.root}>
    <Card.Content className={CARD_CLASS_NAMES.body}>
      <BadgeSection color={BADGE_COLORS.QUOTES} label="Market Quotes" />
      <div className={`${CARD_CLASS_NAMES.loading} min-h-[300px]`}>
        <Spinner color="warning" size="lg" />
      </div>
    </Card.Content>
  </Card>
));

ItemQuotesLoading.displayName = "ItemQuotesLoading";

/**
 * Quote Table Component
 */
interface ItemQuotesTableProps {
  quotes: Array<{
    price: number;
    quantity: number;
    openInterest: number;
    size: number;
  }>;
  columns: QuoteColumnDef[];
}

const ItemQuotesTable = memo(({ quotes, columns }: ItemQuotesTableProps) => (
  <Card className={CARD_CLASS_NAMES.root}>
    <Card.Content className={CARD_CLASS_NAMES.body}>
      <BadgeSection color={BADGE_COLORS.QUOTES} label="Market Quotes" />
      <Table aria-label="Item market price quotes">
        <TableHeader className="bg-background border-b border-divider">
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              className="py-3 text-foreground font-semibold"
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody items={quotes}>
          {(quote) => (
            <TableRow key={`${quote.price}-${quote.quantity}`}>
              <TableCell className="text-[var(--primary)] font-medium">
                {formatNumber(quote.price)}
              </TableCell>
              <TableCell className="text-[var(--primary)] font-medium">
                {formatNumber(quote.quantity)}
              </TableCell>
              <TableCell className="text-[var(--primary)] font-medium">
                {formatNumber(quote.openInterest)}
              </TableCell>
              <TableCell className="text-[var(--primary)] font-medium">
                {quote.size}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card.Content>
  </Card>
));

ItemQuotesTable.displayName = "ItemQuotesTable";

/**
 * ItemQuotes Component
 *
 * Displays real-time market quotes for an item across different prices and quantities.
 * Shows seller counts for gold tokens. XRS items are filtered out and return null.
 *
 * @example
 * <ItemQuotes id="12345" isGold={false} />
 */
export const ItemQuotes = memo(({ id, isGold = false }: ItemQuotesProps) => {
  const { data, error, isLoading } = useItemQuotes(id);

  // Memoize columns definition
  const columns = useMemo<QuoteColumnDef[]>(
    () => [
      { key: "price", label: "Price" },
      { key: "quantity", label: "Quantity" },
      { key: "openInterest", label: "Open Interest" },
      { key: "size", label: isGold ? "Sellers" : "Orders" },
    ],
    [isGold]
  );

  // Error state - return null (silent failure following project pattern)
  if (error) return null;

  // Loading state
  if (isLoading) return <ItemQuotesLoading />;

  // Empty state - no quotes available
  if (!data?.quotes?.length) return null;

  // Render table with quotes
  return <ItemQuotesTable columns={columns} quotes={data.quotes} />;
});

ItemQuotes.displayName = "ItemQuotes";
