import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import { Link } from '@/components/custom-link';
import { apiClient } from '@/lib/api';
import type { CharactersResponse } from '@/types/entities';

interface HashPageProps {
  params: Promise<{ id: string }>;
}

async function getHashData(hash: string) {
  try {
    const response = await apiClient.get<CharactersResponse>(
      '/api/osint/character/hash',
      { hash }
    );

    if (!response.characters || response.characters.length === 0) {
      return null;
    }

    return response.characters;
  } catch (error) {
    console.error('Error fetching hash data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: HashPageProps): Promise<Metadata> {
  const { id } = await params;
  const title = id.toString().toUpperCase();

  return {
    title: `CMNW: ${title}`,
    description: 'All available hash matches for dynamic hash value',
    openGraph: {
      title: `CMNW: ${title}`,
      description: 'Hash matches and related characters',
    },
  };
}

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

export default async function HashPage({ params }: HashPageProps) {
  const { id } = await params;
  const characters = await getHashData(id);

  if (!characters) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader className="flex flex-col items-start">
            <h1 className="text-3xl font-bold">Account Characters</h1>
            <p className="text-sm text-default-500 mt-2">
              Hash: <code className="text-xs bg-default-100 px-2 py-1 rounded">{id}</code>
            </p>
          </CardHeader>
          <CardBody>
            <p className="text-default-600">
              Found {characters.length} character{characters.length !== 1 ? 's' : ''} on this account
            </p>
          </CardBody>
        </Card>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <Card key={character.guid} isPressable as={Link} href={`/character/${character.guid}`}>
              <CardBody className="p-6">
                <div className="space-y-3">
                  {/* Character Name */}
                  <div>
                    <h3 className="text-xl font-bold">{character.name}</h3>
                    <p className="text-sm text-default-500">@{character.realm}</p>
                  </div>

                  <Divider />

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
                    {character.race && (
                      <div className="flex justify-between">
                        <span className="text-default-600">Race:</span>
                        <span>{character.race}</span>
                      </div>
                    )}
                    {character.specialization && (
                      <div className="flex justify-between">
                        <span className="text-default-600">Spec:</span>
                        <span>{character.specialization}</span>
                      </div>
                    )}
                  </div>

                  {/* Guild Info */}
                  {character.guild && (
                    <>
                      <Divider />
                      <div className="text-sm">
                        <span className="text-default-600">Guild: </span>
                        <span className="font-medium">{character.guild}</span>
                        {character.guildRank !== undefined && (
                          <Chip size="sm" variant="bordered" className="ml-2">
                            {character.guildRank === 0 ? 'GM' : `R${character.guildRank}`}
                          </Chip>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
