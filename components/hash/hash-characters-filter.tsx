"use client";

import type { Character } from "@/lib/types";

import { useState, useEffect } from "react";

interface HashCharactersFilterProps {
  characters: Character[];
  onFilter: (filtered: Character[]) => void;
}

export function HashCharactersFilter({
  characters,
  onFilter,
}: HashCharactersFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedFaction, setSelectedFaction] = useState("");

  // Get unique classes and factions from characters
  const uniqueClasses = Array.from(
    new Set(characters.map((c) => c.class).filter(Boolean))
  ).sort();
  const uniqueFactions = Array.from(
    new Set(characters.map((c) => c.faction).filter(Boolean))
  ).sort();

  useEffect(() => {
    const filtered = characters.filter((character) => {
      const matchesSearch =
        searchTerm === "" ||
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.realm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (character.guild &&
          character.guild.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesClass =
        selectedClass === "" || character.class === selectedClass;
      const matchesFaction =
        selectedFaction === "" || character.faction === selectedFaction;

      return matchesSearch && matchesClass && matchesFaction;
    });

    onFilter(filtered);
  }, [searchTerm, selectedClass, selectedFaction, characters, onFilter]);

  return (
    <>
      {/* Search Input */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Search by name, realm, or guild..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] transition-colors focus-visible:border-[var(--accent)]"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex gap-4 w-full flex-col sm:flex-row">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] text-sm transition-colors focus-visible:border-[var(--accent)]"
        >
          <option value="">All Classes</option>
          {uniqueClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={selectedFaction}
          onChange={(e) => setSelectedFaction(e.target.value)}
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] text-sm transition-colors focus-visible:border-[var(--accent)]"
        >
          <option value="">All Factions</option>
          {uniqueFactions.map((faction) => (
            <option key={faction} value={faction}>
              {faction}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedClass || selectedFaction) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
          {searchTerm && (
            <span className="chip">
              Search: <span className="font-semibold">{searchTerm}</span>
            </span>
          )}
          {selectedClass && (
            <span className="chip">
              Class: <span className="font-semibold">{selectedClass}</span>
            </span>
          )}
          {selectedFaction && (
            <span className="chip">
              Faction: <span className="font-semibold">{selectedFaction}</span>
            </span>
          )}
        </div>
      )}
    </>
  );
}
