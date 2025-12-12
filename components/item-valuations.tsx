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
import dayjs from "dayjs";

import { DOMAINS } from "@/constants";

interface Valuation {
  name: string;
  flag: string;
  type: string;
  value: number;
  connected_realm_id: number;
  last_modified: string | number;
  details?: any;
}

interface ValuationsResponse {
  valuations: Valuation[];
  is_evaluating: boolean;
}

interface ItemValuationsProps {
  id: number | string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const ItemValuations = ({ id }: ItemValuationsProps) => {
  const { data, error, isLoading } = useSWR<ValuationsResponse>(
    `${DOMAINS.domain}/api/dma/item/valuations?id=${id}`,
    fetcher,
    { refreshInterval: 5000 } // Refresh every 5 seconds if evaluating
  );

  if (error) return null;
  if (isLoading)
    return (
      <Card className="m-4 bg-background border border-divider">
        <CardBody className="p-8 rounded-xl flex items-center justify-center min-h-[300px] bg-background">
          <Spinner size="lg" color="warning" />
        </CardBody>
      </Card>
    );

  if (!data || !data.valuations || data.valuations.length === 0) return null;

  const columns = [
    { key: "name", label: "Name" },
    { key: "flag", label: "Flag" },
    { key: "type", label: "Type" },
    { key: "value", label: "Value" },
    { key: "connected_realm_id", label: "Realm" },
    { key: "last_modified", label: "Last Modified" },
  ];

  const formatDate = (date: string | number) => {
    return dayjs(date).format("DD/MM/YY HH:mm");
  };

  return (
    <Card className="m-4 bg-background border border-divider">
      <CardBody className="p-8 rounded-xl bg-background">
        {data.is_evaluating && (
          <div className="mb-4 text-accent text-sm">Evaluating...</div>
        )}
        <Table
          aria-label="Item valuations"
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
          <TableBody items={data.valuations}>
            {(valuation) => (
              <TableRow
                key={`${valuation.name}-${valuation.type}-${valuation.connected_realm_id}`}
              >
                <TableCell>{valuation.name}</TableCell>
                <TableCell>{valuation.flag}</TableCell>
                <TableCell>{valuation.type}</TableCell>
                <TableCell>{valuation.value.toLocaleString("ru-RU")}</TableCell>
                <TableCell>{valuation.connected_realm_id}</TableCell>
                <TableCell>{formatDate(valuation.last_modified)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};
