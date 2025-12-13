import type {
  Character,
  CharacterLogsResponse,
  CharacterPageProps,
} from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import {
  CharacterTitle,
  CharacterButtons,
  CharacterStats,
} from "@/components/character";
import { LogTable } from "@/components/log-table";
import { characterPortrait } from "@/lib";
import { apiClient } from "@/lib/api";
import { stringToFaction } from "@/lib/utils/faction-converter";

async function getCharacterData(encodedGuid: string) {
  // Decode the URL-encoded GUID before passing to API
  const guid = decodeURIComponent(encodedGuid);

  try {
    const [character, logsResponse] = await Promise.all([
      apiClient.get<Character>("/api/osint/character", { guid }),
      apiClient
        .get<CharacterLogsResponse>("/api/osint/character/logs", { guid })
        .catch(() => ({ logs: [] })), // Handle missing logs gracefully
    ]);

    return {
      character,
      logs: logsResponse.logs || [],
    };
  } catch (error) {
    console.error("Error fetching character data:", error);

    return null;
  }
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { guid } = await params;
  const data = await getCharacterData(guid);

  if (!data) {
    return {
      title: "Character Not Found",
    };
  }

  const { character } = data;
  const factionEnum = stringToFaction(character.faction);
  const portrait = characterPortrait(factionEnum, character.mainImage);
  const title = `CMNW: ${character.name.toLowerCase()}@${character.realm.toLowerCase()}`;

  return {
    title,
    description: "Character profile and statistics",
    openGraph: {
      title,
      description: "Character profile and statistics",
      images: [{ url: portrait }],
    },
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { guid } = await params;
  const data = await getCharacterData(guid);

  if (!data) {
    notFound();
  }

  const { character, logs } = data;
  const factionEnum = stringToFaction(character.faction);
  const portrait = characterPortrait(factionEnum, character.mainImage);

  return (
    <main className="min-h-screen pt-16 pb-12 lg:pt-20 lg:pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Character Header */}
        <CharacterTitle
          faction={factionEnum}
          guild={character.guild}
          guildId={character.guildGuid}
          guildRank={character.guildRank}
          name={character.name}
          realm={character.realm}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Portrait */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div
                className="relative w-full rounded-xl shadow-xl overflow-hidden"
                style={{ minHeight: "60vh" }}
              >
                <Image
                  fill
                  priority
                  alt={`${character.name} portrait`}
                  className="object-cover"
                  src={portrait}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Stats and External Links */}
          <div className="lg:col-span-8">
            {/* Character Stats */}
            <CharacterStats character={character} />

            {/* External Links */}
            <CharacterButtons name={character.name} realm={character.realm} />
          </div>
        </div>

        {/* Logs Section - Full Width */}
        {logs && logs.length > 0 && (
          <div className="mt-10 lg:mt-12">
            <LogTable logs={logs as any} />
          </div>
        )}
      </div>
    </main>
  );
}
