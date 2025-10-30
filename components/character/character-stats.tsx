"use client";

import type { Character } from "@/lib/types";

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Divider,
} from "@heroui/react";

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
      {/* Main Stats Card */}
      <Card>
        <CardHeader className="flex flex-col items-start pb-0">
          <h3 className="text-xl font-bold">Character Information</h3>
        </CardHeader>
        <CardBody className="gap-4">
          {/* Level and Class */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-default-600">Level</span>
            <Chip color="primary" size="lg" variant="flat">
              {character.level || "Unknown"}
            </Chip>
          </div>

          {/* Class */}
          {character.class && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-600">Class</span>
              <Chip
                color={getClassColor(character.class)}
                size="md"
                variant="flat"
              >
                {character.class}
              </Chip>
            </div>
          )}

          {/* Specialization */}
          {character.specialization && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-600">Specialization</span>
              <Chip size="sm" variant="bordered">
                {character.specialization}
              </Chip>
            </div>
          )}

          <Divider />

          {/* Race */}
          {character.race && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-600">Race</span>
              <span className="text-sm font-medium">{character.race}</span>
            </div>
          )}

          {/* Faction */}
          {character.faction && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-600">Faction</span>
              <Chip
                color={getFactionColor(character.faction)}
                size="sm"
                variant="flat"
              >
                {character.faction}
              </Chip>
            </div>
          )}

          {/* Gender */}
          {character.gender && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-600">Gender</span>
              <span className="text-sm font-medium">{character.gender}</span>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Item Level Card */}
      <Card>
        <CardHeader className="flex flex-col items-start pb-0">
          <h3 className="text-xl font-bold">Item Level</h3>
        </CardHeader>
        <CardBody className="gap-3">
          {/* Equipped Item Level */}
          {character.equippedItemLevel && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">Equipped</span>
                <span className="text-lg font-bold">
                  {character.equippedItemLevel}
                </span>
              </div>
              <Progress
                className="max-w-full"
                color={
                  itemLevelPercent > 80
                    ? "success"
                    : itemLevelPercent > 50
                      ? "warning"
                      : "default"
                }
                value={itemLevelPercent}
              />
            </>
          )}

          {/* Average Item Level */}
          {character.averageItemLevel && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-default-600">Average</span>
              <span className="text-sm font-medium">
                {character.averageItemLevel}
              </span>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Achievements Card */}
      {character.achievementPoints && (
        <Card>
          <CardHeader className="flex flex-col items-start pb-0">
            <h3 className="text-xl font-bold">Achievements</h3>
          </CardHeader>
          <CardBody className="gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-600">Points</span>
              <span className="text-lg font-bold">
                {character.achievementPoints.toLocaleString()}
              </span>
            </div>
            <Progress
              className="max-w-full"
              color="secondary"
              value={achievementPercent}
            />
          </CardBody>
        </Card>
      )}

      {/* Collections Card */}
      {(character.mountsNumber || character.petsNumber) && (
        <Card>
          <CardHeader className="flex flex-col items-start pb-0">
            <h3 className="text-xl font-bold">Collections</h3>
          </CardHeader>
          <CardBody className="gap-2">
            {character.mountsNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">Mounts</span>
                <Chip color="primary" size="sm" variant="flat">
                  {character.mountsNumber}
                </Chip>
              </div>
            )}
            {character.petsNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">Battle Pets</span>
                <Chip color="secondary" size="sm" variant="flat">
                  {character.petsNumber}
                </Chip>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Covenant (if applicable) */}
      {character.covenantId && (
        <Card>
          <CardHeader className="flex flex-col items-start pb-0">
            <h3 className="text-xl font-bold">Covenant</h3>
          </CardHeader>
          <CardBody>
            <Chip color="warning" size="md" variant="flat">
              Covenant ID: {character.covenantId}
            </Chip>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
