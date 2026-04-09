import type { Dictionary } from "@/dictionaries";

export const OFFICER_LEVELS = {
  GM: { level: 5, labelKey: "gm" as const },
  HIGH_RANKING: {
    level: 4,
    labelKey: "highRankingOfficer" as const,
  },
  OFFICER: { level: 2, labelKey: "officer" as const },
  MEMBER: { level: 0, labelKey: "member" as const },
} as const;

export const GUILD_TYPE_THRESHOLDS = {
  BANK_MAX_MEMBERS: 10,
  TWINK_MAX_UNIQUE: 3,
  TWINK_MIN_MEMBERS: 5,
  ROSTER_MIN_COUNT: 1,
  FULL_ROSTER_COUNT: 2,
} as const;

export const GUILD_TYPES = {
  BANK: {
    statusKey: "specialPurposeBank" as const,
    type: "bank",
    color: "text-emerald-600 dark:text-emerald-700",
    bgColor: "bg-emerald-950/20",
    hexBgColor: "#496F5D" as const,
  },
  TWINK: {
    statusKey: "friendsTwinks" as const,
    type: "twink",
    color: "text-[var(--primary)]",
    bgColor: "bg-[color-mix(in_oklab,var(--primary),transparent_90%)]",
    hexBgColor: "" as string,
  },
  RAIDING_FULL: {
    statusKey: "raidingFull" as const,
    type: "raiding",
    color: "text-indigo-600 dark:text-indigo-300",
    bgColor: "bg-indigo-950/30",
    hexBgColor: "#4B0082" as const,
  },
  RAIDING: {
    statusKey: "raiding" as const,
    type: "raiding",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-950/30",
    hexBgColor: "#6D213C" as const,
  },
  MIXED: {
    statusKey: "mixed" as const,
    type: "mixed",
    color: "text-slate-600",
    bgColor: "bg-slate-500/10",
    hexBgColor: "" as string,
  },
  UNKNOWN: {
    statusKey: "noRankData" as const,
    type: "unknown",
    color: "text-gray-600",
    bgColor: "bg-gray-500/10",
    hexBgColor: "" as string,
  },
} as const;

export const PTP_THRESHOLDS = {
  HIGH_RANKING: 65,
  OFFICER: 50,
} as const;

export const RANK_PROXIMITY_DECAY_RATE = 0.35;

export const PTP_WEIGHTS = {
  RANK_PROXIMITY: 0.45,
  SCARCITY: 0.25,
  CONCENTRATION: 0.2,
  MULTI_CHAR_BONUS: 0.1,
} as const;

export const getOfficerLabel = (
  officerLevel: number,
  dict: Dictionary
): { label: string; displayLabel: string } => {
  const gc = dict.guildConstants;

  switch (officerLevel) {
    case 5:
      return {
        label: gc.gm,
        displayLabel: `[${gc.gm}]`,
      };
    case 4:
      return {
        label: gc.highRankingOfficer,
        displayLabel: `[${gc.highRankingOfficer}]`,
      };
    case 2:
      return {
        label: gc.officer,
        displayLabel: `[${gc.officer}]`,
      };
    default:
      return {
        label: gc.member,
        displayLabel: "",
      };
  }
};

export const getRankLabel = (rank: number | null, dict: Dictionary): string => {
  if (rank === 0) return dict.guildConstants.gm;
  if (rank === null) return dict.guildConstants.rank.replace("{rank}", "u/r");

  return dict.guildConstants.rank.replace("{rank}", String(rank));
};

export const getRosterLabel = (
  rosterIndex: number | undefined,
  dict: Dictionary
): string => {
  if (!rosterIndex) return "";

  return ` [${dict.guildConstants.roster.replace("{numeral}", toRomanNumeral(rosterIndex))}]`;
};

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
