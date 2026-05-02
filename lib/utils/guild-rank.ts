import type { Dictionary } from "@/dictionaries";

export function getGuildRankDisplay(
  guildRank: number | undefined | null,
  dict: Dictionary
): { symbol: string; text: string; isBold?: boolean } | null {
  const gr = dict.guildRank;

  if (guildRank === undefined || guildRank === null) {
    return {
      symbol: "\u2022",
      text: gr.unranked,
    };
  }

  switch (guildRank) {
    case 0:
      return {
        symbol: "\u265B",
        text: gr.guildMaster,
      };
    case 1:
      return {
        symbol: "\u2605",
        text: gr.rank.replace("{rank}", "1"),
      };
    case 2:
      return {
        symbol: "\u268C",
        text: gr.rank.replace("{rank}", "2"),
        isBold: true,
      };
    case 3:
      return {
        symbol: "\u2630",
        text: gr.rank.replace("{rank}", "3"),
        isBold: true,
      };
    case 4:
      return {
        symbol: "\uFE3F",
        text: gr.rank.replace("{rank}", "4"),
        isBold: true,
      };
    default:
      return {
        symbol: "\u2022",
        text: gr.rank.replace("{rank}", String(guildRank)),
      };
  }
}
