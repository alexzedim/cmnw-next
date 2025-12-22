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
  const matchQuality = isGoodMatch
    ? {
        text: "Good Match",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      }
    : {
        text: "Hash Too Common",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      };

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
        Hash: {displayHash}
      </h1>

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
        <div className="text-xs text-foreground/60 mt-1">
          {isGoodMatch
            ? `This account has ${characterCount} character${characterCount !== 1 ? "s" : ""}`
            : `This hash value is too common and shared by ${characterCount} characters from different accounts`}
        </div>
      </div>

      {/* Guild Security Check */}
      {characters && characters.length > 0 && guildStats.guildCount > 0 && (
        <div className="mt-6 px-4 py-3 rounded-lg bg-yellow-500/10">
          <div className="text-sm font-medium text-yellow-600">
            Guild Characters Allocation Check
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
