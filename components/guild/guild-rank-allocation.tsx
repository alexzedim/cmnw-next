"use client";

import type { Character } from "@/lib/types";

import {
  RANK_PROXIMITY_DECAY_RATE,
  PTP_WEIGHTS,
  PTP_THRESHOLDS,
  GUILD_TYPE_THRESHOLDS,
  GUILD_TYPES,
  getOfficerLabel,
  getRankLabel,
  getRosterLabel,
} from "./constants";
import { GuildBanner } from "./guild-banner";

import { GuildRank } from "@/components/character/guild-rank";
import { useI18n } from "@/lib/i18n/context";

interface GuildRankAllocationProps {
  members: Character[];
}

interface RankClassification {
  rank: number | null;
  label: string;
  type: "gm" | "officer" | "member" | "unranked";
  officerLevel: number;
  proximityToPowerIndex?: number;
  uniqueHashCount?: number;
  characterCount?: number;
  rosterIndex?: number;
}

function calculateNonLinearRankProximity(rank: number): number {
  return Math.exp(-RANK_PROXIMITY_DECAY_RATE * (rank - 1));
}

function calculateProximityToPowerIndex(
  rank: number,
  totalCharsAtRank: number,
  uniquePlayersAtRank: number,
  totalGuildMembers: number,
  totalUniquePlayers: number
): number {
  const rankProximity = calculateNonLinearRankProximity(rank);
  const scarcity = Math.max(0, 1 - totalCharsAtRank / totalGuildMembers);
  const concentration =
    uniquePlayersAtRank > 0
      ? Math.max(0, 1 - uniquePlayersAtRank / totalUniquePlayers)
      : 0;
  const charsPerPlayer =
    uniquePlayersAtRank > 0 ? totalCharsAtRank / uniquePlayersAtRank : 0;
  const multiCharBonus = Math.min(charsPerPlayer / 10, 1.0) * 0.5;

  return (
    (rankProximity * PTP_WEIGHTS.RANK_PROXIMITY +
      scarcity * PTP_WEIGHTS.SCARCITY +
      concentration * PTP_WEIGHTS.CONCENTRATION +
      multiCharBonus * PTP_WEIGHTS.MULTI_CHAR_BONUS) *
    100
  );
}

export const GuildRankAllocation = ({ members }: GuildRankAllocationProps) => {
  const { dict } = useI18n();
  const gc = dict.guildConstants;
  const gra = dict.guildRankAllocation;

  const { rankStats, officerClassifications } = (() => {
    if (!members || members.length === 0) {
      return {
        rankStats: {
          rankCount: 0,
          rankMap: new Map<number | null, number>(),
        },
        officerClassifications: new Map<number | null, RankClassification>(),
      };
    }

    const rankMap = new Map<number | null, number>();

    members.forEach((member) => {
      const rank = member.guildRank ?? null;

      rankMap.set(rank, (rankMap.get(rank) ?? 0) + 1);
    });

    const officerClassifications = new Map<number | null, RankClassification>();

    const numericRanks = Array.from(rankMap.entries())
      .filter(([rank]) => rank !== null && rank !== 0)
      .sort((a, b) => (a[0] ?? 0) - (b[0] ?? 0));

    rankMap.forEach((count, rank) => {
      if (rank === 0) {
        officerClassifications.set(rank, {
          rank,
          label: gc.gm,
          type: "gm",
          officerLevel: 5,
        });
      } else if (rank === null) {
        officerClassifications.set(rank, {
          rank,
          label: "u/r",
          type: "unranked",
          officerLevel: 0,
        });
      }
    });

    if (numericRanks.length > 0) {
      const rankHashData = new Map<
        number | null,
        { uniqueHashes: Set<string>; characterCount: number }
      >();

      rankMap.forEach((_, rank) => {
        const rankMembers = members.filter(
          (m) => (m.guildRank ?? null) === rank
        );
        const uniqueHashes = new Set<string>();

        rankMembers.forEach((member) => {
          if (member.hashA) {
            uniqueHashes.add(member.hashA);
          }
        });

        rankHashData.set(rank, {
          uniqueHashes,
          characterCount: rankMembers.length,
        });
      });

      const allUniqueHashes = new Set<string>();

      members.forEach((member) => {
        if (member.hashA) {
          allUniqueHashes.add(member.hashA);
        }
      });
      const totalUniqueHashes = allUniqueHashes.size;

      const rankSizes = numericRanks
        .map(([rank, count]) => ({
          rank: rank as number,
          count,
          uniquePlayers: rankHashData.get(rank)?.uniqueHashes.size || 0,
        }))
        .sort((a, b) => b.count - a.count);

      const rosterCandidates = rankSizes.slice(0, 2);
      const rosterRanks = new Map<number, number>();

      rosterCandidates.sort((a, b) => a.rank - b.rank);

      rosterCandidates.forEach((candidate, index) => {
        rosterRanks.set(candidate.rank, index + 1);
      });

      const minRosterRank =
        rosterRanks.size > 0
          ? Math.max(...Array.from(rosterRanks.keys()))
          : 999;

      numericRanks.forEach(([rank, count]) => {
        const rankNum = rank as number;
        const rankData = rankHashData.get(rankNum);

        if (!rankData) return;

        const uniqueHashCount = rankData.uniqueHashes.size;
        const characterCount = rankData.characterCount;

        const proximityIndex = calculateProximityToPowerIndex(
          rankNum,
          characterCount,
          uniqueHashCount,
          members.length,
          totalUniqueHashes
        );

        let officerLevel = 0;
        let type: "member" | "officer" = "member";

        if (rosterRanks.has(rankNum)) {
          type = "member";
          officerLevel = 0;
        } else {
          const isValidOfficerPosition = rankNum < minRosterRank;

          if (
            isValidOfficerPosition &&
            proximityIndex >= PTP_THRESHOLDS.OFFICER
          ) {
            type = "officer";
            if (proximityIndex >= PTP_THRESHOLDS.HIGH_RANKING) {
              officerLevel = 4;
            } else {
              officerLevel = 2;
            }
          }
        }

        const classification: RankClassification = {
          rank: rankNum,
          label: gc.rank.replace("{rank}", String(rankNum)),
          type,
          officerLevel,
          proximityToPowerIndex: proximityIndex,
          uniqueHashCount,
          characterCount,
          rosterIndex: rosterRanks.get(rankNum),
        };

        officerClassifications.set(rankNum, classification);
      });
    }

    return {
      rankStats: { rankCount: rankMap.size, rankMap },
      officerClassifications,
    };
  })();

  const detectGuildType = () => {
    if (rankStats.rankCount === 0 || members.length === 0) {
      return GUILD_TYPES.UNKNOWN;
    }

    const uniqueAccounts = new Set<string>();

    members.forEach((member) => {
      if (member.hashA) {
        uniqueAccounts.add(member.hashA);
      }
    });
    const uniqueAccountCount = uniqueAccounts.size;

    let rosterCount = 0;

    Array.from(officerClassifications.values()).forEach((classification) => {
      if (classification.rosterIndex) {
        rosterCount++;
      }
    });

    if (members.length <= GUILD_TYPE_THRESHOLDS.BANK_MAX_MEMBERS) {
      return GUILD_TYPES.BANK;
    }

    if (
      uniqueAccountCount <= GUILD_TYPE_THRESHOLDS.TWINK_MAX_UNIQUE &&
      members.length > GUILD_TYPE_THRESHOLDS.TWINK_MIN_MEMBERS
    ) {
      return GUILD_TYPES.TWINK;
    }

    if (rosterCount >= GUILD_TYPE_THRESHOLDS.ROSTER_MIN_COUNT) {
      return rosterCount >= GUILD_TYPE_THRESHOLDS.FULL_ROSTER_COUNT
        ? GUILD_TYPES.RAIDING_FULL
        : GUILD_TYPES.RAIDING;
    }

    return GUILD_TYPES.MIXED;
  };

  const guildType = detectGuildType();
  const guildTypeStatus = gc[guildType.statusKey as keyof typeof gc];

  return (
    <div
      className={`relative overflow-hidden px-4 py-3 rounded-lg ${guildType.bgColor}`}
      style={
        guildType.hexBgColor
          ? { backgroundColor: `${guildType.hexBgColor}25` }
          : undefined
      }
    >
      <GuildBanner guildType={guildType} />
      <div className="relative z-10">
        <div className={`text-sm font-medium ${guildType.color}`}>
          {gra.guildType.replace("{status}", guildTypeStatus as string)}
        </div>
        <div className="text-xs text-foreground/60 mt-2">
          <div className="mb-3">
            {gra.membersDistributed.replace(
              "{rankCount}",
              String(rankStats.rankCount)
            )}
          </div>
          <div
            className="space-y-0 text-xs"
            style={{ fontFamily: "monospace" }}
          >
            {Array.from(rankStats.rankMap.entries())
              .filter(([rank]) => rank !== 0)
              .sort((a, b) => (a[0] ?? 999) - (b[0] ?? 999))
              .map(([rank, count]) => {
                const percentage = Math.round((count / members.length) * 100);
                const classification = officerClassifications.get(rank);
                const proximityIndex = classification?.proximityToPowerIndex
                  ? Math.round(classification?.proximityToPowerIndex)
                  : 0;
                const uniqueHashCount = classification?.uniqueHashCount || 0;

                const rankLabel = getRankLabel(rank, dict);
                const rosterLabel = getRosterLabel(
                  classification?.rosterIndex,
                  dict
                );
                const officerLabelObj = getOfficerLabel(
                  classification?.officerLevel || 0,
                  dict
                );
                const officerLabel =
                  classification?.type === "gm"
                    ? officerLabelObj.displayLabel
                    : classification?.type === "officer"
                      ? officerLabelObj.displayLabel
                      : "";

                const memberCount = `${count.toString().padStart(3)} ${gra.characters} (${percentage.toString().padStart(2)}%)`;
                const uniqueCount = `${uniqueHashCount.toString().padStart(2)} ${gra.unique}`;
                const ptpText = `${proximityIndex.toString().padStart(2)} ${gra.ptp}`;
                const labels =
                  `${rosterLabel}${rosterLabel && officerLabel ? " " : ""}${officerLabel}`.trim();

                return (
                  <div
                    key={rank === null ? "unranked" : rank}
                    className="overflow-hidden h-6"
                  >
                    {rank && rank !== null ? (
                      <span className="inline-block w-16 leading-none overflow-hidden">
                        <GuildRank guildRank={rank} />
                      </span>
                    ) : (
                      <span className="inline-block w-8 text-foreground/60 leading-none">
                        {rankLabel}
                      </span>
                    )}
                    <span className="text-foreground/70">{" | "}</span>
                    <span className="inline-block w-44 text-right text-foreground">
                      {memberCount}
                    </span>
                    <span className="text-foreground/70">{" | "}</span>
                    <span className="inline-block w-24 text-right text-foreground">
                      {uniqueCount}
                    </span>
                    <span className="text-foreground/70">{" | "}</span>
                    <span className="inline-block w-16 text-right text-foreground">
                      {ptpText}
                    </span>
                    {labels && (
                      <>
                        <span className="text-foreground/70">{" | "}</span>
                        <span className="text-foreground/60 text-xs leading-none">
                          {labels}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            <div className="mt-2 pt-2 border-t border-foreground/20">
              <div>
                <span className="font-medium text-foreground">{gra.total}</span>{" "}
                {members.length} {gra.members}
              </div>
              {rankStats.rankMap.has(null) && (
                <div className="mt-1">
                  <span className="font-medium text-foreground">
                    {gra.unranked}
                  </span>{" "}
                  {rankStats.rankMap.get(null)} {gra.members} (
                  {Math.round(
                    (rankStats.rankMap.get(null)! / members.length) * 100
                  )}
                  %)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
