"use client";

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
import { useState } from "react";
import useSWR from "swr";

import { Link } from "@/components/custom-link";
import { ENDPOINTS } from "@/constants";

interface ItemDetails {
  bonus_lists?: number[];
}

interface Auction {
  id: number;
  item_id: number;
  item: ItemDetails;
  connected_realm_id: number;
  buyout?: number;
  bid: number;
  time_left: string;
  last_modified: string | number;
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

const timeLeftMap: Record<string, string> = {
  SHORT: "30m",
  MEDIUM: "30m - 2h",
  LONG: "2h - 12h",
  VERY_LONG: "1D - 2D",
};

export const ItemListing = ({
  id,
  name,
  isGold = false,
  isCommdty = false,
}: ItemListingProps) => {
  const [page, setPage] = useState(1);
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
        <Card.Content className="p-8 rounded-xl flex items-center justify-center min-h-[300px] bg-background">
          <Spinner color="warning" size="lg" />
        </Card.Content>
      </Card>
    );

  if (!data || !data.feed || data.feed.length === 0) return null;

  const pages = Math.ceil(data.feed.length / rowsPerPage);
  const items = data.feed.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const columns = [
    { key: "item", label: "Item" },
    { key: "connected_realm_id", label: "Realm" },
    { key: "buyout", label: "Price" },
    { key: "time_left", label: "Expiration" },
    { key: "last_modified", label: "Last Update" },
  ];

  const buildWowheadUrl = (auction: Auction) => {
    let wowhead = `item=${auction.item_id}`;

    if (auction.item.bonus_lists && auction.item.bonus_lists.length > 0) {
      const bonusLists = auction.item.bonus_lists.join(":");

      wowhead += `&bonus=${bonusLists}`;
    }
    wowhead += "&xml";

    return {
      url: `https://wowhead.com/item=${auction.item_id}`,
      data: wowhead,
    };
  };

  return (
    <Card className="m-4 bg-background border border-divider">
      <Card.Content className="p-8 rounded-xl bg-background">
        <Table aria-label="Item auction listings">
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
          <TableBody items={items}>
            {(auction) => {
              const { url, data: wowheadData } = buildWowheadUrl(auction);

              return (
                <TableRow key={auction.id}>
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
                    {auction.connected_realm_id}
                  </TableCell>
                  <TableCell className="text-muted border-b border-divider">
                    {auction.buyout
                      ? auction.buyout.toLocaleString("ru-RU")
                      : `BID: ${auction.bid.toLocaleString("ru-RU")}`}
                  </TableCell>
                  <TableCell className="text-muted border-b border-divider">
                    {timeLeftMap[auction.time_left] || auction.time_left}
                  </TableCell>
                  <TableCell className="text-muted border-b border-divider">
                    {new Date(auction.last_modified).toLocaleString("en-GB")}
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
        {pages > 1 && (
          <div className="flex w-full justify-center items-center gap-2 mt-4">
            <button
              className="px-3 py-1 rounded border border-divider text-sm text-foreground hover:bg-background-elevated disabled:opacity-40"
              disabled={page <= 1}
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ←
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
              →
            </button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
