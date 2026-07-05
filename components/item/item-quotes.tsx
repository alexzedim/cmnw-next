"use client";

import { useMemo, memo } from "react";
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
} from "@heroui/react";

import { useItemQuotes } from "@/lib/api/hooks";
import { BadgeSection } from "@/components/shared/badge-section";
import {
  CARD_CLASS_NAMES,
  BADGE_COLORS,
  formatNumber,
  formatOpenInterest,
  formatQuantity,
} from "@/components/item/constants";
import { useI18n } from "@/lib/i18n/context";

interface ItemQuotesProps {
  id: number | string;
  isGold?: boolean;
}

type QuoteColumn = "price" | "quantity" | "openInterest" | "size";

interface QuoteColumnDef {
  key: QuoteColumn;
  label: string;
}

const ItemQuotesLoading = memo(() => {
  const { dict } = useI18n();

  return (
    <Card className={CARD_CLASS_NAMES.root}>
      <CardContent className={CARD_CLASS_NAMES.body}>
        <BadgeSection
          color={BADGE_COLORS.QUOTES}
          label={dict.itemQuotes.badge}
        />
        <div className={`${CARD_CLASS_NAMES.loading} min-h-[300px]`}>
          <Spinner color="warning" size="lg" />
        </div>
      </CardContent>
    </Card>
  );
});

ItemQuotesLoading.displayName = "ItemQuotesLoading";

interface ItemQuotesTableProps {
  quotes: Array<{
    price: number;
    quantity: number;
    openInterest: number;
    size: number;
  }>;
  columns: QuoteColumnDef[];
}

const ItemQuotesTable = memo(({ quotes, columns }: ItemQuotesTableProps) => {
  const { dict } = useI18n();
  const iq = dict.itemQuotes;

  return (
    <Card className={CARD_CLASS_NAMES.root}>
      <CardContent className={CARD_CLASS_NAMES.body}>
        <BadgeSection color={BADGE_COLORS.QUOTES} label={iq.badge} />
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label={iq.tableAriaLabel}>
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
              <TableBody items={quotes}>
                {(quote) => (
                  <TableRow id={`${quote.price}-${quote.quantity}`}>
                    <TableCell className="text-[var(--primary)] font-medium">
                      {formatNumber(quote.price)}
                    </TableCell>
                    <TableCell className="text-[var(--primary)] font-medium">
                      {formatQuantity(quote.quantity)}
                    </TableCell>
                    <TableCell className="text-[var(--primary)] font-medium">
                      {formatOpenInterest(quote.openInterest)}
                    </TableCell>
                    <TableCell className="text-[var(--primary)] font-medium">
                      {quote.size}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </CardContent>
    </Card>
  );
});

ItemQuotesTable.displayName = "ItemQuotesTable";

export const ItemQuotes = memo(({ id, isGold = false }: ItemQuotesProps) => {
  const { dict } = useI18n();
  const iq = dict.itemQuotes;
  const { data, error, isLoading } = useItemQuotes(id);

  const columns = useMemo<QuoteColumnDef[]>(
    () => [
      { key: "price", label: iq.columnPrice },
      { key: "quantity", label: iq.columnQuantity },
      { key: "openInterest", label: iq.columnOpenInterest },
      { key: "size", label: isGold ? iq.columnSellers : iq.columnOrders },
    ],
    [iq, isGold]
  );

  if (error) return null;

  if (isLoading) return <ItemQuotesLoading />;

  if (!data?.quotes?.length) return null;

  return <ItemQuotesTable columns={columns} quotes={data.quotes} />;
});

ItemQuotes.displayName = "ItemQuotes";
