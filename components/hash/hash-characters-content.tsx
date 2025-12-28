"use client";

import type { Character } from "@/lib/types";

import { useState } from "react";

import { HashCharactersFilter } from "./hash-characters-filter";
import { HashCharactersSort } from "./hash-characters-sort";
import { HashCharactersGrid } from "./hash-characters-grid";

interface HashCharactersContentProps {
  characters: Character[];
}

export function HashCharactersContent({
  characters,
}: HashCharactersContentProps) {
  const [filteredCharacters, setFilteredCharacters] = useState(characters);
  const [displayCharacters, setDisplayCharacters] = useState(characters);

  const handleFilter = (filtered: Character[]) => {
    setFilteredCharacters(filtered);
    setDisplayCharacters(filtered);
  };

  const handleSort = (sorted: Character[]) => {
    setDisplayCharacters(sorted);
  };

  return (
    <>
      {/* Filter and Sort Controls */}
      <div className="mb-6 card-surface p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Filter Section */}
          <div className="lg:col-span-2 space-y-3">
            <HashCharactersFilter
              characters={characters}
              onFilter={handleFilter}
            />
          </div>
          {/* Sort Section */}
          <div className="lg:col-span-1 flex flex-col gap-3 items-start lg:flex-row lg:items-center justify-start lg:justify-end">
            <HashCharactersSort
              characters={filteredCharacters}
              onSort={handleSort}
            />
          </div>
        </div>
      </div>

      {/* Character Cards Grid */}
      <HashCharactersGrid characters={displayCharacters} />
    </>
  );
}
