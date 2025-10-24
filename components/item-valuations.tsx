'use client';

import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@heroui/react";
import useSWR from 'swr';
import dayjs from 'dayjs';
import { DOMAINS } from '@/lib/constants';

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

const fetcher = (url: string) => fetch(url).then(r => r.json());

export const ItemValuations = ({ id }: ItemValuationsProps) => {
  const { data, error, isLoading } = useSWR<ValuationsResponse>(
    `${DOMAINS.domain}/api/dma/item/valuations?_id=${id}`,
    fetcher,
    { refreshInterval: 5000 } // Refresh every 5 seconds if evaluating
  );

  if (error) return null;
  if (isLoading) return (
    <Card className="m-4">
      <CardBody className="p-8 border-[15px] border-white rounded-xl flex items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
      </CardBody>
    </Card>
  );

  if (!data || !data.valuations || data.valuations.length === 0) return null;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'flag', label: 'Flag' },
    { key: 'type', label: 'Type' },
    { key: 'value', label: 'Value' },
    { key: 'connected_realm_id', label: 'Realm' },
    { key: 'last_modified', label: 'Last Modified' },
  ];

  const formatDate = (date: string | number) => {
    return dayjs(date).format('DD/MM/YY HH:mm');
  };

  return (
    <Card className="m-4">
      <CardBody className="p-8 border-[15px] border-white rounded-xl">
        {data.is_evaluating && (
          <div className="mb-4 text-warning text-sm">
            Evaluating...
          </div>
        )}
        <Table 
          aria-label="Item valuations"
          classNames={{
            wrapper: "p-0",
            th: "bg-default-100 text-default-700 font-semibold",
            td: "text-default-600"
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={data.valuations}>
            {(valuation) => (
              <TableRow key={`${valuation.name}-${valuation.type}-${valuation.connected_realm_id}`}>
                <TableCell>{valuation.name}</TableCell>
                <TableCell>{valuation.flag}</TableCell>
                <TableCell>{valuation.type}</TableCell>
                <TableCell>{valuation.value.toLocaleString('ru-RU')}</TableCell>
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
