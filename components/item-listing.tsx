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
  Pagination,
} from "@heroui/react";
import { useState } from "react";
import useSWR from "swr";

import { Link } from "@/components/custom-link";
import { DOMAINS } from "@/constants";

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
  isXrs?: boolean;
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
  isXrs = false,
}: ItemListingProps) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 25;

  if (isCommdty || isGold) return null;

  const { data, error, isLoading } = useSWR<AuctionsResponse>(
    `${DOMAINS.domain}/api/dma/item/feed?_id=${id}`,
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
    <Card className="m-4">
      <CardBody className="p-8 border-[15px] border-white rounded-xl">
        <Table
          aria-label="Item auction listings"
          bottomContent={
            pages > 1 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
              </div>
            ) : null
          }
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
          <TableBody items={items}>
            {(auction) => {
              const { url, data: wowheadData } = buildWowheadUrl(auction);

              return (
                <TableRow key={auction.id}>
                  <TableCell>
                    <Link
                      className="text-inherit hover:underline"
                      data-wowhead={wowheadData}
                      href={url}
                      prefetch={false}
                    >
                      {name}
                    </Link>
                  </TableCell>
                  <TableCell>{auction.connected_realm_id}</TableCell>
                  <TableCell>
                    {auction.buyout
                      ? auction.buyout.toLocaleString("ru-RU")
                      : `BID: ${auction.bid.toLocaleString("ru-RU")}`}
                  </TableCell>
                  <TableCell>
                    {timeLeftMap[auction.time_left] || auction.time_left}
                  </TableCell>
                  <TableCell>
                    {new Date(auction.last_modified).toLocaleString("en-GB")}
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};
