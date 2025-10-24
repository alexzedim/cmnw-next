import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Divider } from "@heroui/react";
import { GuildTitle } from '@/components/guild-title';
import { CharacterTable } from '@/components/character-table';
import { LogTable } from '@/components/log-table';
import { DOMAINS } from '@/lib/constants';
import { Faction } from '@/lib/types';

interface GuildMember {
  _id: string;
  hash_a?: string;
  hash_b?: string;
  rank?: number;
  average_item_level?: number;
  character_class?: string;
  active_spec?: string;
  achievement_points?: number;
  level?: number;
  race?: string;
  gender?: string;
  chosen_covenant?: string;
  renown_level?: number;
  last_modified?: string;
}

interface Log {
  _id: string;
  event: string;
  action: string;
  original: string | number;
  updated: string | number;
  t0: number | string;
  t1: number | string;
}

interface GuildResponse {
  _id: string;
  name: string;
  realm: string;
  faction: Faction;
  created_timestamp: number;
  achievement_points: number;
  member_count: number;
  members: GuildMember[];
}

interface GuildPageProps {
  params: Promise<{ id: string }>;
}

async function getGuildData(id: string) {
  try {
    const [guildRes, logsRes] = await Promise.all([
      fetch(`${DOMAINS.domain}/api/osint/guild?_id=${id}`, {
        next: { revalidate: 3600 } // Revalidate every hour
      }),
      fetch(`${DOMAINS.domain}/api/osint/guild/logs?_id=${id}`, {
        next: { revalidate: 3600 }
      })
    ]);

    if (!guildRes.ok) {
      return null;
    }

    const guild = await guildRes.json() as GuildResponse;
    const logs = logsRes.ok ? await logsRes.json() as Log[] : [];

    return {
      guild,
      logs
    };
  } catch (error) {
    console.error('Error fetching guild data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: GuildPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getGuildData(id);
  
  if (!data) {
    return {
      title: 'Guild Not Found',
    };
  }

  const { guild } = data;
  const title = `CMNW: ${guild.name}@${guild.realm}`;

  return {
    title,
    description: `Guild profile for ${guild.name} on ${guild.realm}. ${guild.member_count} members.`,
    openGraph: {
      title,
      description: `Guild profile with ${guild.member_count} members`,
    },
  };
}

export default async function GuildPage({ params }: GuildPageProps) {
  const { id } = await params;
  const data = await getGuildData(id);

  if (!data) {
    notFound();
  }

  const { guild, logs } = data;

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <GuildTitle
          name={guild.name}
          realm={guild.realm}
          member_count={guild.member_count}
          created_timestamp={guild.created_timestamp}
          achievement_points={guild.achievement_points}
          faction={guild.faction}
        />

        <Divider className="my-8" />

        {guild.members && guild.members.length > 0 && (
          <>
            <CharacterTable characters={guild.members} roster={true} />
            <Divider className="my-8" />
          </>
        )}

        {logs && logs.length > 0 && (
          <LogTable logs={logs} />
        )}
      </div>
    </main>
  );
}
