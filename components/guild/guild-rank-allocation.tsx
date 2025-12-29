"use client";

import type { Character } from "@/lib/types";

interface GuildRankAllocationProps {
  members: Character[];
}

interface RankClassification {
  rank: number | null;
  label: string;
  type: "gm" | "officer" | "member" | "unranked";
  officerLevel: number; // 0 = not officer, 1 = junior, 2 = officer, 3 = senior, 4 = high
  proximityToPowerIndex?: number; // Proximity to Power Index (0-100)
  uniqueHashCount?: number; // Number of unique hash values in rank
  characterCount?: number; // Number of characters in rank
}

/**
 * Non-linear rank proximity calculation
 * Uses exponential decay - distances from GM increase exponentially
 */
function calculateNonLinearRankProximity(rank: number): number {
  const decayRate = 0.35;
  const normalizedRank = rank;
  const exponentialProximity = Math.exp(-decayRate * (normalizedRank - 1));
  return exponentialProximity;
}

/**
 * Calculate Proximity to Power Index for a given rank
 * Higher score = more influential/officer-like
 */
function calculateProximityToPowerIndex(
  rank: number,
  totalCharsAtRank: number,
  uniquePlayersAtRank: number,
  totalGuildMembers: number,
  totalUniquePlayers: number
): number {
  // 1. Non-linear rank proximity score
  const rankProximity = calculateNonLinearRankProximity(rank);

  // 2. Scarcity score (fewer characters = more exclusive)
  const scarcity = Math.max(0, 1 - totalCharsAtRank / totalGuildMembers);

  // 3. Player concentration score (fewer unique players = more trusted)
  const concentration =
    uniquePlayersAtRank > 0
      ? Math.max(0, 1 - uniquePlayersAtRank / totalUniquePlayers)
      : 0;

  // 4. Characters per player ratio (higher = player has more chars at this rank)
  const charsPerPlayer =
    uniquePlayersAtRank > 0 ? totalCharsAtRank / uniquePlayersAtRank : 0;

  // Normalize: If a player has many chars at this rank, they're trusted with it
  const multiCharBonus = Math.min(charsPerPlayer / 10, 1.0) * 0.5;

  // 5. Combined Proximity to Power Index
  return (
    (rankProximity * 0.45 +
      scarcity * 0.25 +
      concentration * 0.2 +
      multiCharBonus * 0.1) *
    100
  );
}

export const GuildRankAllocation = ({ members }: GuildRankAllocationProps) => {
  // Calculate rank security stats and detect officer hierarchy
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

    // Detect officer ranks based on rarity and hierarchy
    const officerClassifications = new Map<number | null, RankClassification>();

    // Get sorted ranks (excluding null/unranked)
    const numericRanks = Array.from(rankMap.entries())
      .filter(([rank]) => rank !== null && rank !== 0)
      .sort((a, b) => (a[0] ?? 0) - (b[0] ?? 0));

    // Classify GM (rank 0)
    rankMap.forEach((count, rank) => {
      if (rank === 0) {
        officerClassifications.set(rank, {
          rank,
          label: "GM",
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

    // Detect officer ranks using Proximity to Power Index
    if (numericRanks.length > 0) {
      // Calculate unique players (by hashA) for each rank
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

      // Calculate total unique players in guild
      const allUniqueHashes = new Set<string>();
      members.forEach((member) => {
        if (member.hashA) {
          allUniqueHashes.add(member.hashA);
        }
      });
      const totalUniqueHashes = allUniqueHashes.size;

      // Step 1: Identify roster ranks (2 most common ranks with highest member count)
      const rankSizes = numericRanks
        .map(([rank, count]) => ({
          rank: rank as number,
          count,
          uniquePlayers: rankHashData.get(rank)?.uniqueHashes.size || 0,
        }))
        .sort((a, b) => b.count - a.count);

      // The two most populated ranks are roster ranks
      const rosterRanks = new Set<number>();
      if (rankSizes.length >= 1) rosterRanks.add(rankSizes[0].rank);
      if (rankSizes.length >= 2) rosterRanks.add(rankSizes[1].rank);

      // Minimum roster rank number (highest numeric rank among roster ranks)
      const minRosterRank = rosterRanks.size > 0 ? Math.max(...Array.from(rosterRanks)) : 999;

      numericRanks.forEach(([rank, count]) => {
        const rankNum = rank as number;
        const rankData = rankHashData.get(rankNum);
        if (!rankData) return;

        const uniqueHashCount = rankData.uniqueHashes.size;
        const characterCount = rankData.characterCount;

        // Calculate Proximity to Power Index for this rank
        const proximityIndex = calculateProximityToPowerIndex(
          rankNum,
          characterCount,
          uniqueHashCount,
          members.length,
          totalUniqueHashes
        );

        let officerLevel = 0;
        let type: "member" | "officer" = "member";

        // Check if this is a roster rank
        if (rosterRanks.has(rankNum)) {
          type = "member";
          officerLevel = 0;
        } else {
          // Officer ranks MUST be numerically lower than roster ranks
          const isValidOfficerPosition = rankNum < minRosterRank;

          if (isValidOfficerPosition && proximityIndex >= 35) {
            type = "officer";
            if (proximityIndex >= 80) {
              officerLevel = 4; // High Ranking Officer
            } else if (proximityIndex >= 65) {
              officerLevel = 3; // Senior Officer
            } else if (proximityIndex >= 50) {
              officerLevel = 2; // Officer
            } else {
              officerLevel = 1; // Junior Officer
            }
          }
        }

        const classification: RankClassification = {
          rank: rankNum,
          label: `Rank ${rankNum}`,
          type,
          officerLevel,
          proximityToPowerIndex: proximityIndex,
          uniqueHashCount,
          characterCount,
        };

        officerClassifications.set(rankNum, classification);
      });
    }

    return {
      rankStats: { rankCount: rankMap.size, rankMap },
      officerClassifications,
    };
  })();

  // Determine concentration quality based on rank distribution
  const getRankAllocationQuality = () => {
    if (rankStats.rankCount === 0 || members.length === 0) {
      return {
        status: "No Rank Data",
        percentage: 0,
        color: "text-gray-600",
        bgColor: "bg-gray-500/10",
      };
    }

    // Calculate concentration: find the largest rank and calculate what % of members are there
    let maxMembersInRank = 0;

    rankStats.rankMap.forEach((count) => {
      maxMembersInRank = Math.max(maxMembersInRank, count);
    });

    // Percentage of members in the largest rank
    const concentrationPercentage = Math.round(
      (maxMembersInRank / members.length) * 100
    );

    if (concentrationPercentage >= 95) {
      return {
        status: "Highly Concentrated",
        percentage: concentrationPercentage,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
      };
    }
    if (concentrationPercentage >= 85) {
      return {
        status: "Very Concentrated",
        percentage: concentrationPercentage,
        color: "text-green-600",
        bgColor: "bg-green-500/10",
      };
    }
    if (concentrationPercentage >= 70) {
      return {
        status: "Concentrated",
        percentage: concentrationPercentage,
        color: "text-lime-600",
        bgColor: "bg-lime-500/10",
      };
    }
    if (concentrationPercentage >= 50) {
      return {
        status: "Balanced",
        percentage: concentrationPercentage,
        color: "text-yellow-600",
        bgColor: "bg-yellow-500/10",
      };
    }
    if (concentrationPercentage >= 30) {
      return {
        status: "Well Distributed",
        percentage: concentrationPercentage,
        color: "text-orange-600",
        bgColor: "bg-orange-500/10",
      };
    }

    return {
      status: "Evenly Distributed",
      percentage: concentrationPercentage,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    };
  };

  const rankQuality = getRankAllocationQuality();

  return (
    <div className={`px-4 py-3 rounded-lg ${rankQuality.bgColor}`}>
      <div className={`text-sm font-medium ${rankQuality.color}`}>
        Guild Rank Allocation Block - {rankQuality.status} (
        {rankQuality.percentage}%)
      </div>
      <div className="text-xs text-foreground/60 mt-2">
        <div className="mb-3">
          Members distributed across{" "}
          <span className="font-medium text-foreground">
            {rankStats.rankCount}
          </span>{" "}
          rank{rankStats.rankCount !== 1 ? "s" : ""}
        </div>
        <div className="space-y-2">
          {Array.from(rankStats.rankMap.entries())
            .filter(([rank]) => rank !== 0) // Exclude GM from display
            .sort((a, b) => (a[0] ?? 999) - (b[0] ?? 999))
            .map(([rank, count]) => {
              const percentage = Math.round((count / members.length) * 100);
              const classification = officerClassifications.get(rank);
              const proximityIndex = classification?.proximityToPowerIndex
                ? Math.round(classification.proximityToPowerIndex)
                : 0;
              const uniqueHashCount = classification?.uniqueHashCount || 0;
              const officerLabel =
                classification?.type === "gm"
                  ? " [GM]"
                  : classification?.type === "officer"
                    ? classification.officerLevel === 4
                      ? " [High Ranking Officer]"
                      : classification.officerLevel === 3
                        ? " [Senior Officer]"
                        : classification.officerLevel === 2
                          ? " [Officer]"
                          : " [Junior Officer]"
                    : "";

              return (
                <div key={rank === null ? "unranked" : rank}>
                  <span className="font-medium text-foreground">
                    Rank {rank === 0 ? "GM" : rank === null ? "u/r" : rank}:
                  </span>{" "}
                  {count} member{count !== 1 ? "s" : ""} ({percentage}%) | {uniqueHashCount} unique | PTP Index: {proximityIndex}
                  {officerLabel && (
                    <span className="text-foreground/60 text-xs ml-1">
                      {officerLabel}
                    </span>
                  )}
                </div>
              );
            })}
          <div className="mt-2 pt-2 border-t border-foreground/20">
            <div>
              <span className="font-medium text-foreground">Total:</span>{" "}
              {members.length} members
            </div>
            {rankStats.rankMap.has(null) && (
              <div className="mt-1">
                <span className="font-medium text-foreground">u/r:</span>{" "}
                {rankStats.rankMap.get(null)} members (
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
  );
};
