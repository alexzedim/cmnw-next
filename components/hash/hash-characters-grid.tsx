"use client";

import type { Character } from "@/lib/types";

import NextLink from "next/link";

import { classColors } from "@/constants/class-colors";
import { getPastelColor, getFactionBorderColor } from "@/lib/utils/color";
import { getGuildRankDisplay } from "@/lib/utils/guild-rank";

interface HashCharactersGridProps {
  characters: Character[];
}

export function HashCharactersGrid({ characters }: HashCharactersGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map((character) => {
        const classColor = character.class
          ? classColors.get(character.class)
          : null;
        const factionColor = getFactionBorderColor(character.faction);

        return (
          <NextLink
            key={character.guid}
            className="card-surface p-6 block hover:shadow-lg dark:hover:shadow-none transition-shadow border-l-4"
            href={`/character/${character.guid}`}
            style={{
              borderLeftColor: factionColor,
            }}
          >
            <div className="space-y-3">
              {/* Character Image */}
              {character.insetImage && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img
                    alt={character.name}
                    className="w-full h-auto object-cover"
                    src={character.insetImage}
                  />
                </div>
              )}

              {/* Character Name */}
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{
                    color: classColor || "inherit",
                  }}
                >
                  {character.name}
                </h3>
                <p className="text-sm text-muted">@{character.realm}</p>
              </div>

              <div className="h-px bg-[var(--border)]" />

              {/* Character Details */}
              <div className="flex flex-wrap gap-2">
                {character.level && (
                  <span className="chip">Level {character.level}</span>
                )}
                {character.class && (
                  <span
                    className="chip"
                    style={{
                      backgroundColor: classColor
                        ? getPastelColor(classColor)
                        : "inherit",
                      color: "#000",
                    }}
                  >
                    {character.class}
                  </span>
                )}
                {character.faction && (
                  <span
                    className="chip"
                    style={{
                      borderColor: factionColor,
                      borderWidth: "1px",
                    }}
                  >
                    {character.faction}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-1 text-sm">
                {character.equippedItemLevel && (
                  <div className="flex justify-between">
                    <span className="text-muted">Item Level:</span>
                    <span className="font-semibold">
                      {character.equippedItemLevel}
                    </span>
                  </div>
                )}
                {character.race && (
                  <div className="flex justify-between">
                    <span className="text-muted">Race:</span>
                    <span>{character.race}</span>
                  </div>
                )}
                {character.specialization && (
                  <div className="flex justify-between">
                    <span className="text-muted">Spec:</span>
                    <span>{character.specialization}</span>
                  </div>
                )}
              </div>

              {/* Guild Info */}
              {character.guild && (
                <>
                  <div className="h-px bg-[var(--border)]" />
                  <div className="text-sm">
                    <span className="text-muted">Guild: </span>
                    <span className="font-medium">{character.guild}</span>
                    {(() => {
                      const rankDisplay = getGuildRankDisplay(
                        character.guildRank
                      );

                      return rankDisplay ? (
                        <span
                          className={`ml-2 ${rankDisplay.isBold ? "font-bold" : ""}`}
                          title={rankDisplay.text}
                        >
                          {rankDisplay.symbol} {rankDisplay.text}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </>
              )}
            </div>
          </NextLink>
        );
      })}
    </div>
  );
}
