"use client";

import type { Character } from "@/lib/types";

import { useMemo, useState } from "react";
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
} from "@heroui/react";

import { getClassColor } from "@/lib/utils";
import { Link } from "@/components/custom-link";

interface GuildRosterProps {
  members: Character[];
}

type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

export function GuildRoster({ members }: GuildRosterProps) {
  const [filterValue, setFilterValue] = useState("");
  const [classFilter, setClassFilter] = useState<Set<string>>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

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

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "level", label: "Level", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { key: "specialization", label: "Spec", sortable: false },
    { key: "equippedItemLevel", label: "iLvl", sortable: true },
    { key: "guildRank", label: "Rank", sortable: true },
    { key: "achievementPoints", label: "Achievements", sortable: true },
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
            {filteredMembers.length} / {members.length} members
          </span>
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Guild roster table"
        classNames={{
          wrapper: "p-0",
          th: "bg-background border-b border-divider text-foreground font-semibold",
          td: "text-muted border-b border-divider",
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
          {filteredMembers.map((member) => (
            <TableRow key={member.guid}>
              <TableCell>
                <Link
                  className="text-primary hover:underline font-medium"
                  href={`/character/${member.guid}`}
                >
                  {member.name}
                </Link>
              </TableCell>
              <TableCell>{member.level || "-"}</TableCell>
              <TableCell>
                {member.class ? (
                  <Chip
                    color={getClassColor(member.class)}
                    size="sm"
                    variant="flat"
                  >
                    {member.class}
                  </Chip>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">{member.specialization || "-"}</span>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
