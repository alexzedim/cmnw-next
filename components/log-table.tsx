"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";

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
  direction: "ascending" | "descending";
};

const eventClass = (event?: string) => {
  if (!event) return "chip";
  const e = event.toLowerCase();
  if (e.includes("join") || e.includes("create")) return "chip";
  if (e.includes("leave") || e.includes("remove")) return "chip";
  if (e.includes("update") || e.includes("change")) return "chip";
  if (e.includes("promotion") || e.includes("rank")) return "chip";
  return "chip";
};

export const LogTable = ({ logs }: LogTableProps) => {
  const [eventFilter, setEventFilter] = useState<Set<string>>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "t0",
    direction: "descending",
  });

  // Get unique event types
  const uniqueEvents = useMemo(() => {
    const events = new Set(logs.map((log) => log.event));

    return Array.from(events);
  }, [logs]);

  const formatDate = (date: number | string) => {
    if (typeof date === "number") {
      return dayjs(date).format("YYYY-MM-DD HH:mm");
    }

    return dayjs(date).format("YYYY-MM-DD HH:mm");
  };

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Apply event filter
    if (eventFilter.size > 0) {
      filtered = filtered.filter((log) => eventFilter.has(log.event));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortDescriptor.column as keyof Log];
      const bValue = b[sortDescriptor.column as keyof Log];

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      let cmp = 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        cmp = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        cmp = aValue - bValue;
      }

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });

    return filtered;
  }, [logs, eventFilter, sortDescriptor]);

  if (!logs || logs.length === 0) return null;

  const columns = [
    { key: "event", label: "Event", sortable: true },
    { key: "action", label: "Action", sortable: true },
    { key: "original", label: "Original", sortable: false },
    { key: "updated", label: "Updated", sortable: false },
    { key: "t0", label: "Timestamp", sortable: true },
  ];

  return (
    <div id="log-table-root" className="card-surface p-6 m-4 density-compact">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-xl font-semibold">Activity Log</h3>
        <div className="text-sm text-muted">
          {filteredLogs.length} / {logs.length} entries
        </div>
      </div>

      {uniqueEvents.length > 1 && (
        <div className="w-full mt-4 flex flex-wrap gap-2 items-center">
          {uniqueEvents.map((event) => {
            const selected = eventFilter.has(event);
            return (
              <button
                key={event}
                className={`chip ${selected ? "opacity-100" : "opacity-70"}`}
                onClick={() => {
                  const next = new Set(eventFilter);
                  selected ? next.delete(event) : next.add(event);
                  setEventFilter(next);
                }}
                type="button"
              >
                {event}
              </button>
            );
          })}
          {eventFilter.size > 0 && (
            <button
              className="chip"
              onClick={() => setEventFilter(new Set())}
              type="button"
            >
              Clear
            </button>
          )}
          <span className="mx-2 text-muted">|</span>
          <button
            className="chip"
            onClick={() => {
              const root = document.querySelector('#log-table-root');
              if (root) root.classList.toggle('density-compact');
            }}
            type="button"
          >
            Compact
          </button>
        </div>
      )}

      <div className="table-container mt-4">
        <table className="table table-sticky">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() =>
                    c.sortable &&
                    setSortDescriptor(({ column, direction }) => ({
                      column: c.key,
                      direction:
                        column === c.key && direction === "ascending"
                          ? "descending"
                          : "ascending",
                    }))
                  }
                  className={c.sortable ? "cursor-pointer select-none" : ""}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log._id}>
                <td><span className={eventClass(log.event)}>{log.event || "-"}</span></td>
                <td>{log.action || "-"}</td>
                <td><span className="text-sm text-muted">{log.original || "-"}</span></td>
                <td><span className="text-sm font-medium">{log.updated || "-"}</span></td>
                <td><span className="text-sm">{formatDate(log.t0)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
