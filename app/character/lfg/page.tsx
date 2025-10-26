'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Chip,
  Skeleton,
} from '@heroui/react';
import { useCharactersLfg } from '@/lib/api/hooks';
import { Link } from '@/components/custom-link';
import type { CharactersLfgQueryParams, Faction } from '@/types/entities';

const factions: Faction[] = ['Alliance', 'Horde'];

const classes = [
  'Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest',
  'Death Knight', 'Shaman', 'Mage', 'Warlock',
  'Monk', 'Druid', 'Demon Hunter', 'Evoker'
];

const getClassColor = (characterClass?: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  const classColors: Record<string, any> = {
    'Warrior': 'danger',
    'Paladin': 'warning',
    'Hunter': 'success',
    'Rogue': 'default',
    'Priest': 'default',
    'Death Knight': 'danger',
    'Shaman': 'primary',
    'Mage': 'secondary',
    'Warlock': 'secondary',
    'Monk': 'success',
    'Druid': 'success',
    'Demon Hunter': 'secondary',
    'Evoker': 'primary',
  };
  return classColors[characterClass || ''] || 'default';
};

const getFactionColor = (faction?: string): 'primary' | 'danger' | 'default' => {
  if (faction === 'Alliance') return 'primary';
  if (faction === 'Horde') return 'danger';
  return 'default';
};

export default function CharacterLfgPage() {
  const [searchParams, setSearchParams] = useState<CharactersLfgQueryParams | null>(null);
  const [formData, setFormData] = useState({
    faction: '',
    averageItemLevel: '',
    raiderIoScore: '',
  });

  const { data, error, isLoading } = useCharactersLfg(searchParams);

  const handleSearch = () => {
    const params: CharactersLfgQueryParams = {};
    
    if (formData.faction) {
      params.faction = formData.faction as Faction;
    }
    if (formData.averageItemLevel) {
      params.averageItemLevel = Number(formData.averageItemLevel);
    }
    if (formData.raiderIoScore) {
      params.raiderIoScore = Number(formData.raiderIoScore);
    }

    setSearchParams(params);
  };

  const handleReset = () => {
    setFormData({
      faction: '',
      averageItemLevel: '',
      raiderIoScore: '',
    });
    setSearchParams(null);
  };

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Looking for Guild</h1>
          <p className="text-default-600">
            Search for characters actively looking for a guild
          </p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">Search Filters</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Faction Filter */}
              <Select
                label="Faction"
                placeholder="Select faction"
                selectedKeys={formData.faction ? [formData.faction] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setFormData({ ...formData, faction: selected as string });
                }}
              >
                {factions.map((faction) => (
                  <SelectItem key={faction}>
                    {faction}
                  </SelectItem>
                ))}
              </Select>

              {/* Min Item Level */}
              <Input
                type="number"
                label="Minimum Item Level"
                placeholder="e.g. 600"
                value={formData.averageItemLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, averageItemLevel: value })
                }
              />

              {/* Min Raider.IO Score */}
              <Input
                type="number"
                label="Minimum Raider.IO Score"
                placeholder="e.g. 2500"
                value={formData.raiderIoScore}
                onValueChange={(value) =>
                  setFormData({ ...formData, raiderIoScore: value })
                }
              />
            </div>

            <div className="flex gap-4 mt-6">
              <Button color="primary" onPress={handleSearch}>
                Search
              </Button>
              <Button variant="bordered" onPress={handleReset}>
                Reset
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Results */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardBody className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-4 rounded-lg" />
                  <Skeleton className="h-6 w-1/2 mb-2 rounded-lg" />
                  <Skeleton className="h-6 w-2/3 rounded-lg" />
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card>
            <CardBody className="text-center p-8">
              <p className="text-danger">Error loading characters: {error.message}</p>
            </CardBody>
          </Card>
        )}

        {data && data.characters && data.characters.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-default-600">
                Found {data.characters.length} character{data.characters.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.characters.map((character) => (
                <Card key={character.guid} isPressable>
                  <CardBody className="p-6">
                    <Link href={`/character/${character.guid}`}>
                      <div className="space-y-3">
                        {/* Character Name */}
                        <div>
                          <h3 className="text-xl font-bold">{character.name}</h3>
                          <p className="text-sm text-default-500">@{character.realm}</p>
                        </div>

                        {/* Character Details */}
                        <div className="flex flex-wrap gap-2">
                          {character.level && (
                            <Chip size="sm" variant="flat" color="primary">
                              Level {character.level}
                            </Chip>
                          )}
                          {character.class && (
                            <Chip
                              size="sm"
                              variant="flat"
                              color={getClassColor(character.class)}
                            >
                              {character.class}
                            </Chip>
                          )}
                          {character.faction && (
                            <Chip
                              size="sm"
                              variant="flat"
                              color={getFactionColor(character.faction)}
                            >
                              {character.faction}
                            </Chip>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="space-y-1 text-sm">
                          {character.equippedItemLevel && (
                            <div className="flex justify-between">
                              <span className="text-default-600">Item Level:</span>
                              <span className="font-semibold">{character.equippedItemLevel}</span>
                            </div>
                          )}
                          {character.achievementPoints && (
                            <div className="flex justify-between">
                              <span className="text-default-600">Achievements:</span>
                              <span className="font-semibold">
                                {character.achievementPoints.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {character.specialization && (
                            <div className="flex justify-between">
                              <span className="text-default-600">Spec:</span>
                              <span className="font-semibold">{character.specialization}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </div>
          </>
        )}

        {data && (!data.characters || data.characters.length === 0) && searchParams && (
          <Card>
            <CardBody className="text-center p-8">
              <p className="text-default-600">
                No characters found matching your criteria. Try adjusting your filters.
              </p>
            </CardBody>
          </Card>
        )}

        {!searchParams && !isLoading && (
          <Card>
            <CardBody className="text-center p-8">
              <p className="text-default-600">
                Use the filters above to search for characters looking for a guild
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </main>
  );
}
