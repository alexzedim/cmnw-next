export function getGuildRankDisplay(
  guildRank: number | undefined | null
): { symbol: string; text: string; isBold?: boolean } | null {
  if (guildRank === undefined || guildRank === null) {
    return {
      symbol: "•",
      text: "Rank u/r",
    };
  }

  switch (guildRank) {
    case 0:
      return {
        symbol: "♛",
        text: "Guild Master",
      };
    case 1:
      return {
        symbol: "★",
        text: "Rank 1",
      };
    case 2:
      return {
        symbol: "≛",
        text: "Rank 2",
        isBold: true,
      };
    case 3:
      return {
        symbol: "︽",
        text: "Rank 3",
        isBold: true,
      };
    case 4:
      return {
        symbol: "︿",
        text: "Rank 4",
        isBold: true,
      };
    default:
      return {
        symbol: "•",
        text: `Rank ${guildRank}`,
      };
  }
}
