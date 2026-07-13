"use client";

import type { Character } from "@/lib/types";

import { useState, useCallback } from "react";

import { HashCharactersFilter } from "./hash-characters-filter";
import { HashCharactersSort } from "./hash-characters-sort";
import { HashCharactersGrid } from "./hash-characters-grid";
import { HashCharactersTable } from "./hash-characters-table";

import { useI18n } from "@/lib/i18n/context";

type ViewMode = "cards" | "table";

interface HashCharactersContentProps {
  characters: Character[];
  showTableOption?: boolean;
}

export function HashCharactersContent({
  characters,
  showTableOption = false,
}: HashCharactersContentProps) {
  const { dict } = useI18n();
  const h = dict.hash;

  const [filteredCharacters, setFilteredCharacters] = useState(characters);
  const [displayCharacters, setDisplayCharacters] = useState(characters);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const handleFilter = useCallback((filtered: Character[]) => {
    setFilteredCharacters(filtered);
    setDisplayCharacters(filtered);
  }, []);

  const handleSort = useCallback((sorted: Character[]) => {
    setDisplayCharacters(sorted);
  }, []);

  return (
    <>
      <div className="mb-6 card-surface p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 space-y-3">
            <HashCharactersFilter
              characters={characters}
              onFilter={handleFilter}
            />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-3 items-start lg:flex-row lg:items-center justify-start lg:justify-end">
            <HashCharactersSort
              characters={filteredCharacters}
              onSort={handleSort}
            />
          </div>
        </div>

        {showTableOption && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="inline-flex items-center gap-1 rounded-lg bg-foreground/5 p-1">
              <button
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === "cards" ? "bg-[var(--bg-elevated)] text-foreground" : "text-foreground/50 hover:text-foreground"}`}
                type="button"
                onClick={() => setViewMode("cards")}
              >
                ▦ {h.viewCards}
              </button>
              <button
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === "table" ? "bg-[var(--bg-elevated)] text-foreground" : "text-foreground/50 hover:text-foreground"}`}
                type="button"
                onClick={() => setViewMode("table")}
              >
                ☰ {h.viewTable}
              </button>
            </div>
          </div>
        )}
      </div>

      {viewMode === "table" && showTableOption ? (
        <HashCharactersTable characters={displayCharacters} />
      ) : (
        <HashCharactersGrid characters={displayCharacters} />
      )}
    </>
  );
}
