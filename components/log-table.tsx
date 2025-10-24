'use client';

import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Card,
  CardBody
} from "@heroui/react";
import dayjs from 'dayjs';

interface Log {
  _id: string;
  event: string;
  action: string;
  original: string | number;
  updated: string | number;
  t0: number | string;
  t1: number | string;
}

interface LogTableProps {
  logs: Log[];
}

const columns = [
  { key: 'event', label: 'Event' },
  { key: 'action', label: 'Action' },
  { key: 'original', label: 'Original' },
  { key: 'updated', label: 'Updated' },
  { key: 't0', label: 'After' },
  { key: 't1', label: 'Before' },
];

export const LogTable = ({ logs }: LogTableProps) => {
  if (!logs || logs.length === 0) return null;

  const formatDate = (date: number | string) => {
    if (typeof date === 'number') {
      return dayjs(date).format('YYYY-MM-DD HH:mm');
    }
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  return (
    <Card className="m-4">
      <CardBody className="p-4 md:p-8 border-8 border-white rounded-xl">
        <Table 
          aria-label="Character activity logs"
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
          <TableBody items={logs}>
            {(log) => (
              <TableRow key={log._id}>
                <TableCell>{log.event}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.original}</TableCell>
                <TableCell>{log.updated}</TableCell>
                <TableCell>{formatDate(log.t0)}</TableCell>
                <TableCell>{formatDate(log.t1)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};
