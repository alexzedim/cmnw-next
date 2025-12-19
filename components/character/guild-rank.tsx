"use client";

import { getGuildRankDisplay } from "@/lib/utils/guild-rank";

interface GuildRankProps {
  guildRank?: number;
}

export const GuildRank = ({ guildRank }: GuildRankProps) => {
  const rankDisplay = getGuildRankDisplay(guildRank);

  if (!rankDisplay) return null;

  const isBelowRank1 = guildRank !== undefined && guildRank > 1;

  return (
    <span className="text-foreground/60 text-xs">
      <span
        className={`${
          rankDisplay.isBold ? "font-bold" : ""
        } ${isBelowRank1 ? "text-sm" : ""}`}
      >
        {rankDisplay.symbol}
      </span>{" "}
      {rankDisplay.text}
    </span>
  );
};
