import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CharacterTitle } from '@/components/character-title';
import { CharacterButtons } from '@/components/character-buttons';
import { CharacterProfile } from '@/components/character-profile';
import { LogTable } from '@/components/log-table';
import { characterPortrait } from '@/lib';
import { DOMAINS } from '@/lib/constants';
import { characterResponse } from '@/lib/types';

interface Log {
  _id: string;
  event: string;
  action: string;
  original: string | number;
  updated: string | number;
  t0: number | string;
  t1: number | string;
}

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

async function getCharacterData(id: string) {
  try {
    const [characterRes, logsRes] = await Promise.all([
      fetch(`${DOMAINS.domain}/api/osint/character?_id=${id}`, {
        next: { revalidate: 3600 } // Revalidate every hour
      }),
      fetch(`${DOMAINS.domain}/api/osint/character/logs?_id=${id}`, {
        next: { revalidate: 3600 }
      })
    ]);

    if (!characterRes.ok) {
      return null;
    }

    const character = await characterRes.json() as characterResponse;
    const logs = logsRes.ok ? await logsRes.json() as Log[] : [];

    return {
      character,
      logs
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
  const portrait = characterPortrait(character.faction, character.main);
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
  const portrait = characterPortrait(character.faction, character.main);

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
                guild_id={character.guild_id}
                guild_rank={character.guild_rank}
                faction={character.faction}
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

          {/* Right Column - Character Profile */}
          <div className="md:col-span-7">
            <div className="pt-8">
              <CharacterProfile character={character} />
            </div>
          </div>
        </div>

        {/* Logs Section - Full Width */}
        {logs && logs.length > 0 && (
          <div className="mt-8">
            <LogTable logs={logs} />
          </div>
        )}
      </div>
    </main>
  );
}
