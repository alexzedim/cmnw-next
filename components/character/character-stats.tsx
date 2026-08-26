"use client";

import type { Character } from "@/lib/types";

import NextLink from "next/link";

import { isEmployeeVerdictVisible } from "@/lib/types";
import { CharacterProfessions } from "@/components/character/professions";
import { EmployeeBadge } from "@/components/character/employee-badge";
import { InfoSection } from "@/components/character/info-section";
import { getExpansionByBackendCode } from "@/constants";
import { useI18n } from "@/lib/i18n/context";

interface CharacterStatsProps {
  character: Character;
}

export function CharacterStats({ character }: CharacterStatsProps) {
  const { dict } = useI18n();
  const cs = dict.characterStats;
  const labels = cs.labels;
  const verdicts = cs.verdicts;

  const formatVerdictDate = (value: string | Date) =>
    new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const itemLevelPercent = character.percentiles?.global?.averageItemLevel ?? 0;
  const achievementPercent =
    character.percentiles?.global?.achievementPoints ?? 0;

  const formatPercentile = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null;

    return cs.topPercent.replace("{percent}", (100 - value).toFixed(1));
  };

  const characterInfoItems = [
    {
      label: labels.level,
      value: character.level ?? labels.unknown,
    },
    ...(character.class
      ? [{ label: labels.class, value: character.class }]
      : []),
    ...(character.specialization
      ? [{ label: labels.specialization, value: character.specialization }]
      : []),
    ...(character.race ? [{ label: labels.race, value: character.race }] : []),
    ...(character.faction
      ? [{ label: labels.faction, value: character.faction }]
      : []),
    ...(character.gender
      ? [{ label: labels.gender, value: character.gender }]
      : []),
    ...(character.createdApprox
      ? [
          {
            label: labels.createdApprox,
            value: `${verdicts.onOrBefore} ${formatVerdictDate(character.createdApprox)}`,
          },
        ]
      : []),
    ...(character.lastModified
      ? [
          {
            label: labels.lastTimeActive,
            value: new Date(character.lastModified).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            ),
          },
        ]
      : []),
  ];

  const additionalProfileItems = [
    ...(character.createdBy
      ? [{ label: labels.createdBy, value: character.createdBy }]
      : []),
    ...(character.createdAt
      ? [
          {
            label: labels.createdAt,
            value: new Date(character.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          },
        ]
      : []),
  ];

  const hashItems = [
    ...(character.hashA
      ? [
          {
            label: labels.hashA,
            value: (
              <NextLink
                className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors font-medium"
                href={`/hash/a${character.hashA}`}
              >
                {`a${character.hashA}`}
              </NextLink>
            ),
          },
        ]
      : []),
    ...(character.hashB
      ? [
          {
            label: labels.hashB,
            value: (
              <NextLink
                className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors font-medium"
                href={`/hash/b${character.hashB}`}
              >
                {`b${character.hashB}`}
              </NextLink>
            ),
          },
        ]
      : []),
    ...(character.hashBlock
      ? [
          {
            label: labels.block,
            value: (
              <span className="flex items-center gap-2">
                <NextLink
                  className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors font-medium"
                  href={`/block/${character.hashBlock.hashValue}`}
                >
                  {character.hashBlock.hashValue.toUpperCase()}
                </NextLink>
                <span
                  className={
                    character.hashBlock.isConfirmed
                      ? "text-emerald-500 text-xs"
                      : "text-foreground/40 text-xs"
                  }
                >
                  {character.hashBlock.isConfirmed ? "✓" : "?"}
                </span>
              </span>
            ),
          },
        ]
      : []),
  ];

  const systemItems = [
    ...(character.guid ? [{ label: labels.guid, value: character.guid }] : []),
    ...(character.id
      ? [{ label: labels.id, value: character.id.toString() }]
      : []),
  ];

  const boostExpansion = character.levelBoostType
    ? getExpansionByBackendCode(character.levelBoostType)
    : undefined;

  const detectionItems = [
    ...(character.isLevelBoosted === true
      ? [
          {
            label: verdicts.levelBoost,
            value: (
              <span
                className="flex items-center gap-2"
                title={
                  character.levelBoostEvidence
                    ? verdicts.boostEvidence[
                        character.levelBoostEvidence as keyof typeof verdicts.boostEvidence
                      ]
                    : undefined
                }
              >
                <span className="chip text-xs whitespace-nowrap">
                  {verdicts.boosted}
                </span>
                {boostExpansion && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: boostExpansion.color }}
                  >
                    {boostExpansion.label}
                  </span>
                )}
                {character.levelBoostedAt && (
                  <span className="text-xs text-foreground/50">
                    {formatVerdictDate(character.levelBoostedAt)}
                  </span>
                )}
              </span>
            ),
          },
        ]
      : []),
    ...(isEmployeeVerdictVisible(character)
      ? [
          {
            label: verdicts.blizzardEmployee,
            value: (
              <span className="flex items-center gap-2">
                <EmployeeBadge
                  blizzardEmployeeEvidence={character.blizzardEmployeeEvidence}
                  blizzardEmployeePets={character.blizzardEmployeePets}
                  hiredApprox={character.hiredApprox}
                  isBlizzardEmployee={character.isBlizzardEmployee}
                />
                {character.hiredApprox && (
                  <span className="text-xs text-foreground/50">
                    {formatVerdictDate(character.hiredApprox)}
                  </span>
                )}
              </span>
            ),
          },
        ]
      : []),
  ];

  const combinedMetadataSystemItems = [
    ...additionalProfileItems,
    ...systemItems,
  ];

  const mountsPercent = character.percentiles?.global?.mountsNumber ?? 0;
  const petsPercent = character.percentiles?.global?.petsNumber ?? 0;

  return (
    <div className="space-y-4 lg:space-y-5">
      {characterInfoItems.length > 0 && (
        <InfoSection
          badge={cs.profile}
          items={characterInfoItems}
          title={cs.characterDetails}
        />
      )}

      {hashItems.length > 0 && (
        <InfoSection
          badge={cs.verification}
          items={hashItems}
          title={cs.characterHashes}
        />
      )}

      {detectionItems.length > 0 && (
        <InfoSection
          badge={cs.detection}
          items={detectionItems}
          title={cs.detection}
        />
      )}

      {character.equippedItemLevel && (
        <div className="card-surface p-6 rounded-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
              <div className="size-1.5 rounded-full bg-[var(--primary)]" />
              <span>{cs.equipment}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">{cs.equipped}</span>
              <span className="text-lg font-bold text-foreground">
                {character.equippedItemLevel}
              </span>
            </div>
            <div
              className="progress"
              style={{ ["--value" as any]: `${itemLevelPercent}%` }}
            >
              <div className="bar" />
            </div>
            {formatPercentile(itemLevelPercent) && (
              <div className="text-xs text-foreground/50 text-right">
                {formatPercentile(itemLevelPercent)} {cs.globally}
              </div>
            )}
          </div>

          {character.averageItemLevel && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-foreground/60">{cs.average}</span>
              <span className="font-medium text-foreground">
                {character.averageItemLevel}
              </span>
            </div>
          )}
        </div>
      )}

      {character.achievementPoints && (
        <div className="card-surface p-6 rounded-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
              <div className="size-1.5 rounded-full bg-[var(--primary)]" />
              <span>{cs.achievementProgress}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">
                {cs.totalPoints}
              </span>
              <span className="text-lg font-bold text-foreground">
                {character.achievementPoints.toLocaleString()}
              </span>
            </div>
            <div
              className="progress"
              style={{ ["--value" as any]: `${achievementPercent}%` }}
            >
              <div className="bar" />
            </div>
            {formatPercentile(achievementPercent) && (
              <div className="text-xs text-foreground/50 text-right">
                {formatPercentile(achievementPercent)} {cs.globally}
              </div>
            )}
          </div>
        </div>
      )}

      {(character.mountsNumber || character.petsNumber) && (
        <div className="card-surface p-6 rounded-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
              <div className="size-1.5 rounded-full bg-[var(--primary)]" />
              <span>{cs.collections}</span>
            </div>
          </div>

          <div className="space-y-6">
            {character.mountsNumber && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60">
                    {cs.mounts}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {character.mountsNumber.toLocaleString()}
                  </span>
                </div>
                <div
                  className="progress"
                  style={{ ["--value" as any]: `${mountsPercent}%` }}
                >
                  <div className="bar" />
                </div>
                {formatPercentile(mountsPercent) && (
                  <div className="text-xs text-foreground/50 text-right">
                    {formatPercentile(mountsPercent)} {cs.globally}
                  </div>
                )}
              </div>
            )}

            {character.petsNumber && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60">
                    {cs.battlePets}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {character.petsNumber.toLocaleString()}
                  </span>
                </div>
                <div
                  className="progress"
                  style={{ ["--value" as any]: `${petsPercent}%` }}
                >
                  <div className="bar" />
                </div>
                {formatPercentile(petsPercent) && (
                  <div className="text-xs text-foreground/50 text-right">
                    {formatPercentile(petsPercent)} {cs.globally}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {character.professions && character.professions.length > 0 && (
        <CharacterProfessions professions={character.professions} />
      )}

      {combinedMetadataSystemItems.length > 0 && (
        <InfoSection
          badge={cs.system}
          items={combinedMetadataSystemItems}
          title={cs.metadata}
        />
      )}
    </div>
  );
}
