'use client';

import { useMemo, useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Select,
  SelectItem,
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

type SortDescriptor = {
  column: string;
  direction: 'ascending' | 'descending';
};

const getEventColor = (event?: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  if (!event) return 'default';
  const eventLower = event.toLowerCase();
  if (eventLower.includes('join') || eventLower.includes('create')) return 'success';
  if (eventLower.includes('leave') || eventLower.includes('remove')) return 'danger';
  if (eventLower.includes('update') || eventLower.includes('change')) return 'warning';
  if (eventLower.includes('promotion') || eventLower.includes('rank')) return 'primary';
  return 'default';
};

export const LogTable = ({ logs }: LogTableProps) => {
  const [eventFilter, setEventFilter] = useState<Set<string>>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 't0',
    direction: 'descending',
  });

  // Get unique event types
  const uniqueEvents = useMemo(() => {
    const events = new Set(logs.map(log => log.event));
    return Array.from(events);
  }, [logs]);

  const formatDate = (date: number | string) => {
    if (typeof date === 'number') {
      return dayjs(date).format('YYYY-MM-DD HH:mm');
    }
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Apply event filter
    if (eventFilter.size > 0) {
      filtered = filtered.filter(log => eventFilter.has(log.event));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortDescriptor.column as keyof Log];
      const bValue = b[sortDescriptor.column as keyof Log];

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      let cmp = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        cmp = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        cmp = aValue - bValue;
      }

      return sortDescriptor.direction === 'ascending' ? cmp : -cmp;
    });

    return filtered;
  }, [logs, eventFilter, sortDescriptor]);

  if (!logs || logs.length === 0) return null;

  const columns = [
    { key: 'event', label: 'Event', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'original', label: 'Original', sortable: false },
    { key: 'updated', label: 'Updated', sortable: false },
    { key: 't0', label: 'Timestamp', sortable: true },
  ];

  return (
    <Card className="m-4">
      <CardHeader className="flex flex-col items-start pb-0">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-xl font-bold">Activity Log</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-default-500">
              {filteredLogs.length} / {logs.length} entries
            </span>
          </div>
        </div>
        {uniqueEvents.length > 1 && (
          <div className="w-full mt-4">
            <Select
              label="Filter by event type"
              placeholder="All events"
              selectionMode="multiple"
              selectedKeys={eventFilter}
              onSelectionChange={(keys) => setEventFilter(keys as Set<string>)}
              className="max-w-xs"
              size="sm"
            >
              {uniqueEvents.map((event) => (
                <SelectItem key={event} value={event}>
                  {event}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}
      </CardHeader>
      <CardBody className="p-4 md:p-8">
        <Table 
          aria-label="Activity logs"
          sortDescriptor={sortDescriptor}
          onSortChange={(descriptor) => setSortDescriptor(descriptor as SortDescriptor)}
          classNames={{
            wrapper: "p-0",
            th: "bg-default-100 text-default-700 font-semibold",
            td: "text-default-600"
          }}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key} allowsSorting={column.sortable}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={getEventColor(log.event)}
                  >
                    {log.event || '-'}
                  </Chip>
                </TableCell>
                <TableCell>{log.action || '-'}</TableCell>
                <TableCell>
                  <span className="text-sm text-default-500">{log.original || '-'}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{log.updated || '-'}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{formatDate(log.t0)}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};
