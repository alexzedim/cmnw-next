"use client";

import type { Character } from "@/lib/types";

import NextLink from "next/link";

import { EmployeeBadge } from "@/components/character/employee-badge";
import { classColors } from "@/constants/class-colors";
import { getPastelColor, getFactionBorderColor } from "@/lib/utils/color";
import { getGuildRankDisplay } from "@/lib/utils/guild-rank";
import { useI18n } from "@/lib/i18n/context";

interface HashCharactersGridProps {
  characters: Character[];
}

export function HashCharactersGrid({ characters }: HashCharactersGridProps) {
  const { dict } = useI18n();
  const h = dict.hash;

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
              {character.insetImage && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img
                    alt={character.name}
                    className="w-full h-auto object-cover"
                    src={character.insetImage}
                  />
                </div>
              )}

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

              <div className="flex flex-wrap gap-2">
                <EmployeeBadge
                  blizzardEmployeeEvidence={character.blizzardEmployeeEvidence}
                  blizzardEmployeePets={character.blizzardEmployeePets}
                  hiredApprox={character.hiredApprox}
                  isBlizzardEmployee={character.isBlizzardEmployee}
                  withTooltip={false}
                />
                {character.level && (
                  <span className="chip">
                    {h.level.replace("{level}", `${character.level}`)}
                  </span>
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

              <div className="space-y-1 text-sm">
                {character.equippedItemLevel && (
                  <div className="flex justify-between">
                    <span className="text-muted">{h.itemLevelLabel}</span>
                    <span className="font-semibold">
                      {character.equippedItemLevel}
                    </span>
                  </div>
                )}
                {character.race && (
                  <div className="flex justify-between">
                    <span className="text-muted">{h.raceLabel}</span>
                    <span>{character.race}</span>
                  </div>
                )}
                {character.specialization && (
                  <div className="flex justify-between">
                    <span className="text-muted">{h.specLabel}</span>
                    <span>{character.specialization}</span>
                  </div>
                )}
              </div>

              {character.guild && (
                <>
                  <div className="h-px bg-[var(--border)]" />
                  <div className="text-sm">
                    <span className="text-muted">{h.guildLabel}</span>
                    <span className="font-medium">{character.guild}</span>
                    {(() => {
                      const rankDisplay = getGuildRankDisplay(
                        character.guildRank,
                        dict
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
