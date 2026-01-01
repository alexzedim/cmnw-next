import type {
  GuildResponse,
  GuildLogsResponse,
  GuildPageProps,
} from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuildTitle } from "@/components/guild/guild-title";
import { GuildRoster } from "@/components/guild/guild-roster";
import { LogTable } from "@/components/shared/log-table";
import { apiClient } from "@/lib/api";
import { stringToFaction } from "@/lib/utils/faction-converter";

async function getGuildData(decodedGuid: string) {
  // Encode the decoded GUID before passing to API
  const guid = decodedGuid;

  try {
    const [guildResponse, logsResponse] = await Promise.all([
      apiClient.get<GuildResponse>("/api/osint/guild", { guid }),
      apiClient
        .get<GuildLogsResponse>("/api/osint/guild/logs", { guid })
        .catch(() => ({ logs: [] })), // Handle missing logs gracefully
    ]);

    return {
      guild: guildResponse.guild,
      members: guildResponse.members,
      memberCount: guildResponse.memberCount,
      logs: logsResponse.logs || [],
    };
  } catch (error) {
    console.error("Error fetching guild data:", error);

    return null;
  }
}

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
          created_timestamp={
            guild.createdTimestamp
              ? new Date(guild.createdTimestamp).getTime()
              : Date.now()
          }
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

        {logs && logs.length > 0 && <LogTable logs={logs as any} />}
      </div>
    </main>
  );
}
