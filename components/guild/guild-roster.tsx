"use client";

import type { Character } from "@/lib/types";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Chip,
  SearchField,
  Select,
  ListBox,
  Label,
} from "@heroui/react";

import { Link } from "@/components/custom-link";
import { classColors } from "@/constants/class-colors";
import { useI18n } from "@/lib/i18n/context";
import { getGameDataLocalizer } from "@/lib/i18n/game-data";

interface GuildRosterProps {
  members: Character[];
}

type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

const ITEMS_PER_PAGE = 50;

function getPastelColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const pastelR = Math.round((r + 255) / 2);
  const pastelG = Math.round((g + 255) / 2);
  const pastelB = Math.round((b + 255) / 2);

  return `rgb(${pastelR}, ${pastelG}, ${pastelB})`;
}

export function GuildRoster({ members }: GuildRosterProps) {
  const [filterValue, setFilterValue] = useState("");
  const [classFilter, setClassFilter] = useState<Set<string>>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "guildRank",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const { dict } = useI18n();
  const gr = dict.guildRoster;
  const game = getGameDataLocalizer(dict);

  const availableClasses = useMemo(() => {
    const classes = new Set(members.map((m) => m.class).filter(Boolean));

    return Array.from(classes);
  }, [members]);

  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    if (filterValue) {
      filtered = filtered.filter((member) =>
        member.name?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (classFilter.size > 0) {
      filtered = filtered.filter(
        (member) => member.class && classFilter.has(member.class)
      );
    }

    filtered.sort((a, b) => {
      let first = a[sortDescriptor.column as keyof Character];
      let second = b[sortDescriptor.column as keyof Character];

      if (first === undefined || first === null) return 1;
      if (second === undefined || second === null) return -1;

      if (typeof first === "string" && typeof second === "string") {
        const cmp = first.localeCompare(second);

        return sortDescriptor.direction === "ascending" ? cmp : -cmp;
      }

      if (typeof first === "number" && typeof second === "number") {
        const cmp = first - second;

        return sortDescriptor.direction === "ascending" ? cmp : -cmp;
      }

      return 0;
    });

    return filtered;
  }, [members, filterValue, classFilter, sortDescriptor]);

  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return filteredMembers.slice(start, end);
  }, [filteredMembers, page]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [filterValue, classFilter]);

  const columns = [
    { key: "name", label: gr.columnName, sortable: true },
    { key: "id", label: gr.columnBlizzId, sortable: true },
    { key: "realmName", label: gr.columnRealm, sortable: true },
    { key: "level", label: gr.columnLevel, sortable: true },
    { key: "class", label: gr.columnSpec, sortable: true },
    { key: "equippedItemLevel", label: gr.columnIlvl, sortable: true },
    { key: "guildRank", label: gr.columnRank, sortable: true },
    { key: "achievementPoints", label: gr.columnAchievements, sortable: true },
    { key: "hashA", label: gr.columnHashA, sortable: false },
    { key: "hashB", label: gr.columnHashB, sortable: false },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-row flex-wrap items-center gap-4">
        <SearchField
          aria-label={gr.searchAriaLabel}
          className="w-48"
          value={filterValue}
          onChange={setFilterValue}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={gr.searchPlaceholder} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Select
          aria-label={gr.filterByClass}
          className="w-48"
          placeholder={gr.allClasses}
          selectionMode="multiple"
          value={Array.from(classFilter)}
          onChange={(keys) => setClassFilter(new Set(keys as string[]))}
        >
          <Label>{gr.filterByClass}</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {availableClasses.map((className) => (
                <ListBox.Item
                  key={className}
                  id={className}
                  textValue={className}
                >
                  {game.class(className)}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">
            {gr.shownCount
              .replace("{shown}", String(paginatedMembers.length))
              .replace("{total}", String(filteredMembers.length))}
            {filteredMembers.length < members.length &&
              ` (${filteredMembers.length} / ${members.length} ${gr.filtered})`}
          </span>
        </div>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={gr.tableAriaLabel}>
            <Table.Header className="bg-background border-b border-divider">
              {columns.map((column) => (
                <Table.Column
                  key={column.key}
                  className="py-3 text-foreground font-semibold font-sans cursor-pointer select-none"
                  isRowHeader={column.key === "name"}
                  onClick={() => {
                    if (!column.sortable) return;
                    setSortDescriptor((prev) => ({
                      column: column.key,
                      direction:
                        prev.column === column.key &&
                        prev.direction === "ascending"
                          ? "descending"
                          : "ascending",
                    }));
                  }}
                >
                  {column.label}
                  {sortDescriptor.column === column.key && (
                    <span className="ml-1">
                      {sortDescriptor.direction === "ascending"
                        ? "\u2191"
                        : "\u2193"}
                    </span>
                  )}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {paginatedMembers.map((member, index) => {
                const classColor = member.class
                  ? classColors.get(member.class)
                  : null;

                return (
                  <Table.Row
                    key={`${member.guid}-${index}`}
                    id={`${member.guid}-${index}`}
                  >
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      <Link
                        className="hover:underline font-medium transition-colors duration-200"
                        href={`/character/${member.guid}`}
                        style={{
                          color: classColor || "inherit",
                        }}
                      >
                        {member.name}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      {member.id || "-"}
                    </Table.Cell>
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      {member.realmName || "-"}
                    </Table.Cell>
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      {member.level || "-"}
                    </Table.Cell>
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      {member.class ? (
                        <Chip
                          size="sm"
                          style={{
                            backgroundColor: classColor
                              ? getPastelColor(classColor)
                              : "inherit",
                            color: "#000",
                          }}
                        >
                          {member.class &&
                            (member.specialization
                              ? `${game.specialization(member.specialization)} ${game.class(member.class)}`
                              : game.class(member.class))}
                        </Chip>
                      ) : (
                        "-"
                      )}
                    </Table.Cell>
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      <span className="font-semibold">
                        {member.equippedItemLevel || "-"}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      <Chip size="sm" variant="secondary">
                        {member.guildRank !== undefined &&
                        member.guildRank !== null
                          ? member.guildRank === 0
                            ? "GM"
                            : `R${member.guildRank}`
                          : "-"}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      {member.achievementPoints
                        ? member.achievementPoints.toLocaleString()
                        : "-"}
                    </Table.Cell>
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      {member.hashA ? (
                        <Link
                          className="text-xs font-mono text-[var(--primary)] hover:text-[var(--accent)] transition-colors font-medium"
                          href={`/hash/a${member.hashA}`}
                        >
                          {`a${member.hashA}`}
                        </Link>
                      ) : (
                        <span className="text-xs font-mono text-foreground/60">
                          -
                        </span>
                      )}
                    </Table.Cell>
                    <Table.Cell className="text-muted border-b border-divider font-sans">
                      {member.hashB ? (
                        <Link
                          className="text-xs font-mono text-[var(--primary)] hover:text-[var(--accent)] transition-colors font-medium"
                          href={`/hash/b${member.hashB}`}
                        >
                          {`b${member.hashB}`}
                        </Link>
                      ) : (
                        <span className="text-xs font-mono text-foreground/60">
                          -
                        </span>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

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
