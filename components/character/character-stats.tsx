"use client";

import type { Character } from "@/lib/types";

import NextLink from "next/link";

import { InfoSection } from "@/components/character/info-section";

interface CharacterStatsProps {
  character: Character;
}

export function CharacterStats({ character }: CharacterStatsProps) {
  // Use global percentiles from API if available, otherwise calculate fallback
  const itemLevelPercent = character.percentiles?.global?.averageItemLevel ?? 0;
  const achievementPercent =
    character.percentiles?.global?.achievementPoints ?? 0;

  // Helper to format percentile text
  const formatPercentile = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null;

    return `Top ${(100 - value).toFixed(1)}%`;
  };

  // Character Information Items
  const characterInfoItems = [
    {
      label: "Level",
      value: character.level ?? "Unknown",
    },
    ...(character.class ? [{ label: "Class", value: character.class }] : []),
    ...(character.specialization
      ? [{ label: "Specialization", value: character.specialization }]
      : []),
    ...(character.race ? [{ label: "Race", value: character.race }] : []),
    ...(character.faction
      ? [{ label: "Faction", value: character.faction }]
      : []),
    ...(character.gender ? [{ label: "Gender", value: character.gender }] : []),
    ...(character.lastModified
      ? [
          {
            label: "Last Time Active",
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

  // Additional Profile Items
  const additionalProfileItems = [
    ...(character.createdBy
      ? [{ label: "Created By", value: character.createdBy }]
      : []),
    ...(character.createdAt
      ? [
          {
            label: "Created At",
            value: new Date(character.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          },
        ]
      : []),
  ];

  // Hash Items (identifiers)
  const hashItems = [
    ...(character.hashA
      ? [
          {
            label: "Hash A",
            value: (
              <NextLink
                className="text-orange-500 hover:text-orange-400 transition-colors font-medium"
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
            label: "Hash B",
            value: (
              <NextLink
                className="text-orange-500 hover:text-orange-400 transition-colors font-medium"
                href={`/hash/b${character.hashB}`}
              >
                {`b${character.hashB}`}
              </NextLink>
            ),
          },
        ]
      : []),
  ];

  // System Items (without UUID)
  const systemItems = [
    ...(character.guid ? [{ label: "GUID", value: character.guid }] : []),
    ...(character.id ? [{ label: "ID", value: character.id.toString() }] : []),
  ];

  // Combined Metadata + System Items (without UUID)
  const combinedMetadataSystemItems = [
    ...additionalProfileItems,
    ...systemItems,
  ];

  // Collections percentiles from API
  const mountsPercent = character.percentiles?.global?.mountsNumber ?? 0;
  const petsPercent = character.percentiles?.global?.petsNumber ?? 0;

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* Character Information */}
      {characterInfoItems.length > 0 && (
        <InfoSection
          badge="Profile"
          items={characterInfoItems}
          title="Character Details"
        />
      )}

      {/* Hashes / Verification */}
      {hashItems.length > 0 && (
        <InfoSection
          badge="Verification"
          divider={false}
          items={hashItems}
          title="Character Hashes"
        />
      )}

      {/* Item Level */}
      {character.equippedItemLevel && (
        <div className="card-surface p-6 rounded-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
              <div className="size-1.5 rounded-full bg-orange-500" />
              <span>Equipment</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Equipped</span>
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
                {formatPercentile(itemLevelPercent)} globally
              </div>
            )}
          </div>

          {character.averageItemLevel && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-foreground/60">Average</span>
              <span className="font-medium text-foreground">
                {character.averageItemLevel}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Achievements */}
      {character.achievementPoints && (
        <div className="card-surface p-6 rounded-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
              <div className="size-1.5 rounded-full bg-orange-500" />
              <span>Achievement Progress</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Total Points</span>
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
                {formatPercentile(achievementPercent)} globally
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collections */}
      {(character.mountsNumber || character.petsNumber) && (
        <div className="card-surface p-6 rounded-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
              <div className="size-1.5 rounded-full bg-orange-500" />
              <span>Collections</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Mounts */}
            {character.mountsNumber && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60">Mounts</span>
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
                    {formatPercentile(mountsPercent)} globally
                  </div>
                )}
              </div>
            )}

            {/* Battle Pets */}
            {character.petsNumber && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60">
                    Battle Pets
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
                    {formatPercentile(petsPercent)} globally
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Combined Metadata and System Information */}
      {combinedMetadataSystemItems.length > 0 && (
        <InfoSection
          badge="System"
          items={combinedMetadataSystemItems}
          title="Metadata"
        />
      )}
    </div>
  );
}
