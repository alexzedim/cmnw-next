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
      <Card className="m-4">
        <CardBody className="p-8 border-[15px] border-white rounded-xl flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
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
    <Card className="m-4">
      <CardBody className="p-8 border-[15px] border-white rounded-xl">
        <Table
          aria-label="Item price quotes"
          classNames={{
            wrapper: "p-0",
            th: "bg-default-100 text-default-700 font-semibold",
            td: "text-default-600",
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
