"use client";

import type { Character } from "@/lib/types";

import { InfoSection } from "@/components/character/info-section";

interface CharacterStatsProps {
  character: Character;
}

export function CharacterStats({ character }: CharacterStatsProps) {
  const maxItemLevel = 639;
  const itemLevelPercent = character.equippedItemLevel
    ? Math.min((character.equippedItemLevel / maxItemLevel) * 100, 100)
    : 0;

  const maxAchievements = 20000;
  const achievementPercent = character.achievementPoints
    ? Math.min((character.achievementPoints / maxAchievements) * 100, 100)
    : 0;

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
    ...(character.hashA ? [{ label: "Hash A", value: character.hashA }] : []),
    ...(character.hashB ? [{ label: "Hash B", value: character.hashB }] : []),
    ...(character.hashF ? [{ label: "Hash F", value: character.hashF }] : []),
  ];

  // ID Items
  const idItems = [
    ...(character.uuid ? [{ label: "UUID", value: character.uuid }] : []),
    ...(character.guid ? [{ label: "GUID", value: character.guid }] : []),
    ...(character.id ? [{ label: "ID", value: character.id.toString() }] : []),
  ];

  // Collections Items
  const collectionsItems = [
    ...(character.mountsNumber
      ? [{ label: "Mounts", value: character.mountsNumber }]
      : []),
    ...(character.petsNumber
      ? [{ label: "Battle Pets", value: character.petsNumber }]
      : []),
  ];

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

      {/* Item Level */}
      {character.equippedItemLevel && (
        <div className="card-surface p-6 rounded-xl">
          <div className="mb-6 flex items-center gap-3">
            <h3 className="text-lg font-semibold tracking-tight">Item Level</h3>
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
            <h3 className="text-lg font-semibold tracking-tight">
              Achievements
            </h3>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
              <div className="size-1.5 rounded-full bg-orange-500" />
              <span>Progress</span>
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
          </div>
        </div>
      )}

      {/* Collections */}
      {collectionsItems.length > 0 && (
        <InfoSection
          badge="Inventory"
          items={collectionsItems}
          title="Collections"
        />
      )}

      {/* Covenant */}
      {character.covenantId && (
        <InfoSection
          badge="Bond"
          items={[{ label: "ID", value: character.covenantId }]}
          title="Covenant"
        />
      )}

      {/* Additional Profile Information */}
      {additionalProfileItems.length > 0 && (
        <InfoSection
          badge="Metadata"
          items={additionalProfileItems}
          title="Profile Information"
        />
      )}

      {/* Identifiers */}
      {idItems.length > 0 && (
        <InfoSection badge="System" items={idItems} title="Identifiers" />
      )}

      {/* Hashes */}
      {hashItems.length > 0 && (
        <InfoSection
          badge="Verification"
          divider={false}
          items={hashItems}
          title="Character Hashes"
        />
      )}
    </div>
  );
}
