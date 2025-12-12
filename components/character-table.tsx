"use client";

import { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
} from "@heroui/react";
import dayjs from "dayjs";

import { Link } from "@/components/custom-link";

interface Character {
  _id: string;
  hash_a?: string;
  hash_b?: string;
  guild?: string;
  guild_id?: string;
  guild_rank?: number;
  rank?: number;
  average_item_level?: number;
  character_class?: string;
  active_spec?: string;
  achievement_points?: number;
  level?: number;
  faction?: string;
  race?: string;
  gender?: string;
  chosen_covenant?: string;
  renown_level?: number;
  last_modified?: string;
}

interface CharacterTableProps {
  characters: Character[];
  roster?: boolean;
}

export const CharacterTable = ({
  characters,
  roster = false,
}: CharacterTableProps) => {
  const columns = useMemo(() => {
    const baseColumns = [
      { key: "_id", label: "Name" },
      { key: "hash_a", label: "Hash A" },
      { key: "hash_b", label: "Hash B" },
      ...(roster ? [] : [{ key: "guild", label: "Guild" }]),
      { key: "rank", label: "Rank" },
      { key: "average_item_level", label: "Item Level" },
      { key: "character_class", label: "Class" },
      { key: "active_spec", label: "Specialization" },
      ...(roster
        ? [{ key: "achievement_points", label: "Achievement Points" }]
        : []),
      { key: "level", label: "Level" },
      ...(roster ? [] : [{ key: "faction", label: "Faction" }]),
      { key: "race", label: "Race" },
      { key: "gender", label: "Gender" },
      { key: "chosen_covenant", label: "Covenant" },
      { key: "renown_level", label: "Renown" },
      { key: "last_modified", label: "Last Modified" },
    ];

    return baseColumns;
  }, [roster]);

  const renderCell = (character: Character, columnKey: string) => {
    switch (columnKey) {
      case "_id":
        return (
          <Link
            className="text-primary hover:underline"
            href={`/character/${character._id}`}
          >
            {character._id.toUpperCase()}
          </Link>
        );

      case "hash_a":
        return character.hash_a ? (
          <Link
            className="text-primary hover:underline"
            href={`/hash/a@${character.hash_a}`}
          >
            {`...${character.hash_a.slice(-6).toUpperCase()}`}
          </Link>
        ) : null;

      case "hash_b":
        return character.hash_b ? (
          <Link
            className="text-primary hover:underline"
            href={`/hash/b@${character.hash_b}`}
          >
            {`...${character.hash_b.slice(-6).toUpperCase()}`}
          </Link>
        ) : null;

      case "guild":
        return character.guild_id ? (
          <Link
            className="text-primary hover:underline"
            href={`/guild/${character.guild_id}`}
          >
            {character.guild}
          </Link>
        ) : null;

      case "rank":
        return roster ? character.rank : character.guild_rank;

      case "last_modified":
        return character.last_modified
          ? dayjs(character.last_modified).format("HH:mm DD/MM/YY")
          : null;

      default:
        return character[columnKey as keyof Character] ?? null;
    }
  };

  return (
    <Card className="m-4 bg-background border border-divider">
      <CardBody className="p-8 rounded-xl bg-background">
        <Table
          aria-label="Character table"
          classNames={{
            wrapper: "bg-transparent",
            th: "bg-background border-b border-divider text-foreground font-semibold",
            td: "text-muted border-b border-divider",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={characters}>
            {(character) => (
              <TableRow key={character._id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(character, columnKey as string)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};
