"use client";

import { useMemo, memo } from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";

import { useItemQuotes } from "@/lib/api/hooks";
import { BadgeSection } from "@/components/shared/BadgeSection";
import {
  CARD_CLASS_NAMES,
  TABLE_CLASS_NAMES,
  BADGE_COLORS,
  formatNumber,
} from "@/components/item/constants";

interface ItemQuotesProps {
  /** Item ID to fetch quotes for */
  id: number | string;
  /** Whether the item is a gold token (sets seller count label) */
  isGold?: boolean;
  /** Whether the item is XRS (cross-realm sale) - returns null if true */
  isXrs?: boolean;
}

/**
 * Quote row column type definition
 */
type QuoteColumn = "price" | "quantity" | "open_interest" | "size";

interface QuoteColumnDef {
  key: QuoteColumn;
  label: string;
}

/**
 * Loading State Component
 */
const ItemQuotesLoading = memo(() => (
  <Card className={CARD_CLASS_NAMES.root}>
    <CardBody className={CARD_CLASS_NAMES.body}>
      <BadgeSection label="Market Quotes" color={BADGE_COLORS.QUOTES} />
      <div className={`${CARD_CLASS_NAMES.loading} min-h-[300px]`}>
        <Spinner color="warning" size="lg" />
      </div>
    </CardBody>
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
    open_interest: number;
    size: number;
  }>;
  isGold: boolean;
  columns: QuoteColumnDef[];
}

const ItemQuotesTable = memo(
  ({ quotes, isGold, columns }: ItemQuotesTableProps) => (
    <Card className={CARD_CLASS_NAMES.root}>
      <CardBody className={CARD_CLASS_NAMES.body}>
        <BadgeSection label="Market Quotes" color={BADGE_COLORS.QUOTES} />
        <Table
          aria-label="Item market price quotes"
          classNames={TABLE_CLASS_NAMES}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={quotes}>
            {(quote) => (
              <TableRow key={`${quote.price}-${quote.quantity}`}>
                <TableCell>{formatNumber(quote.price)}</TableCell>
                <TableCell>{formatNumber(quote.quantity)}</TableCell>
                <TableCell>
                  {formatNumber(quote.open_interest)}
                </TableCell>
                <TableCell>{quote.size}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
);

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
export const ItemQuotes = memo(
  ({ id, isGold = false, isXrs = false }: ItemQuotesProps) => {
    // Skip rendering for XRS items
    if (isXrs) return null;

    const { data, error, isLoading } = useItemQuotes(id);

    // Memoize columns definition
    const columns = useMemo<QuoteColumnDef[]>(() => [
      { key: "price", label: "Price" },
      { key: "quantity", label: "Quantity" },
      { key: "open_interest", label: "Open Interest" },
      { key: "size", label: isGold ? "Sellers" : "Orders" },
    ], [isGold]);

    // Error state - return null (silent failure following project pattern)
    if (error) return null;

    // Loading state
    if (isLoading) return <ItemQuotesLoading />;

    // Empty state - no quotes available
    if (!data?.quotes?.length) return null;

    // Render table with quotes
    return (
      <ItemQuotesTable
        quotes={data.quotes}
        isGold={isGold}
        columns={columns}
      />
    );
  }
);

ItemQuotes.displayName = "ItemQuotes";
