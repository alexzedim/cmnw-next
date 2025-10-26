import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CharacterTitle } from '@/components/character-title';
import { CharacterButtons } from '@/components/character-buttons';
import { CharacterStats } from '@/components/character/character-stats';
import { LogTable } from '@/components/log-table';
import { characterPortrait } from '@/lib';
import { apiClient } from '@/lib/api';
import type { Character, CharacterLogsResponse } from '@/types/entities';

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

async function getCharacterData(encodedGuid: string) {
  // Decode the URL-encoded GUID before passing to API
  const guid = decodeURIComponent(encodedGuid);
  
  try {
    const [character, logsResponse] = await Promise.all([
      apiClient.get<Character>('/api/osint/character', { guid }),
      apiClient.get<CharacterLogsResponse>('/api/osint/character/logs', { guid })
        .catch(() => ({ logs: [] })) // Handle missing logs gracefully
    ]);

    return {
      character,
      logs: logsResponse.logs || []
    };
  } catch (error) {
    console.error('Error fetching character data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getCharacterData(id);
  
  if (!data) {
    return {
      title: 'Character Not Found',
    };
  }

  const { character } = data;
  const portrait = characterPortrait(character.faction as any, character.mainImage);
  const title = `CMNW: ${character.name.toLowerCase()}@${character.realm.toLowerCase()}`;

  return {
    title,
    description: 'Character profile and statistics',
    openGraph: {
      title,
      description: 'Character profile and statistics',
      images: [{ url: portrait }],
    },
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const data = await getCharacterData(id);

  if (!data) {
    notFound();
  }

  const { character, logs } = data;
  const portrait = characterPortrait(character.faction as any, character.mainImage);

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Portrait and Title */}
          <div className="md:col-span-4">
            <div className="max-w-md mx-auto">
              <div className="relative w-full rounded-xl shadow-2xl overflow-hidden" style={{ minHeight: '70vh' }}>
                <Image
                  src={portrait}
                  alt={`${character.name} portrait`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <CharacterTitle
                name={character.name}
                realm={character.realm}
                guild={character.guild}
                guild_id={character.guildGuid}
                guild_rank={character.guildRank}
                faction={character.faction as any}
              />
            </div>
          </div>

          {/* Middle Column - External Links */}
          <div className="md:col-span-1 flex items-start justify-center pt-8">
            <CharacterButtons 
              name={character.name} 
              realm={character.realm}
            />
          </div>

          {/* Right Column - Character Stats */}
          <div className="md:col-span-7">
            <div className="pt-8">
              <CharacterStats character={character} />
            </div>
          </div>
        </div>

        {/* Logs Section - Full Width */}
        {logs && logs.length > 0 && (
          <div className="mt-8">
            <LogTable logs={logs as any} />
          </div>
        )}
      </div>
    </main>
  );
}
