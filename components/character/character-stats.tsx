"use client";

import type { Character } from "@/lib/types";

import { getClassColor, getFactionColor } from "@/lib/utils";

interface CharacterStatsProps {
  character: Character;
}

export function CharacterStats({ character }: CharacterStatsProps) {
  const maxItemLevel = 639; // Current max item level for the expansion
  const itemLevelPercent = character.equippedItemLevel
    ? Math.min((character.equippedItemLevel / maxItemLevel) * 100, 100)
    : 0;

  const maxAchievements = 20000; // Approximate max achievement points
  const achievementPercent = character.achievementPoints
    ? Math.min((character.achievementPoints / maxAchievements) * 100, 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="card-surface p-6">
        <h3 className="text-xl font-semibold">Character Information</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Level</span>
            <span className="chip">{character.level ?? "Unknown"}</span>
          </div>

          {character.class && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Class</span>
              <span className="chip">{character.class}</span>
            </div>
          )}

          {character.specialization && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Specialization</span>
              <span className="chip">{character.specialization}</span>
            </div>
          )}

          <div className="h-px bg-[var(--border)]" />

          {character.race && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Race</span>
              <span className="text-sm font-medium">{character.race}</span>
            </div>
          )}

          {character.faction && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Faction</span>
              <span className="chip">{character.faction}</span>
            </div>
          )}

          {character.gender && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Gender</span>
              <span className="text-sm font-medium">{character.gender}</span>
            </div>
          )}
        </div>
      </div>

      {/* Item Level */}
      <div className="card-surface p-6">
        <h3 className="text-xl font-semibold">Item Level</h3>
        <div className="mt-4 space-y-3">
          {character.equippedItemLevel && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Equipped</span>
                <span className="text-lg font-bold">{character.equippedItemLevel}</span>
              </div>
              <div className="progress" style={{ ["--value" as any]: `${itemLevelPercent}%` }}>
                <div className="bar" />
              </div>
            </>
          )}

          {character.averageItemLevel && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Average</span>
              <span className="text-sm font-medium">{character.averageItemLevel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      {character.achievementPoints && (
        <div className="card-surface p-6">
          <h3 className="text-xl font-semibold">Achievements</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Points</span>
              <span className="text-lg font-bold">{character.achievementPoints.toLocaleString()}</span>
            </div>
            <div className="progress" style={{ ["--value" as any]: `${achievementPercent}%` }}>
              <div className="bar" />
            </div>
          </div>
        </div>
      )}

      {/* Collections */}
      {(character.mountsNumber || character.petsNumber) && (
        <div className="card-surface p-6">
          <h3 className="text-xl font-semibold">Collections</h3>
          <div className="mt-4 space-y-3">
            {character.mountsNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Mounts</span>
                <span className="chip">{character.mountsNumber}</span>
              </div>
            )}
            {character.petsNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Battle Pets</span>
                <span className="chip">{character.petsNumber}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Covenant */}
      {character.covenantId && (
        <div className="card-surface p-6">
          <h3 className="text-xl font-semibold">Covenant</h3>
          <div className="mt-4">
            <span className="chip">Covenant ID: {character.covenantId}</span>
          </div>
        </div>
      )}
    </div>
  );
};
