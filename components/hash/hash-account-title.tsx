"use client";

import type { Character } from "@/lib/types";

import NextLink from "next/link";

import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";
import { pluralize } from "@/dictionaries/pluralize";

interface HashAccountTitleProps {
  hashQuery: string;
  characterCount: number;
  characters?: Character[];
  hasBlock?: boolean;
}

export const HashAccountTitle = ({
  hashQuery,
  characterCount,
  characters,
  hasBlock,
}: HashAccountTitleProps) => {
  const { dict } = useI18n();
  const h = dict.hash;

  const guildStats = (() => {
    if (!characters || characters.length === 0) {
      return {
        guildCount: 0,
        rankMap: new Map<string, Map<number | null, number>>(),
      };
    }

    const rankMap = new Map<string, Map<number | null, number>>();
    const uniqueGuilds = new Set<string>();

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

  const isPrecisionMatch = characterCount <= 65;
  const matchQuality = isPrecisionMatch
    ? {
        text: h.precisionMatch,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        suggestion: h.precisionMatchDescription,
      }
    : {
        text: h.hashTooCommon,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        suggestion: h.hashTooCommonDescription,
      };

  const getGuildAllocationQuality = () => {
    if (guildStats.guildCount === 0 || characterCount === 0) {
      return {
        status: h.noGuildData,
        percentage: 0,
        color: "text-gray-600",
        bgColor: "bg-gray-500/10",
      };
    }

    let maxCharactersInGuild = 0;

    guildStats.rankMap.forEach((ranks) => {
      const totalInGuild = Array.from(ranks.values()).reduce(
        (a, b) => a + b,
        0
      );

      maxCharactersInGuild = Math.max(maxCharactersInGuild, totalInGuild);
    });

    const concentrationPercentage = Math.round(
      (maxCharactersInGuild / characterCount) * 100
    );

    if (concentrationPercentage >= 95) {
      return {
        status: h.excellent,
        percentage: concentrationPercentage,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
      };
    }
    if (concentrationPercentage >= 85) {
      return {
        status: h.veryGood,
        percentage: concentrationPercentage,
        color: "text-green-600",
        bgColor: "bg-green-500/10",
      };
    }
    if (concentrationPercentage >= 70) {
      return {
        status: h.good,
        percentage: concentrationPercentage,
        color: "text-lime-600",
        bgColor: "bg-lime-500/10",
      };
    }
    if (concentrationPercentage >= 50) {
      return {
        status: h.moderate,
        percentage: concentrationPercentage,
        color: "text-yellow-600",
        bgColor: "bg-yellow-500/10",
      };
    }
    if (concentrationPercentage >= 30) {
      return {
        status: h.concerning,
        percentage: concentrationPercentage,
        color: "text-[var(--primary)]",
        bgColor: "bg-[color-mix(in_oklab,var(--primary),transparent_90%)]",
      };
    }

    return {
      status: h.spreadOut,
      percentage: concentrationPercentage,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    };
  };

  const guildQuality = getGuildAllocationQuality();

  const startsWithA = displayHash.toLowerCase().startsWith("a");
  const startsWithB = displayHash.toLowerCase().startsWith("b");
  const showAsterisk = startsWithA && !startsWithB;

  return (
    <div className="card-surface p-6 lg:p-8 rounded-xl mb-6">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <p>{NAMING_CONSTANTS.CHARACTER_ACCOUNT_DETECTIVE}</p>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3">
        {`* ${displayHash}`}
      </h1>

      <div className={`mt-4 px-4 py-3 rounded-lg ${matchQuality.bgColor}`}>
        <div className={`text-sm font-medium ${matchQuality.color}`}>
          {matchQuality.text}
        </div>
        <div className="text-xs text-foreground/60 mt-2 space-y-1">
          <div>
            {isPrecisionMatch
              ? h.precisionCount
                  .replace("{count}", `${characterCount}`)
                  .replace(
                    "{noun}",
                    pluralize(characterCount, h.plurals.character)
                  )
              : h.nonPrecisionCount
                  .replace("{count}", `${characterCount}`)
                  .replace(
                    "{noun}",
                    pluralize(characterCount, h.plurals.character)
                  )}
          </div>
          <div>{showAsterisk && h.hashBHint}</div>
          {!isPrecisionMatch && (
            <div className="italic text-foreground/50">
              {matchQuality.suggestion}
            </div>
          )}
        </div>
      </div>

      {hasBlock && (
        <div className="mt-4">
          <NextLink
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium card-surface transition-colors hover:bg-[var(--bg-elevated)]"
            href={`/block/${hashQuery}`}
          >
            <span className="size-1.5 rounded-full bg-[var(--primary)]" />
            {h.blockLink ?? "View block cluster"} →
          </NextLink>
        </div>
      )}

      {characters && characters.length > 0 && guildStats.guildCount > 0 && (
        <div className={`mt-6 px-4 py-3 rounded-lg ${guildQuality.bgColor}`}>
          <div className={`text-sm font-medium ${guildQuality.color}`}>
            {h.guildAllocationTitle
              .replace("{status}", guildQuality.status)
              .replace("{percentage}", `${guildQuality.percentage}`)}
          </div>
          <div className="text-xs text-foreground/60 mt-2">
            <div className="mb-3">
              {h.guildSpread
                .replace("{count}", `${guildStats.guildCount}`)
                .replace(
                  "{noun}",
                  pluralize(guildStats.guildCount, h.plurals.guild)
                )}
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
                              {h.rank}
                              {rank === 0
                                ? h.gm
                                : rank === null
                                  ? h.unranked
                                  : rank}
                              : {count} {pluralize(count, h.plurals.character)}
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
