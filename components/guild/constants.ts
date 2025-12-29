/**
 * Guild Components - Shared Constants
 *
 * This module contains shared constants, types, and utility functions
 * used across guild-related components (GuildRankAllocation, GuildTitle, etc).
 */

/**
 * Officer rank labels and levels
 */
export const OFFICER_LEVELS = {
  GM: { level: 5, label: "GM", displayLabel: "[GM]" },
  HIGH_RANKING: { level: 4, label: "High Ranking Officer", displayLabel: "[High Ranking Officer]" },
  SENIOR: { level: 3, label: "Senior Officer", displayLabel: "[Senior Officer]" },
  OFFICER: { level: 2, label: "Officer", displayLabel: "[Officer]" },
  JUNIOR: { level: 1, label: "Junior Officer", displayLabel: "[Junior Officer]" },
  MEMBER: { level: 0, label: "Member", displayLabel: "" },
} as const;

/**
 * Guild type detection thresholds
 */
export const GUILD_TYPE_THRESHOLDS = {
  BANK_MAX_MEMBERS: 10,
  TWINK_MAX_UNIQUE: 3,
  TWINK_MIN_MEMBERS: 5,
  ROSTER_MIN_COUNT: 1,
  FULL_ROSTER_COUNT: 2,
} as const;

/**
 * Guild type styling
 */
export const GUILD_TYPES = {
  BANK: {
    status: "Special Purpose Guild | Bank Guild",
    type: "bank",
    color: "text-emerald-700",
    bgColor: "bg-emerald-950/20",
    hexBgColor: "#6D213C" as const,
  },
  TWINK: {
    status: "Friends & Twinks Guild",
    type: "twink",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    hexBgColor: "" as string,
  },
  RAIDING_FULL: {
    status: "Raiding Guild (Full Structure)",
    type: "raiding",
    color: "text-indigo-300",
    bgColor: "bg-indigo-950/30",
    hexBgColor: "#4B0082" as const,
  },
  RAIDING: {
    status: "Raiding Guild",
    type: "raiding",
    color: "text-purple-400",
    bgColor: "bg-purple-950/30",
    hexBgColor: "#6D213C" as const,
  },
  MIXED: {
    status: "Mixed Guild",
    type: "mixed",
    color: "text-slate-600",
    bgColor: "bg-slate-500/10",
    hexBgColor: "" as string,
  },
  UNKNOWN: {
    status: "No Rank Data",
    type: "unknown",
    color: "text-gray-600",
    bgColor: "bg-gray-500/10",
    hexBgColor: "" as string,
  },
} as const;

/**
 * Proximity to Power Index thresholds for officer classification
 */
export const PTP_THRESHOLDS = {
  HIGH_RANKING: 80,
  SENIOR: 65,
  OFFICER: 50,
  JUNIOR: 35,
} as const;

/**
 * Non-linear rank proximity decay rate
 * Controls how quickly influence diminishes with rank distance from GM
 */
export const RANK_PROXIMITY_DECAY_RATE = 0.35;

/**
 * PTP Index component weights
 */
export const PTP_WEIGHTS = {
  RANK_PROXIMITY: 0.45,
  SCARCITY: 0.25,
  CONCENTRATION: 0.2,
  MULTI_CHAR_BONUS: 0.1,
} as const;

/**
 * Get officer level label for display
 * @param officerLevel - Officer level (0-5)
 * @returns Officer level display object
 */
export const getOfficerLabel = (
  officerLevel: number
): { label: string; displayLabel: string } => {
  switch (officerLevel) {
    case 5:
      return OFFICER_LEVELS.GM;
    case 4:
      return OFFICER_LEVELS.HIGH_RANKING;
    case 3:
      return OFFICER_LEVELS.SENIOR;
    case 2:
      return OFFICER_LEVELS.OFFICER;
    case 1:
      return OFFICER_LEVELS.JUNIOR;
    default:
      return OFFICER_LEVELS.MEMBER;
  }
};

/**
 * Get rank label for display
 * @param rank - Guild rank number or null for unranked
 * @returns Display label
 */
export const getRankLabel = (rank: number | null): string => {
  if (rank === 0) return "GM";
  if (rank === null) return "u/r";
  return `Rank ${rank}`;
};

/**
 * Get roster label (e.g., "Roster I", "Roster II")
 * @param rosterIndex - Roster index (1 for I, 2 for II, etc)
 * @returns Roster display label or empty string
 */
export const getRosterLabel = (rosterIndex?: number): string => {
  if (!rosterIndex) return "";
  return ` [Roster ${String.fromCharCode(64 + rosterIndex)}]`;
};

/**
 * Numerals for Roman numerals conversion
 */
const ROMAN_NUMERALS = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
} as const;

export const toRomanNumeral = (num: number): string => {
  return ROMAN_NUMERALS[num as keyof typeof ROMAN_NUMERALS] || String(num);
};
