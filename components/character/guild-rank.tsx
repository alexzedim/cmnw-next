"use client";

import { getGuildRankDisplay } from "@/lib/utils/guild-rank";
import { useI18n } from "@/lib/i18n/context";

interface GuildRankProps {
  guildRank?: number;
}

export const GuildRank = ({ guildRank }: GuildRankProps) => {
  const { dict } = useI18n();
  const rankDisplay = getGuildRankDisplay(guildRank, dict);

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
