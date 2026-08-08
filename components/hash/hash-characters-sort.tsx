"use client";

import type { Character } from "@/lib/types";

import { useState } from "react";

import { useI18n } from "@/lib/i18n/context";

export type SortOption =
  "name" | "level" | "itemLevel" | "achievementPoints" | "realmName";

interface HashCharactersSortProps {
  characters: Character[];
  onSort: (sorted: Character[]) => void;
}

function sortCharacters(chars: Character[], sortBy: SortOption): Character[] {
  const sorted = [...chars];

  switch (sortBy) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "level":
      sorted.sort((a, b) => (b.level || 0) - (a.level || 0));
      break;
    case "itemLevel":
      sorted.sort(
        (a, b) => (b.equippedItemLevel || 0) - (a.equippedItemLevel || 0)
      );
      break;
    case "achievementPoints":
      sorted.sort(
        (a, b) => (b.achievementPoints || 0) - (a.achievementPoints || 0)
      );
      break;
    case "realmName":
      sorted.sort((a, b) => a.realm.localeCompare(b.realm));
      break;
  }

  return sorted;
}

export function HashCharactersSort({
  characters,
  onSort,
}: HashCharactersSortProps) {
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const { dict } = useI18n();
  const hs = dict.hashSort;

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "name", label: hs.nameAZ },
    { value: "level", label: hs.levelHighLow },
    { value: "itemLevel", label: hs.itemLevelHighLow },
    { value: "achievementPoints", label: hs.achievementPointsHighLow },
    { value: "realmName", label: hs.realmAZ },
  ];

  const handleSort = (newSort: SortOption) => {
    setSortBy(newSort);
    onSort(sortCharacters(characters, newSort));
  };

  return (
    <>
      <label className="text-sm font-medium text-[var(--text-muted)] whitespace-nowrap">
        {hs.sortBy}
      </label>
      <select
        className="px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] text-sm transition-colors focus-visible:border-[var(--accent)] w-full sm:w-64"
        value={sortBy}
        onChange={(e) => handleSort(e.target.value as SortOption)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
