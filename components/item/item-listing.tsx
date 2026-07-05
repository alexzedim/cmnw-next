"use client";

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
import { useState } from "react";
import useSWR from "swr";

import { Link } from "@/components/custom-link";
import { ENDPOINTS } from "@/constants";
import { useI18n } from "@/lib/i18n/context";

interface Auction {
  id: string;
  uuid: string;
  orderId?: string;
  itemId: number;
  connectedRealmId: number;
  bonusList?: number[] | null;
  price?: number | null;
  bid?: number | null;
  quantity?: number;
  value?: number;
  timeLeft: string;
  timestamp: string | number;
}

interface AuctionsResponse {
  feed: Auction[];
}

interface ItemListingProps {
  id: number | string;
  name: string;
  isGold?: boolean;
  isCommdty?: boolean;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const ItemListing = ({
  id,
  name,
  isGold = false,
  isCommdty = false,
}: ItemListingProps) => {
  const [page, setPage] = useState(1);
  const { dict } = useI18n();
  const il = dict.itemListing;
  const rowsPerPage = 25;

  if (isCommdty || isGold) return null;

  const { data, error, isLoading } = useSWR<AuctionsResponse>(
    `${ENDPOINTS.API}/api/dma/item/feed?id=${id}`,
    fetcher
  );

  if (error) return null;
  if (isLoading)
    return (
      <Card className="m-4 bg-background border border-divider">
        <CardContent className="p-8 rounded-xl flex items-center justify-center min-h-[300px] bg-background">
          <Spinner color="warning" size="lg" />
        </CardContent>
      </Card>
    );

  if (!data || !data.feed || data.feed.length === 0) return null;

  const pages = Math.ceil(data.feed.length / rowsPerPage);
  const items = data.feed
    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
    .map((auction) => ({ ...auction, id: auction.uuid }));

  const timeLeftMap: Record<string, string> = {
    SHORT: il.timeShort,
    MEDIUM: il.timeMedium,
    LONG: il.timeLong,
    VERY_LONG: il.timeVeryLong,
  };

  const columns = [
    { key: "item", label: il.columnItem },
    { key: "connectedRealmId", label: il.columnRealm },
    { key: "price", label: il.columnPrice },
    { key: "timeLeft", label: il.columnExpiration },
    { key: "timestamp", label: il.columnLastUpdate },
  ];

  const buildWowheadUrl = (auction: Auction) => {
    let wowhead = `item=${auction.itemId}`;

    if (auction.bonusList && auction.bonusList.length > 0) {
      const bonusLists = auction.bonusList.join(":");

      wowhead += `&bonus=${bonusLists}`;
    }
    wowhead += "&xml";

    return {
      url: `https://wowhead.com/item=${auction.itemId}`,
      data: wowhead,
    };
  };

  return (
    <Card className="m-4 bg-background border border-divider">
      <CardContent className="p-8 rounded-xl bg-background">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label={il.tableAriaLabel}>
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
              <TableBody items={items}>
                {(auction) => {
                  const { url, data: wowheadData } = buildWowheadUrl(auction);
                  const price = auction.price ?? auction.bid;

                  return (
                    <TableRow id={auction.uuid}>
                      <TableCell className="text-muted border-b border-divider">
                        <Link
                          className="text-inherit hover:underline"
                          data-wowhead={wowheadData}
                          href={url}
                          prefetch={false}
                        >
                          {name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted border-b border-divider">
                        {auction.connectedRealmId}
                      </TableCell>
                      <TableCell className="text-muted border-b border-divider">
                        {price != null ? price.toLocaleString("ru-RU") : il.bid}
                      </TableCell>
                      <TableCell className="text-muted border-b border-divider">
                        {timeLeftMap[auction.timeLeft] || auction.timeLeft}
                      </TableCell>
                      <TableCell className="text-muted border-b border-divider">
                        {new Date(Number(auction.timestamp)).toLocaleString(
                          "en-GB"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }}
              </TableBody>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        {pages > 1 && (
          <div className="flex w-full justify-center items-center gap-2 mt-4">
            <button
              className="px-3 py-1 rounded border border-divider text-sm text-foreground hover:bg-background-elevated disabled:opacity-40"
              disabled={page <= 1}
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {"\u2190"}
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
              .reduce<number[]>((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) {
                  acc.push(-1);
                }
                acc.push(p);

                return acc;
              }, [])
              .map((p, i) =>
                p === -1 ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-muted">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`px-3 py-1 rounded text-sm ${
                      page === p
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                        : "border border-divider text-foreground hover:bg-background-elevated"
                    }`}
                    type="button"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              className="px-3 py-1 rounded border border-divider text-sm text-foreground hover:bg-background-elevated disabled:opacity-40"
              disabled={page >= pages}
              type="button"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              {"\u2192"}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
