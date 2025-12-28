"use client";

import type { Character } from "@/lib/types";

import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";

interface HashAccountTitleProps {
  hashQuery: string;
  characterCount: number;
  characters?: Character[];
}

export const HashAccountTitle = ({
  hashQuery,
  characterCount,
  characters,
}: HashAccountTitleProps) => {
  // Calculate guild security stats
  const guildStats = (() => {
    if (!characters || characters.length === 0) {
      return {
        guildCount: 0,
        rankMap: new Map<string, Map<number | null, number>>(),
      };
    }

    const rankMap = new Map<string, Map<number | null, number>>();
    let uniqueGuilds = new Set<string>();

    characters.forEach((char) => {
      if (char.guild) {
        uniqueGuilds.add(char.guild);
        const guildName = char.guild;
        const rank = char.guildRank ?? null;

        if (!rankMap.has(guildName)) {
          rankMap.set(guildName, new Map());
        }

        const ranks = rankMap.get(guildName)!;

        ranks.set(rank, (ranks.get(rank) ?? 0) + 1);
      }
    });

    return { guildCount: uniqueGuilds.size, rankMap };
  })();
  const displayHash = hashQuery.toUpperCase();

  // Determine match quality based on character count
  const isPrecisionMatch = characterCount <= 65;
  const matchQuality = isPrecisionMatch
    ? {
        text: "Precision Match",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        suggestion: "This account is uniquely identified by this hash",
      }
    : {
        text: "Hash Too Common",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        suggestion: "This hash value is shared by multiple accounts",
      };

  // Calculate guild allocation quality based on character concentration
  const getGuildAllocationQuality = () => {
    if (guildStats.guildCount === 0 || characterCount === 0) {
      return {
        status: "No Guild Data",
        percentage: 0,
        color: "text-gray-600",
        bgColor: "bg-gray-500/10",
      };
    }

    // Calculate concentration: find the largest guild and calculate what % of characters are there
    let maxCharactersInGuild = 0;

    guildStats.rankMap.forEach((ranks) => {
      const totalInGuild = Array.from(ranks.values()).reduce(
        (a, b) => a + b,
        0
      );

      maxCharactersInGuild = Math.max(maxCharactersInGuild, totalInGuild);
    });

    // Percentage of characters in the largest guild
    const concentrationPercentage = Math.round(
      (maxCharactersInGuild / characterCount) * 100
    );

    if (concentrationPercentage >= 95) {
      return {
        status: "Excellent",
        percentage: concentrationPercentage,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
      };
    }
    if (concentrationPercentage >= 85) {
      return {
        status: "Very Good",
        percentage: concentrationPercentage,
        color: "text-green-600",
        bgColor: "bg-green-500/10",
      };
    }
    if (concentrationPercentage >= 70) {
      return {
        status: "Good",
        percentage: concentrationPercentage,
        color: "text-lime-600",
        bgColor: "bg-lime-500/10",
      };
    }
    if (concentrationPercentage >= 50) {
      return {
        status: "Moderate",
        percentage: concentrationPercentage,
        color: "text-yellow-600",
        bgColor: "bg-yellow-500/10",
      };
    }
    if (concentrationPercentage >= 30) {
      return {
        status: "Concerning",
        percentage: concentrationPercentage,
        color: "text-orange-600",
        bgColor: "bg-orange-500/10",
      };
    }

    return {
      status: "Spread Out",
      percentage: concentrationPercentage,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    };
  };

  const guildQuality = getGuildAllocationQuality();

  // Determine if hash starts with 'a' or 'b'
  const startsWithA = displayHash.toLowerCase().startsWith("a");
  const startsWithB = displayHash.toLowerCase().startsWith("b");
  const showAsterisk = startsWithA && !startsWithB;

  return (
    <div className="card-surface p-6 lg:p-8 rounded-xl mb-6">
      {/* Account Badge */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-orange-500" />
          <p>{NAMING_CONSTANTS.CHARACTER_ACCOUNT_DETECTIVE}</p>
        </div>
      </div>

      {/* Header Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3">
        {`* ${displayHash} ${showAsterisk && "*"}`}
      </h1>

      {/* Match Quality */}
      <div className={`mt-4 px-4 py-3 rounded-lg ${matchQuality.bgColor}`}>
        <div className={`text-sm font-medium ${matchQuality.color}`}>
          {matchQuality.text}
        </div>
        <div className="text-xs text-foreground/60 mt-2 space-y-1">
          <div>
            {isPrecisionMatch
              ? `This account has ${characterCount} character${characterCount !== 1 ? "s" : ""}`
              : `This hash value is shared by ${characterCount} characters from different accounts`}
          </div>
          <div>
            {showAsterisk && `Hash B******** gives more precision match`}
          </div>
          {!isPrecisionMatch && (
            <div className="italic text-foreground/50">
              {matchQuality.suggestion}
            </div>
          )}
        </div>
      </div>

      {/* Guild Characters Allocation Check */}
      {characters && characters.length > 0 && guildStats.guildCount > 0 && (
        <div className={`mt-6 px-4 py-3 rounded-lg ${guildQuality.bgColor}`}>
          <div className={`text-sm font-medium ${guildQuality.color}`}>
            Guild Characters Allocation Check - {guildQuality.status} (
            {guildQuality.percentage}%)
          </div>
          <div className="text-xs text-foreground/60 mt-2">
            <div className="mb-3">
              Account spread across{" "}
              <span className="font-medium text-foreground">
                {guildStats.guildCount}
              </span>{" "}
              unique guild{guildStats.guildCount !== 1 ? "s" : ""}
            </div>
            <div className="space-y-2">
              {Array.from(guildStats.rankMap.entries()).map(
                ([guildName, ranks]) => {
                  const totalInGuild = Array.from(ranks.values()).reduce(
                    (a, b) => a + b,
                    0
                  );

                  return (
                    <div key={guildName} className="text-xs">
                      <div className="font-medium text-foreground mb-1">
                        {guildName} ({totalInGuild})
                      </div>
                      <div className="ml-2 space-y-1 text-foreground/70">
                        {Array.from(ranks.entries())
                          .sort((a, b) => (a[0] ?? 999) - (b[0] ?? 999))
                          .map(([rank, count]) => (
                            <div key={rank === null ? "unranked" : rank}>
                              Rank{" "}
                              {rank === 0 ? "GM" : rank === null ? "u/r" : rank}
                              : {count} character{count !== 1 ? "s" : ""}
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
