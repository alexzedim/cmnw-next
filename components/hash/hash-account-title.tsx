"use client";

import type { Character } from "@/lib/types";

interface HashAccountTitleProps {
  hashType: string;
  hashQuery: string;
  characterCount: number;
  characters?: Character[];
}

export const HashAccountTitle = ({
  hashType,
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
  const displayHash = `${hashType}@${hashQuery}`.toUpperCase();

  // Determine match quality based on character count
  const isGoodMatch = characterCount <= 65;
  const otherHashType = hashType === "a" ? "b" : "a";
  const matchQuality = isGoodMatch
    ? {
        text: "Good Match",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        suggestion: `Try Hash ${otherHashType.toUpperCase()} for more precise match`,
      }
    : {
        text: "Hash Too Common",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        suggestion: `Try Hash ${otherHashType.toUpperCase()} for more precise match`,
      };

  // Calculate guild allocation quality based on concentration
  const getGuildAllocationQuality = () => {
    if (guildStats.guildCount === 0) {
      return { status: "No Guild Data", percentage: 0, color: "text-gray-600", bgColor: "bg-gray-500/10" };
    }

    // Calculate concentration: 100% for 1 guild, decreases as guilds increase
    // Formula: percentage = max(0, 100 - (guildCount - 1) * 10)
    const basePercentage = Math.max(0, 100 - (guildStats.guildCount - 1) * 15);

    if (basePercentage >= 95) {
      return {
        status: "Excellent",
        percentage: 100,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
      };
    }
    if (basePercentage >= 85) {
      return {
        status: "Very Good",
        percentage: 85,
        color: "text-green-600",
        bgColor: "bg-green-500/10",
      };
    }
    if (basePercentage >= 65) {
      return {
        status: "Good",
        percentage: 70,
        color: "text-lime-600",
        bgColor: "bg-lime-500/10",
      };
    }
    if (basePercentage >= 50) {
      return {
        status: "Moderate",
        percentage: 50,
        color: "text-yellow-600",
        bgColor: "bg-yellow-500/10",
      };
    }
    if (basePercentage >= 30) {
      return {
        status: "Concerning",
        percentage: 35,
        color: "text-orange-600",
        bgColor: "bg-orange-500/10",
      };
    }

    return {
      status: "Spread Out",
      percentage: 20,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    };
  };

  const guildQuality = getGuildAllocationQuality();

  return (
    <div className="card-surface p-6 lg:p-8 rounded-xl mb-6">
      {/* Account Badge */}
      <div className="mb-5 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
          <div className="size-1.5 rounded-full bg-orange-500" />
          <p>Characters Account Detective</p>
        </div>
      </div>

      {/* Header Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3">
        Account Characters
      </h1>

      {/* Hash Info */}
      <div className="mb-3 flex items-baseline gap-2 text-sm lg:text-base">
        <span className="text-foreground/50">Hash:</span>
        <span className="font-mono font-medium text-foreground/80 tracking-wider">
          {displayHash}
        </span>
      </div>

      {/* Character Count */}
      <div className="flex items-baseline gap-2 text-sm lg:text-base text-foreground/70">
        <span className="text-foreground/50">Found:</span>
        <span className="font-medium">
          {characterCount} character{characterCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Match Quality */}
      <div className={`mt-4 px-4 py-3 rounded-lg ${matchQuality.bgColor}`}>
        <div className={`text-sm font-medium ${matchQuality.color}`}>
          {matchQuality.text}
        </div>
        <div className="text-xs text-foreground/60 mt-2 space-y-1">
          <div>
            {isGoodMatch
              ? `This account has ${characterCount} character${characterCount !== 1 ? "s" : ""}`
              : `This hash value is shared by ${characterCount} characters from different accounts`}
          </div>
          {isGoodMatch && (
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
            Guild Characters Allocation Check - {guildQuality.status} ({guildQuality.percentage}%)
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
