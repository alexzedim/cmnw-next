import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HashTitle } from '@/components/hash-title';
import { CharacterTable } from '@/components/character-table';
import { DOMAINS } from '@/lib/constants';

interface Character {
  _id: string;
  hash_a?: string;
  hash_b?: string;
  guild?: string;
  guild_id?: string;
  guild_rank?: number;
  average_item_level?: number;
  character_class?: string;
  active_spec?: string;
  level?: number;
  faction?: string;
  race?: string;
  gender?: string;
  chosen_covenant?: string;
  renown_level?: number;
  last_modified?: string;
}

interface HashPageProps {
  params: Promise<{ id: string }>;
}

async function getHashData(id: string) {
  try {
    const res = await fetch(`${DOMAINS.domain}/api/osint/character/hash?hash=${id}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    const characters = await res.json() as Character[];
    
    if (!characters || characters.length === 0) {
      return null;
    }

    return characters;
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

export default async function HashPage({ params }: HashPageProps) {
  const { id } = await params;
  const characters = await getHashData(id);

  if (!characters) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <HashTitle id={id} />
        <CharacterTable characters={characters} roster={false} />
      </div>
    </main>
  );
}
