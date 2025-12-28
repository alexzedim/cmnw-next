"use client";

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
import useSWR from "swr";

import { DOMAINS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";

interface Quote {
  price: number;
  quantity: number;
  open_interest: number;
  size: number;
}

interface QuotesResponse {
  quotes: Quote[];
}

interface ItemQuotesProps {
  id: number | string;
  isGold?: boolean;
  isXrs?: boolean;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const ItemQuotes = ({
  id,
  isGold = false,
  isXrs = false,
}: ItemQuotesProps) => {
  if (isXrs) return null;

  const { data, error, isLoading } = useSWR<QuotesResponse>(
    `${DOMAINS.domain}/api/dma/item/quotes?id=${id}`,
    fetcher
  );

  if (error) return null;
  if (isLoading)
    return (
      <Card className="m-4 bg-background border border-divider">
        <CardBody className="p-8 rounded-xl bg-background">
          {/* Item Quotes Badge */}
          <div className="mb-6 flex items-center gap-3">
            <div
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
              style={{ fontFamily: fontJetBrains.style.fontFamily }}
            >
              <div className="size-1.5 rounded-full bg-cyan-500" />
              <p className="inline-block">Market Quotes</p>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-[300px]">
            <Spinner color="warning" size="lg" />
          </div>
        </CardBody>
      </Card>
    );

  if (!data || !data.quotes || data.quotes.length === 0) return null;

  const columns = [
    { key: "price", label: "Price" },
    { key: "quantity", label: "Quantity" },
    { key: "open_interest", label: "Open Interest" },
    { key: "size", label: isGold ? "Sellers" : "Orders" },
  ];

  return (
    <Card className="m-4 bg-background border border-divider">
      <CardBody className="p-8 rounded-xl bg-background">
        {/* Item Quotes Badge */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
            style={{ fontFamily: fontJetBrains.style.fontFamily }}
          >
            <div className="size-1.5 rounded-full bg-cyan-500" />
            <p className="inline-block">Market Quotes</p>
          </div>
        </div>
        <Table
          aria-label="Item price quotes"
          classNames={{
            wrapper: "p-0",
            th: "bg-background border-b border-divider text-foreground font-semibold",
            td: "text-muted border-b border-divider",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={data.quotes}>
            {(quote) => (
              <TableRow key={`${quote.price}-${quote.quantity}`}>
                <TableCell>{quote.price.toLocaleString("ru-RU")}</TableCell>
                <TableCell>{quote.quantity.toLocaleString("ru-RU")}</TableCell>
                <TableCell>
                  {quote.open_interest.toLocaleString("ru-RU")}
                </TableCell>
                <TableCell>{quote.size}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};
