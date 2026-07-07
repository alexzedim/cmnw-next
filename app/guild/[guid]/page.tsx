import type {
  GuildResponse,
  GuildLogsResponse,
  GuildPageProps,
} from "@/lib/types";

import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuildTitle } from "@/components/guild/guild-title";
import { GuildRoster } from "@/components/guild/guild-roster";
import { LogTable } from "@/components/shared/log-table";
import { serverFetch } from "@/lib/api/origins";
import { stringToFaction } from "@/lib/utils/faction-converter";

// serverFetch() targets the backend directly (Docker DNS → host hairpin
// fallback). Do NOT use apiClient.get() here — it routes through
// clientFetch(), which is browser-only and fails with "Failed to parse URL"
// when handed a relative path in a Server Component.
const getGuildData = cache(async function (encodedGuid: string) {
  const guid = decodeURIComponent(encodedGuid);
  const params = new URLSearchParams({ guid });

  try {
    const [guildRes, logsRes] = await Promise.all([
      serverFetch(`/api/osint/guild?${params}`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }),
      serverFetch(`/api/osint/guild/logs?${params}`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }).catch(() => null),
    ]);

    if (!guildRes.ok) {
      return null;
    }

    const guildResponse = (await guildRes.json()) as GuildResponse;
    const logsResponse = logsRes?.ok
      ? ((await logsRes.json()) as GuildLogsResponse)
      : { logs: [] };

    return {
      guild: guildResponse.guild,
      members: guildResponse.members,
      memberCount: guildResponse.memberCount,
      logs: logsResponse.logs || [],
    };
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: GuildPageProps): Promise<Metadata> {
  const { guid } = await params;
  const data = await getGuildData(guid);

  if (!data) {
    return {
      title: "Guild Not Found",
    };
  }

  const { guild, memberCount } = data;
  const title = `CMNW: ${guild.name}@${guild.realm}`;

  return {
    title,
    description: `Guild profile for ${guild.name} on ${guild.realm}. ${memberCount} members.`,
    openGraph: {
      title,
      description: `Guild profile with ${memberCount} members`,
    },
  };
}

export default async function GuildPage({ params }: GuildPageProps) {
  const { guid } = await params;
  const data = await getGuildData(guid);

  if (!data) {
    notFound();
  }

  const { guild, members, memberCount, logs } = data;
  const factionEnum = stringToFaction(guild.faction);

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <GuildTitle
          achievement_points={guild.achievementPoints || 0}
          created_timestamp={guild.createdTimestamp ?? 0}
          faction={factionEnum}
          member_count={memberCount}
          members={members}
          name={guild.name}
          realm={guild.realm}
        />

        <div className="my-8 h-px bg-[var(--border)]" />

        {members && members.length > 0 && (
          <>
            <GuildRoster members={members} />
            <div className="my-8 h-px bg-[var(--border)]" />
          </>
        )}

        {logs && logs.length > 0 && <LogTable logs={logs} />}
      </div>
    </main>
  );
}
