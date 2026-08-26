"use client";

import type { Character } from "@/lib/types";

import NextLink from "next/link";

import { EmployeeBadge } from "@/components/character/employee-badge";
import { classColors } from "@/constants/class-colors";
import { getFactionBorderColor, getPastelColor } from "@/lib/utils/color";
import { getGuildRankDisplay } from "@/lib/utils/guild-rank";
import { useI18n } from "@/lib/i18n/context";

interface HashCharactersTableProps {
  characters: Character[];
}

export function HashCharactersTable({ characters }: HashCharactersTableProps) {
  const { dict } = useI18n();
  const h = dict.hash;
  const t = h.table;

  return (
    <div className="card-surface p-6 rounded-xl">
      <div className="table-container">
        <table className="table table-sticky">
          <thead>
            <tr>
              <th>{t.name}</th>
              <th>{t.realm}</th>
              <th>{t.level}</th>
              <th>{t.class}</th>
              <th>{t.spec}</th>
              <th>{t.itemLevel}</th>
              <th>{t.guild}</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((character) => {
              const classColor = character.class
                ? classColors.get(character.class)
                : null;
              const factionColor = getFactionBorderColor(character.faction);

              return (
                <tr
                  key={character.guid}
                  style={{
                    borderLeftColor: factionColor,
                    borderLeftWidth: "3px",
                  }}
                >
                  <td>
                    <span className="inline-flex items-center gap-2">
                      <NextLink
                        className="font-medium transition-colors hover:text-[var(--primary)]"
                        href={`/character/${encodeURIComponent(character.guid)}`}
                        style={{ color: classColor ?? "inherit" }}
                      >
                        {character.name}
                      </NextLink>
                      <EmployeeBadge
                        blizzardEmployeeEvidence={
                          character.blizzardEmployeeEvidence
                        }
                        blizzardEmployeePets={character.blizzardEmployeePets}
                        hiredApprox={character.hiredApprox}
                        isBlizzardEmployee={character.isBlizzardEmployee}
                        withTooltip={false}
                      />
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-foreground/60">
                      {character.realm}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm">{character.level ?? "—"}</span>
                  </td>
                  <td>
                    {character.class ? (
                      <span
                        className="chip text-xs"
                        style={{
                          backgroundColor: classColor
                            ? getPastelColor(classColor)
                            : "inherit",
                          color: "#000",
                        }}
                      >
                        {character.class}
                      </span>
                    ) : (
                      <span className="text-sm text-foreground/40">—</span>
                    )}
                  </td>
                  <td>
                    <span className="text-sm text-foreground/70">
                      {character.specialization ?? "—"}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-medium">
                      {character.equippedItemLevel ?? "—"}
                    </span>
                  </td>
                  <td>
                    {character.guild ? (
                      <span className="text-sm">
                        {character.guild}
                        {(() => {
                          const rankDisplay = getGuildRankDisplay(
                            character.guildRank,
                            dict
                          );

                          return rankDisplay ? (
                            <span
                              className={`ml-1 ${rankDisplay.isBold ? "font-bold" : ""}`}
                              title={rankDisplay.text}
                            >
                              {rankDisplay.symbol}
                            </span>
                          ) : null;
                        })()}
                      </span>
                    ) : (
                      <span className="text-sm text-foreground/40">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
