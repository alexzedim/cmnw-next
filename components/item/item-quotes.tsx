"use client";

import { useMemo, memo, useState } from "react";
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

interface Quote {
  price: number;
  quantity: number;
  openInterest: number;
  size: number;
}

const ROWS_PER_PAGE = 15;

/**
 * Local pagination control — mirrors the ItemListing arrow/number pattern
 * so the two feel consistent. Kept local until a second consumer justifies
 * a shared util.
 */
interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, pages, onChange }: PaginationProps) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
    .reduce<number[]>((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) {
        acc.push(-1);
      }
      acc.push(p);

      return acc;
    }, []);

  const btnBase =
    "px-3 py-1 rounded text-sm border border-divider text-foreground hover:bg-background-elevated disabled:opacity-40";

  return (
    <div className="flex w-full justify-center items-center gap-2 mt-4">
      <button
        className={btnBase}
        disabled={page <= 1}
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
      >
        {"\u2190"}
      </button>
      {pageNumbers.map((p, i) =>
        p === -1 ? (
          <span key={`ellipsis-${i}`} className="px-1 text-muted">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={
              page === p
                ? "px-3 py-1 rounded text-sm bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                : btnBase
            }
            type="button"
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        )
      )}
      <button
        className={btnBase}
        disabled={page >= pages}
        type="button"
        onClick={() => onChange(Math.min(pages, page + 1))}
      >
        {"\u2192"}
      </button>
    </div>
  );
};

const ItemQuotesLoading = memo(() => {
  const { dict } = useI18n();

  return (
    <Card className={`${CARD_CLASS_NAMES.root} h-full`}>
      <CardContent className={`${CARD_CLASS_NAMES.body} h-full`}>
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

interface QuotesTableBodyProps {
  quotes: Quote[];
}

const QuotesTableBody = ({ quotes }: QuotesTableBodyProps) => {
  return (
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
  );
};

interface QuotesTableProps {
  quotes: Quote[];
  columns: QuoteColumnDef[];
}

/**
 * Paginated quotes table — renders ROWS_PER_PAGE rows with the same arrow /
 * numbered-button control ItemListing uses.
 */
const ItemQuotesPaginated = ({ quotes, columns }: QuotesTableProps) => {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(quotes.length / ROWS_PER_PAGE);
  const slice = useMemo(
    () => quotes.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [quotes, page]
  );

  return (
    <Card className={`${CARD_CLASS_NAMES.root} h-full`}>
      <CardContent className={`${CARD_CLASS_NAMES.body} h-full`}>
        <BadgeSection color={BADGE_COLORS.QUOTES} label="Market Quotes" />
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Item market price quotes">
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
              <QuotesTableBody quotes={slice} />
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        <Pagination page={page} pages={pages} onChange={setPage} />
      </CardContent>
    </Card>
  );
};

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

  return <ItemQuotesPaginated columns={columns} quotes={data.quotes} />;
});

ItemQuotes.displayName = "ItemQuotes";
