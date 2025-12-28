"use client";

import type { Character } from "@/lib/types";

import { useMemo, useState } from "react";

// Convert hex color to pastel by blending with white (50% opacity)
function getPastelColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Blend with white (255, 255, 255) at 50%
  const pastelR = Math.round((r + 255) / 2);
  const pastelG = Math.round((g + 255) / 2);
  const pastelB = Math.round((b + 255) / 2);

  return `rgb(${pastelR}, ${pastelG}, ${pastelB})`;
}
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Select,
  SelectItem,
  Pagination,
} from "@heroui/react";

import { Link } from "@/components/custom-link";
import { classColors } from "@/constants/class-colors";

interface GuildRosterProps {
  members: Character[];
}

type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

const ITEMS_PER_PAGE = 50;

export function GuildRoster({ members }: GuildRosterProps) {
  const [filterValue, setFilterValue] = useState("");
  const [classFilter, setClassFilter] = useState<Set<string>>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "guildRank",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  // Get unique classes for filter
  const availableClasses = useMemo(() => {
    const classes = new Set(members.map((m) => m.class).filter(Boolean));

    return Array.from(classes);
  }, [members]);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    // Text search filter
    if (filterValue) {
      filtered = filtered.filter((member) =>
        member.name?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Class filter
    if (classFilter.size > 0) {
      filtered = filtered.filter(
        (member) => member.class && classFilter.has(member.class)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let first = a[sortDescriptor.column as keyof Character];
      let second = b[sortDescriptor.column as keyof Character];

      // Handle undefined/null values
      if (first === undefined || first === null) return 1;
      if (second === undefined || second === null) return -1;

      // String comparison
      if (typeof first === "string" && typeof second === "string") {
        const cmp = first.localeCompare(second);

        return sortDescriptor.direction === "ascending" ? cmp : -cmp;
      }

      // Number comparison
      if (typeof first === "number" && typeof second === "number") {
        const cmp = first - second;

        return sortDescriptor.direction === "ascending" ? cmp : -cmp;
      }

      return 0;
    });

    return filtered;
  }, [members, filterValue, classFilter, sortDescriptor]);

  // Paginate filtered members
  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return filteredMembers.slice(start, end);
  }, [filteredMembers, page]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useMemo(() => {
    setPage(1);
  }, [filterValue, classFilter]);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "id", label: "BlizzID", sortable: true },
    { key: "realmName", label: "Realm", sortable: true },
    { key: "level", label: "Level", sortable: true },
    { key: "class", label: "Specialization", sortable: true },
    { key: "equippedItemLevel", label: "iLvl", sortable: true },
    { key: "guildRank", label: "Rank", sortable: true },
    { key: "achievementPoints", label: "Achievements", sortable: true },
    { key: "hashA", label: "Hash A", sortable: false },
    { key: "hashB", label: "Hash B", sortable: false },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          isClearable
          className="w-full md:max-w-xs"
          placeholder="Search by name..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />

        <Select
          className="w-full md:max-w-xs"
          label="Filter by class"
          placeholder="All classes"
          selectedKeys={classFilter}
          selectionMode="multiple"
          onSelectionChange={(keys) => setClassFilter(keys as Set<string>)}
        >
          {availableClasses.map((className) => (
            <SelectItem key={className}>{className}</SelectItem>
          ))}
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">
            {paginatedMembers.length} / {filteredMembers.length} shown
            {filteredMembers.length < members.length &&
              ` (${filteredMembers.length} / ${members.length} filtered)`}
          </span>
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Guild roster table"
        classNames={{
          wrapper: "p-0",
          th: "bg-background border-b border-divider text-foreground font-semibold font-sans",
          td: "text-muted border-b border-divider font-sans",
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) =>
          setSortDescriptor(descriptor as SortDescriptor)
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key} allowsSorting={column.sortable}>
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {paginatedMembers.map((member, index) => {
            const classColor = member.class
              ? classColors.get(member.class)
              : null;

            return (
              <TableRow key={`${member.uuid}-${index}`}>
                <TableCell>
                  <Link
                    className="hover:underline font-medium transition-colors duration-200"
                    href={`/character/${member.guid}`}
                    style={{
                      color: classColor || "inherit",
                    }}
                  >
                    {member.name}
                  </Link>
                </TableCell>
                <TableCell>{member.id || "-"}</TableCell>
                <TableCell>{member.realmName || "-"}</TableCell>
                <TableCell>{member.level || "-"}</TableCell>
                <TableCell>
                  {member.class ? (
                    <Chip
                      size="sm"
                      variant="flat"
                      style={{
                        backgroundColor: classColor ? getPastelColor(classColor) : "inherit",
                        color: "#000",
                      }}
                    >
                      {member.specialization && member.class
                        ? `${member.specialization} ${member.class}`
                        : member.class}
                    </Chip>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-semibold">
                    {member.equippedItemLevel || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="bordered">
                    {member.guildRank !== undefined && member.guildRank !== null
                      ? member.guildRank === 0
                        ? "GM"
                        : `R${member.guildRank}`
                      : "-"}
                  </Chip>
                </TableCell>
                <TableCell>
                  {member.achievementPoints
                    ? member.achievementPoints.toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {member.hashA ? (
                    <Link
                      className="text-xs font-mono text-orange-500 hover:text-orange-400 transition-colors font-medium"
                      href={`/hash/a${member.hashA}`}
                    >
                      {`a${member.hashA}`}
                    </Link>
                  ) : (
                    <span className="text-xs font-mono text-foreground/60">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {member.hashB ? (
                    <Link
                      className="text-xs font-mono text-orange-500 hover:text-orange-400 transition-colors font-medium"
                      href={`/hash/b${member.hashB}`}
                    >
                      {`b${member.hashB}`}
                    </Link>
                  ) : (
                    <span className="text-xs font-mono text-foreground/60">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            isCompact
            showControls
            page={page}
            total={totalPages}
            onChange={setPage}
            classNames={{
              item: "text-black",
              cursor: "bg-orange-500 text-black",
              prev: "text-black [&_svg]:text-black",
              next: "text-black",
            }}
          />
        </div>
      )}
    </div>
  );
}
