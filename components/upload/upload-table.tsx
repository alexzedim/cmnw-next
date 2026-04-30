"use client";

import type { IAddonScanEntry } from "@/lib/types";

import { useMemo, useState } from "react";
import { Table } from "@heroui/react";

const ITEMS_PER_PAGE = 50;

interface UploadTableProps {
  entries: IAddonScanEntry[];
  dict: {
    name: string;
    realm: string;
    class: string;
    race: string;
    gender: string;
    faction: string;
    level: string;
    guild: string;
    guildRank: string;
    lastModified: string;
    noEntries: string;
    shownCount: string;
  };
}

type TableColumnKey =
  | "name"
  | "realm"
  | "class"
  | "race"
  | "gender"
  | "faction"
  | "level"
  | "guild"
  | "guildRank"
  | "lastModified";

interface ColumnDef {
  key: TableColumnKey;
  label: string;
}

export function UploadTable({ entries, dict }: UploadTableProps) {
  const [page, setPage] = useState(1);

  const columns = useMemo<ColumnDef[]>(
    () => [
      { key: "name", label: dict.name },
      { key: "realm", label: dict.realm },
      { key: "class", label: dict.class },
      { key: "race", label: dict.race },
      { key: "gender", label: dict.gender },
      { key: "faction", label: dict.faction },
      { key: "level", label: dict.level },
      { key: "guild", label: dict.guild },
      { key: "guildRank", label: dict.guildRank },
      { key: "lastModified", label: dict.lastModified },
    ],
    [dict]
  );

  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return entries.slice(start, end);
  }, [entries, page]);

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-muted)]">
        {dict.noEntries}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted">
          {dict.shownCount
            .replace("{shown}", String(paginatedEntries.length))
            .replace("{total}", String(entries.length))}
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Upload entries table">
              <Table.Header className="bg-background border-b border-divider">
                {columns.map((column) => (
                  <Table.Column
                    key={column.key}
                    className="py-2 text-foreground font-semibold text-sm whitespace-nowrap"
                  >
                    {column.label}
                  </Table.Column>
                ))}
              </Table.Header>
              <Table.Body>
                {paginatedEntries.map((entry) => (
                  <Table.Row key={entry.guid}>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.name}
                    </Table.Cell>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.realm}
                    </Table.Cell>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.class ?? "-"}
                    </Table.Cell>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.race ?? "-"}
                    </Table.Cell>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.gender ?? "-"}
                    </Table.Cell>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.faction ?? "-"}
                    </Table.Cell>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.level ?? "-"}
                    </Table.Cell>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.guild ?? "-"}
                    </Table.Cell>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.guildRank ?? "-"}
                    </Table.Cell>
                    <Table.Cell className="text-sm whitespace-nowrap">
                      {entry.lastModified ?? "-"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            className="px-3 py-1 rounded border border-divider text-sm text-foreground hover:bg-background-elevated disabled:opacity-40"
            disabled={page <= 1}
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {"\u2190"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
            )
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
            disabled={page >= totalPages}
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            {"\u2192"}
          </button>
        </div>
      )}
    </div>
  );
}
