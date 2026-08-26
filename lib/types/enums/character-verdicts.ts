/**
 * Mirror of cmnw/libs/resources/src/constants/osint.constants.ts
 * (LEVEL_BOOST_EVIDENCE, BLIZZARD_EMPLOYEE_EVIDENCE). Kept in sync manually.
 */

export enum LevelBoostEvidence {
  DirectAchievement = "DIRECT_ACHIEVEMENT",
  TimestampCluster = "TIMESTAMP_CLUSTER",
  OriginalChainAbsent = "ORIGINAL_CHAIN_ABSENT",
  OriginalLevel10Present = "ORIGINAL_LEVEL_10_PRESENT",
  Indeterminate = "INDETERMINATE",
}

export enum BlizzardEmployeeEvidence {
  CeFosSameDay = "CE_FOS_SAME_DAY",
  CeTimelineOrganic = "CE_TIMELINE_ORGANIC",
  MultiCePetsUnverified = "MULTI_CE_PETS_UNVERIFIED",
  NoCePets = "NO_CE_PETS",
  Indeterminate = "INDETERMINATE",
}

export interface CharacterEmployeeVerdict {
  isBlizzardEmployee?: boolean | null;
  blizzardEmployeeEvidence?: BlizzardEmployeeEvidence | string | null;
}

/**
 * Positive verdicts and unverified suspects are shown; ruled-out verdicts stay hidden.
 */
export const isEmployeeVerdictVisible = (
  character: CharacterEmployeeVerdict
): boolean =>
  character.isBlizzardEmployee === true ||
  (character.isBlizzardEmployee == null &&
    character.blizzardEmployeeEvidence ===
      BlizzardEmployeeEvidence.MultiCePetsUnverified);
