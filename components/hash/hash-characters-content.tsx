"use client";

import { useState } from "react";
import type { Character } from "@/lib/types";
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
      {/* Filter Controls */}
      <HashCharactersFilter
        characters={characters}
        onFilter={handleFilter}
      />

      {/* Sorting Controls */}
      <HashCharactersSort
        characters={filteredCharacters}
        onSort={handleSort}
      />

      {/* Character Cards Grid */}
      <HashCharactersGrid characters={displayCharacters} />
    </>
  );
}
